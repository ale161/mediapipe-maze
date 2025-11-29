/**
 * UI Manager
 * Handles screen transitions and UI updates
 */

class UIManager {
    constructor() {
        // Screens
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.levelCompleteScreen = document.getElementById('levelCompleteScreen');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Welcome screen elements
        this.playerNameInput = document.getElementById('playerName');
        this.startButton = document.getElementById('startButton');
        this.cameraStatus = document.getElementById('cameraStatus');
        
        // Game screen elements
        this.displayPlayerName = document.getElementById('displayPlayerName');
        this.currentLevelDisplay = document.getElementById('currentLevel');
        this.timerDisplay = document.getElementById('timer');
        this.distanceDisplay = document.getElementById('distance');
        this.bestScoreDisplay = document.getElementById('bestScore');
        
        // Level complete screen elements
        this.completedLevelDisplay = document.getElementById('completedLevel');
        this.finalTimeDisplay = document.getElementById('finalTime');
        this.finalDistanceDisplay = document.getElementById('finalDistance');
        this.currentScoreDisplay = document.getElementById('currentScore');
        this.sessionBestScoreDisplay = document.getElementById('sessionBestScore');
        this.nextLevelButton = document.getElementById('nextLevelButton');
        
        // Callbacks
        this.onStartGame = null;
        this.onNextLevel = null;
        
        // Setup event listeners
        this.setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Start button
        this.startButton.addEventListener('click', () => {
            const playerName = this.playerNameInput.value.trim();
            if (playerName === '') {
                this.showCameraStatus('Παρακαλώ εισάγετε το όνομά σας!', 'error');
                return;
            }
            
            if (this.onStartGame) {
                this.onStartGame(playerName);
            }
        });
        
        // Next level button
        this.nextLevelButton.addEventListener('click', () => {
            if (this.onNextLevel) {
                this.onNextLevel();
            }
        });
        
        // Enter key on name input
        this.playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startButton.click();
            }
        });
    }

    /**
     * Show welcome screen
     */
    showWelcomeScreen() {
        this.hideAllScreens();
        this.welcomeScreen.classList.add('active');
        this.playerNameInput.focus();
    }

    /**
     * Show game screen
     */
    showGameScreen() {
        this.hideAllScreens();
        this.gameScreen.classList.add('active');
    }

    /**
     * Show level complete screen
     */
    showLevelCompleteScreen() {
        this.hideAllScreens();
        this.levelCompleteScreen.classList.add('active');
    }

    /**
     * Hide all screens
     */
    hideAllScreens() {
        this.welcomeScreen.classList.remove('active');
        this.gameScreen.classList.remove('active');
        this.levelCompleteScreen.classList.remove('active');
    }

    /**
     * Show loading overlay
     */
    showLoading(message = 'Φόρτωση...') {
        this.loadingOverlay.querySelector('p').textContent = message;
        this.loadingOverlay.classList.add('active');
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        this.loadingOverlay.classList.remove('active');
    }

    /**
     * Show camera status message
     */
    showCameraStatus(message, type = 'info') {
        this.cameraStatus.textContent = message;
        this.cameraStatus.style.color = type === 'error' ? '#f44336' : '#666';
    }

    /**
     * Update player name display
     */
    updatePlayerName(name) {
        this.displayPlayerName.textContent = `👤 ${name}`;
    }

    /**
     * Update game stats during gameplay
     */
    updateGameStats(level, time, distance, bestScore) {
        this.currentLevelDisplay.textContent = level;
        this.timerDisplay.textContent = ScoreManager.formatTime(time);
        this.distanceDisplay.textContent = ScoreManager.formatDistance(distance);
        this.bestScoreDisplay.textContent = ScoreManager.formatScore(bestScore);
    }

    /**
     * Update level complete screen
     */
    updateLevelCompleteScreen(results) {
        this.completedLevelDisplay.textContent = results.level;
        this.finalTimeDisplay.textContent = ScoreManager.formatTime(results.time);
        this.finalDistanceDisplay.textContent = ScoreManager.formatDistance(results.distance);
        this.currentScoreDisplay.textContent = ScoreManager.formatScore(results.score);
        this.sessionBestScoreDisplay.textContent = ScoreManager.formatScore(results.bestScore);
    }

    /**
     * Disable start button
     */
    disableStartButton() {
        this.startButton.disabled = true;
    }

    /**
     * Enable start button
     */
    enableStartButton() {
        this.startButton.disabled = false;
    }

    /**
     * Set start game callback
     */
    setOnStartGame(callback) {
        this.onStartGame = callback;
    }

    /**
     * Set next level callback
     */
    setOnNextLevel(callback) {
        this.onNextLevel = callback;
    }

    /**
     * Show error message
     */
    showError(message) {
        alert(message);
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        // Could implement a toast notification here
        console.log('Success:', message);
    }
}
