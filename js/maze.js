/**
 * Maze Generator using Recursive Backtracking Algorithm
 * Creates a perfect maze with guaranteed solution
 */

class Maze {
    constructor(rows, cols, cellSize) {
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.grid = [];
        this.stack = [];
        
        this.initializeGrid();
        this.generate();
    }

    /**
     * Initialize the grid with all walls
     */
    initializeGrid() {
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = {
                    row: row,
                    col: col,
                    walls: {
                        top: true,
                        right: true,
                        bottom: true,
                        left: true
                    },
                    visited: false
                };
            }
        }
    }

    /**
     * Generate maze using recursive backtracking
     */
    generate() {
        // Start from top-left corner
        let current = this.grid[0][0];
        current.visited = true;
        this.stack.push(current);

        while (this.stack.length > 0) {
            current = this.stack[this.stack.length - 1];
            const neighbors = this.getUnvisitedNeighbors(current);

            if (neighbors.length > 0) {
                // Choose random neighbor
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                
                // Remove wall between current and next
                this.removeWall(current, next);
                
                // Mark next as visited and push to stack
                next.visited = true;
                this.stack.push(next);
            } else {
                // Backtrack
                this.stack.pop();
            }
        }

        // Reset visited flags for pathfinding if needed
        this.resetVisited();
    }

    /**
     * Get unvisited neighbors of a cell
     */
    getUnvisitedNeighbors(cell) {
        const neighbors = [];
        const { row, col } = cell;

        // Top
        if (row > 0 && !this.grid[row - 1][col].visited) {
            neighbors.push(this.grid[row - 1][col]);
        }
        // Right
        if (col < this.cols - 1 && !this.grid[row][col + 1].visited) {
            neighbors.push(this.grid[row][col + 1]);
        }
        // Bottom
        if (row < this.rows - 1 && !this.grid[row + 1][col].visited) {
            neighbors.push(this.grid[row + 1][col]);
        }
        // Left
        if (col > 0 && !this.grid[row][col - 1].visited) {
            neighbors.push(this.grid[row][col - 1]);
        }

        return neighbors;
    }

    /**
     * Remove wall between two adjacent cells
     */
    removeWall(current, next) {
        const rowDiff = current.row - next.row;
        const colDiff = current.col - next.col;

        if (rowDiff === 1) {
            // Next is above current
            current.walls.top = false;
            next.walls.bottom = false;
        } else if (rowDiff === -1) {
            // Next is below current
            current.walls.bottom = false;
            next.walls.top = false;
        } else if (colDiff === 1) {
            // Next is left of current
            current.walls.left = false;
            next.walls.right = false;
        } else if (colDiff === -1) {
            // Next is right of current
            current.walls.right = false;
            next.walls.left = false;
        }
    }

    /**
     * Reset visited flags
     */
    resetVisited() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col].visited = false;
            }
        }
    }

    /**
     * Get start position (top-left)
     */
    getStartPosition() {
        return {
            row: 0,
            col: 0,
            x: this.cellSize / 2,
            y: this.cellSize / 2
        };
    }

    /**
     * Get end position (bottom-right)
     */
    getEndPosition() {
        return {
            row: this.rows - 1,
            col: this.cols - 1,
            x: (this.cols - 1) * this.cellSize + this.cellSize / 2,
            y: (this.rows - 1) * this.cellSize + this.cellSize / 2
        };
    }

    /**
     * Check if a position collides with walls
     */
    checkCollision(x, y, playerRadius) {
        // Get current cell
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        // Check bounds
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return true;
        }

        const cell = this.grid[row][col];
        const cellX = col * this.cellSize;
        const cellY = row * this.cellSize;

        // Check collision with each wall
        // Top wall
        if (cell.walls.top && y - playerRadius < cellY) {
            return true;
        }
        // Bottom wall
        if (cell.walls.bottom && y + playerRadius > cellY + this.cellSize) {
            return true;
        }
        // Left wall
        if (cell.walls.left && x - playerRadius < cellX) {
            return true;
        }
        // Right wall
        if (cell.walls.right && x + playerRadius > cellX + this.cellSize) {
            return true;
        }

        return false;
    }

    /**
     * Draw the maze on canvas
     */
    draw(ctx) {
        // Draw semi-transparent white background for maze visibility
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw maze walls
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.grid[row][col];
                const x = col * this.cellSize;
                const y = row * this.cellSize;

                ctx.beginPath();

                // Draw walls
                if (cell.walls.top) {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + this.cellSize, y);
                }
                if (cell.walls.right) {
                    ctx.moveTo(x + this.cellSize, y);
                    ctx.lineTo(x + this.cellSize, y + this.cellSize);
                }
                if (cell.walls.bottom) {
                    ctx.moveTo(x, y + this.cellSize);
                    ctx.lineTo(x + this.cellSize, y + this.cellSize);
                }
                if (cell.walls.left) {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + this.cellSize);
                }

                ctx.stroke();
            }
        }

        // Draw start (green)
        const start = this.getStartPosition();
        ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
        ctx.fillRect(0, 0, this.cellSize, this.cellSize);

        // Draw end (red/goal)
        const end = this.getEndPosition();
        ctx.fillStyle = 'rgba(76, 175, 80, 0.8)';
        ctx.fillRect(
            (this.cols - 1) * this.cellSize,
            (this.rows - 1) * this.cellSize,
            this.cellSize,
            this.cellSize
        );
    }

    /**
     * Get maze dimensions
     */
    getDimensions() {
        return {
            width: this.cols * this.cellSize,
            height: this.rows * this.cellSize
        };
    }
}
