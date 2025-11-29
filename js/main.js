/**
 * Main Application Entry Point
 * Orchestrates all components and manages application flow
 */

class MazeGameApp {
    constructor() {
        // Initialize managers
        this.uiManager = new UIManager();
        this.scoreManager = new ScoreManager();
        
        // Get DOM elements
        this.videoElement = document.getElementById('videoElement');
        this.handCanvas = document.getElementById('handCanvas');
        this.gameCanvas = document.getElementById('gameCanvas');
        
        // Initialize controllers
        this.handController = null;
        this.game = null;
        
        // Game state
        this.isInitialized = false;
        this.currentLevel = 1;
        
        // Stats update interval
        this.statsInterval = null;
        
        // Setup callbacks
        this.setupCallbacks();
    }

    /**
     * Setup UI callbacks
     */
    setupCallbacks() {
        // Start game callback
        this.uiManager.setOnStartGame((playerName) => {
            this.startGame(playerName);
        });
        
        // Next level callback
        this.uiManager.setOnNextLevel(() => {
            this.nextLevel();
        });
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing Maze Game App...');
        
        // Show welcome screen
        this.uiManager.showWelcomeScreen();
        
        console.log('App ready. Waiting for user to start...');
    }

    /**
     * Start game with player name
     */
    async startGame(playerName) {
        try {
            // Disable start button
            this.uiManager.disableStartButton();
            this.uiManager.showCameraStatus('Αρχικοποίηση κάμερας...', 'info');
            
            // Set player name
            this.scoreManager.setPlayerName(playerName);
            this.uiManager.updatePlayerName(playerName);
            
            // Show loading
            this.uiManager.showLoading('Φόρτωση MediaPipe...');
            
            // Initialize hand controller if not already done
            if (!this.handController) {
                this.handController = new HandController(this.videoElement, this.handCanvas);
                await this.handController.initialize();
                
                // Set hand canvas size
                this.handCanvas.width = 640;
                this.handCanvas.height = 480;
            }
            
            // Initialize game
            if (!this.game) {
                this.game = new Game(this.gameCanvas, this.handController, this.scoreManager);
                
                // Set level complete callback
                this.game.setOnLevelComplete((results) => {
                    this.onLevelComplete(results);
                });
            }
            
            // Hide loading
            this.uiManager.hideLoading();
            
            // Start first level
            this.currentLevel = 1;
            this.startLevel(this.currentLevel);
            
            // Show game screen
            this.uiManager.showGameScreen();
            
            // Start stats update
            this.startStatsUpdate();
            
            console.log('Game started successfully!');
            
        } catch (error) {
            console.error('Failed to start game:', error);
            this.uiManager.hideLoading();
            this.uiManager.enableStartButton();
            this.uiManager.showCameraStatus(
                'Σφάλμα: Δεν ήταν δυνατή η πρόσβαση στην κάμερα. Παρακαλώ επιτρέψτε την πρόσβαση και δοκιμάστε ξανά.',
                'error'
            );
        }
    }

    /**
     * Start a specific level
     */
    startLevel(level) {
        console.log(`Starting level ${level}...`);
        
        // Initialize level
        this.game.initLevel(level);
        
        // Start game loop
        this.game.start();
        
        console.log(`Level ${level} started!`);
    }

    /**
     * Handle level completion
     */
    onLevelComplete(results) {
        console.log('Level completed!', results);
        
        // Stop stats update
        this.stopStatsUpdate();
        
        // Update level complete screen
        this.uiManager.updateLevelCompleteScreen(results);
        
        // Show level complete screen
        this.uiManager.showLevelCompleteScreen();
    }

    /**
     * Start next level
     */
    nextLevel() {
        // Increment level
        this.currentLevel++;
        
        // Show game screen
        this.uiManager.showGameScreen();
        
        // Start level
        this.startLevel(this.currentLevel);
        
        // Resume stats update
        this.startStatsUpdate();
    }

    /**
     * Start stats update interval
     */
    startStatsUpdate() {
        // Clear existing interval
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
        }
        
        // Update stats every 100ms
        this.statsInterval = setInterval(() => {
            this.updateStats();
        }, 100);
    }

    /**
     * Stop stats update interval
     */
    stopStatsUpdate() {
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
            this.statsInterval = null;
        }
    }

    /**
     * Update game stats display
     */
    updateStats() {
        if (!this.game || !this.game.isRunning) {
            return;
        }
        
        const level = this.scoreManager.getCurrentLevel();
        const time = this.scoreManager.getElapsedTime();
        const distance = this.scoreManager.getTotalDistance();
        const bestScore = this.scoreManager.getBestScore();
        
        this.uiManager.updateGameStats(level, time, distance, bestScore);
    }

    /**
     * Cleanup and stop everything
     */
    cleanup() {
        // Stop game
        if (this.game) {
            this.game.stop();
        }
        
        // Stop hand controller
        if (this.handController) {
            this.handController.stop();
        }
        
        // Stop stats update
        this.stopStatsUpdate();
        
        console.log('Cleanup completed');
    }
}

// Initialize app when DOM is ready
let app;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded. Initializing app...');
    
    app = new MazeGameApp();
    app.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (app) {
        app.cleanup();
    }
});
