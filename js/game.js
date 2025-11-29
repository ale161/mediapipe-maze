/**
 * Game Engine
 * Main game loop, collision detection, and game state management
 */

class Game {
    constructor(canvas, handController, scoreManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.handController = handController;
        this.scoreManager = scoreManager;
        
        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.currentLevel = 1;
        
        // Maze
        this.maze = null;
        this.cellSize = 40;
        
        // Player
        this.player = {
            x: 0,
            y: 0,
            radius: 8, // Smaller radius for easier navigation
            color: '#667eea',
            targetX: 0,
            targetY: 0,
            speed: 0.15 // Interpolation speed
        };
        
        // Goal
        this.goal = {
            x: 0,
            y: 0,
            radius: 15, // Smaller radius to fit better in cells
            color: '#4CAF50'
        };
        
        // Animation
        this.animationId = null;
        this.lastFrameTime = 0;
        
        // Callbacks
        this.onLevelComplete = null;
    }

    /**
     * Initialize game with level
     */
    initLevel(level) {
        this.currentLevel = level;
        
        // Calculate maze size based on level
        const baseSize = 8;
        const sizeIncrease = Math.floor((level - 1) / 2) * 1; // Slower increase
        const mazeSize = Math.min(baseSize + sizeIncrease, 15); // Max 15x15 for wider corridors
        
        // Adjust cell size based on maze size with minimum size
        const maxCanvasSize = Math.min(this.canvas.width, this.canvas.height);
        this.cellSize = Math.max(Math.floor(maxCanvasSize / mazeSize), 45); // Min 45px cells
        
        // Create maze
        this.maze = new Maze(mazeSize, mazeSize, this.cellSize);
        
        // Set canvas size to match maze
        const mazeDimensions = this.maze.getDimensions();
        this.canvas.width = mazeDimensions.width;
        this.canvas.height = mazeDimensions.height;
        
        // Set player at start position
        const startPos = this.maze.getStartPosition();
        this.player.x = startPos.x;
        this.player.y = startPos.y;
        this.player.targetX = startPos.x;
        this.player.targetY = startPos.y;
        
        // Set goal at end position
        const endPos = this.maze.getEndPosition();
        this.goal.x = endPos.x;
        this.goal.y = endPos.y;
        
        // Initialize score manager
        this.scoreManager.startLevel(level);
        
        console.log(`Level ${level} initialized: ${mazeSize}x${mazeSize} maze`);
    }

    /**
     * Start game loop
     */
    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    /**
     * Pause game
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Resume game
     */
    resume() {
        this.isPaused = false;
        this.lastFrameTime = performance.now();
    }

    /**
     * Stop game
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    /**
     * Main game loop
     */
    gameLoop(timestamp) {
        if (!this.isRunning) return;
        
        // Calculate delta time
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        
        // Update
        if (!this.isPaused) {
            this.update(deltaTime);
        }
        
        // Render
        this.render();
        
        // Continue loop
        this.animationId = requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    /**
     * Update game state
     */
    update(deltaTime) {
        // Get hand position
        if (this.handController.isHandVisible()) {
            const handPos = this.handController.getHandPosition(
                this.canvas.width,
                this.canvas.height
            );
            
            // Set target position
            this.player.targetX = handPos.x;
            this.player.targetY = handPos.y;
        }
        
        // Interpolate player position towards target
        const dx = this.player.targetX - this.player.x;
        const dy = this.player.targetY - this.player.y;
        
        const newX = this.player.x + dx * this.player.speed;
        const newY = this.player.y + dy * this.player.speed;
        
        // Check collision with maze walls
        if (!this.maze.checkCollision(newX, newY, this.player.radius)) {
            this.player.x = newX;
            this.player.y = newY;
            
            // Update score manager with new position
            this.scoreManager.updatePosition(this.player.x, this.player.y);
        }
        
        // Update time
        this.scoreManager.updateTime();
        
        // Check if player reached goal
        this.checkGoalReached();
    }

    /**
     * Check if player reached the goal
     */
    checkGoalReached() {
        const dx = this.player.x - this.goal.x;
        const dy = this.player.y - this.goal.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.player.radius + this.goal.radius) {
            this.levelComplete();
        }
    }

    /**
     * Handle level completion
     */
    levelComplete() {
        this.stop();
        
        // Calculate final score
        const results = this.scoreManager.completeLevel();
        
        // Notify callback
        if (this.onLevelComplete) {
            this.onLevelComplete(results);
        }
    }

    /**
     * Render game
     */
    render() {
        // Clear canvas - make it transparent to see camera below
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        this.maze.draw(this.ctx);
        
        // Draw goal with pulsing effect
        this.drawGoal();
        
        // Draw player
        this.drawPlayer();
        
        // Draw path trail (optional)
        // this.drawTrail();
    }

    /**
     * Draw player
     */
    drawPlayer() {
        const ctx = this.ctx;
        
        // Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Player circle
        ctx.beginPath();
        ctx.arc(this.player.x, this.player.y, this.player.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.player.color;
        ctx.fill();
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Player outline
        ctx.beginPath();
        ctx.arc(this.player.x, this.player.y, this.player.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Player face (simple emoji-like)
        ctx.fillStyle = '#ffffff';
        
        // Eyes
        ctx.beginPath();
        ctx.arc(this.player.x - 4, this.player.y - 2, 2, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.player.x + 4, this.player.y - 2, 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Smile
        ctx.beginPath();
        ctx.arc(this.player.x, this.player.y + 2, 4, 0, Math.PI);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /**
     * Draw goal with pulsing animation
     */
    drawGoal() {
        const ctx = this.ctx;
        const time = Date.now() / 1000;
        const pulse = Math.sin(time * 3) * 0.2 + 1;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
            this.goal.x, this.goal.y, 0,
            this.goal.x, this.goal.y, this.goal.radius * pulse * 1.5
        );
        gradient.addColorStop(0, 'rgba(76, 175, 80, 0.8)');
        gradient.addColorStop(1, 'rgba(76, 175, 80, 0)');
        
        ctx.beginPath();
        ctx.arc(this.goal.x, this.goal.y, this.goal.radius * pulse * 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Goal circle
        ctx.beginPath();
        ctx.arc(this.goal.x, this.goal.y, this.goal.radius * pulse, 0, 2 * Math.PI);
        ctx.fillStyle = this.goal.color;
        ctx.fill();
        
        // Goal outline
        ctx.beginPath();
        ctx.arc(this.goal.x, this.goal.y, this.goal.radius * pulse, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Star icon in center
        this.drawStar(this.goal.x, this.goal.y, 8, '#ffffff');
    }

    /**
     * Draw star shape
     */
    drawStar(cx, cy, radius, color) {
        const ctx = this.ctx;
        const spikes = 5;
        const outerRadius = radius;
        const innerRadius = radius / 2;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    /**
     * Set level complete callback
     */
    setOnLevelComplete(callback) {
        this.onLevelComplete = callback;
    }

    /**
     * Get current level
     */
    getCurrentLevel() {
        return this.currentLevel;
    }
}
