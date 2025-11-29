/**
 * Score Manager
 * Handles score calculation, tracking, and session management
 */

class ScoreManager {
    constructor() {
        this.playerName = '';
        this.currentLevel = 1;
        this.bestScore = 0;
        this.sessionScores = [];
        
        // Current level stats
        this.startTime = 0;
        this.elapsedTime = 0;
        this.totalDistance = 0;
        this.lastPosition = null;
    }

    /**
     * Set player name
     */
    setPlayerName(name) {
        this.playerName = name;
    }

    /**
     * Get player name
     */
    getPlayerName() {
        return this.playerName;
    }

    /**
     * Start a new level
     */
    startLevel(level) {
        this.currentLevel = level;
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.totalDistance = 0;
        this.lastPosition = null;
    }

    /**
     * Update player position and calculate distance
     */
    updatePosition(x, y) {
        if (this.lastPosition) {
            const dx = x - this.lastPosition.x;
            const dy = y - this.lastPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            this.totalDistance += distance;
        }
        
        this.lastPosition = { x, y };
    }

    /**
     * Update elapsed time
     */
    updateTime() {
        if (this.startTime > 0) {
            this.elapsedTime = (Date.now() - this.startTime) / 1000;
        }
    }

    /**
     * Get current elapsed time
     */
    getElapsedTime() {
        return this.elapsedTime;
    }

    /**
     * Get total distance traveled
     */
    getTotalDistance() {
        return Math.round(this.totalDistance);
    }

    /**
     * Calculate score for current level
     * Formula: score = totalDistance / timeInSeconds
     */
    calculateScore() {
        if (this.elapsedTime === 0) {
            return 0;
        }
        
        const score = this.totalDistance / this.elapsedTime;
        return Math.round(score * 10) / 10; // Round to 1 decimal
    }

    /**
     * Complete current level and update best score
     */
    completeLevel() {
        this.updateTime();
        const score = this.calculateScore();
        
        // Update best score
        if (score > this.bestScore) {
            this.bestScore = score;
        }
        
        // Save to session history
        this.sessionScores.push({
            level: this.currentLevel,
            time: this.elapsedTime,
            distance: this.totalDistance,
            score: score,
            timestamp: Date.now()
        });
        
        return {
            level: this.currentLevel,
            time: this.elapsedTime,
            distance: Math.round(this.totalDistance),
            score: score,
            bestScore: this.bestScore
        };
    }

    /**
     * Get current level
     */
    getCurrentLevel() {
        return this.currentLevel;
    }

    /**
     * Get best score
     */
    getBestScore() {
        return this.bestScore;
    }

    /**
     * Get session statistics
     */
    getSessionStats() {
        if (this.sessionScores.length === 0) {
            return {
                totalLevels: 0,
                totalTime: 0,
                totalDistance: 0,
                averageScore: 0,
                bestScore: 0
            };
        }
        
        const totalTime = this.sessionScores.reduce((sum, s) => sum + s.time, 0);
        const totalDistance = this.sessionScores.reduce((sum, s) => sum + s.distance, 0);
        const averageScore = this.sessionScores.reduce((sum, s) => sum + s.score, 0) / this.sessionScores.length;
        
        return {
            totalLevels: this.sessionScores.length,
            totalTime: Math.round(totalTime * 10) / 10,
            totalDistance: Math.round(totalDistance),
            averageScore: Math.round(averageScore * 10) / 10,
            bestScore: this.bestScore
        };
    }

    /**
     * Reset session (for new game)
     */
    resetSession() {
        this.currentLevel = 1;
        this.bestScore = 0;
        this.sessionScores = [];
        this.startTime = 0;
        this.elapsedTime = 0;
        this.totalDistance = 0;
        this.lastPosition = null;
    }

    /**
     * Format time for display
     */
    static formatTime(seconds) {
        return seconds.toFixed(1) + 's';
    }

    /**
     * Format distance for display
     */
    static formatDistance(distance) {
        return Math.round(distance).toString();
    }

    /**
     * Format score for display
     */
    static formatScore(score) {
        return score.toFixed(1);
    }
}
