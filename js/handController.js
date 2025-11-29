/**
 * Hand Controller using MediaPipe Hands
 * Tracks hand position and converts to game coordinates
 */

class HandController {
    constructor(videoElement, canvasElement) {
        this.videoElement = videoElement;
        this.canvasElement = canvasElement;
        this.canvasCtx = canvasElement.getContext('2d');
        
        this.hands = null;
        this.camera = null;
        this.isInitialized = false;
        this.isHandDetected = false;
        
        // Hand position (normalized 0-1)
        this.handX = 0.5;
        this.handY = 0.5;
        
        // Smoothing
        this.smoothFactor = 0.3;
        this.prevHandX = 0.5;
        this.prevHandY = 0.5;
        
        // Callbacks
        this.onHandPositionUpdate = null;
        this.onHandDetected = null;
        this.onHandLost = null;
    }

    /**
     * Initialize MediaPipe Hands
     */
    async initialize() {
        try {
            // Create Hands instance
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`;
                }
            });

            // Configure Hands
            this.hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            // Set up results callback
            this.hands.onResults((results) => this.onResults(results));

            // Set up camera
            this.camera = new Camera(this.videoElement, {
                onFrame: async () => {
                    await this.hands.send({ image: this.videoElement });
                },
                width: 640,
                height: 480
            });

            // Start camera
            await this.camera.start();

            this.isInitialized = true;
            console.log('HandController initialized successfully');
            
            return true;
        } catch (error) {
            console.error('Failed to initialize HandController:', error);
            throw error;
        }
    }

    /**
     * Process MediaPipe results
     */
    onResults(results) {
        // Clear canvas
        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        // Draw camera feed (mirrored)
        this.canvasCtx.translate(this.canvasElement.width, 0);
        this.canvasCtx.scale(-1, 1);
        this.canvasCtx.drawImage(
            results.image,
            0, 0,
            this.canvasElement.width,
            this.canvasElement.height
        );
        this.canvasCtx.restore();

        // Check if hand is detected
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            
            // Draw hand landmarks
            this.drawHandLandmarks(landmarks);
            
            // Get index finger tip (landmark 8)
            const indexFingerTip = landmarks[8];
            
            // Update hand position with smoothing
            const targetX = 1 - indexFingerTip.x; // Mirror X coordinate
            const targetY = indexFingerTip.y;
            
            this.handX = this.prevHandX + (targetX - this.prevHandX) * this.smoothFactor;
            this.handY = this.prevHandY + (targetY - this.prevHandY) * this.smoothFactor;
            
            this.prevHandX = this.handX;
            this.prevHandY = this.handY;
            
            // Notify hand detected
            if (!this.isHandDetected) {
                this.isHandDetected = true;
                if (this.onHandDetected) {
                    this.onHandDetected();
                }
            }
            
            // Notify position update
            if (this.onHandPositionUpdate) {
                this.onHandPositionUpdate(this.handX, this.handY);
            }
            
            // Draw pointer indicator
            this.drawPointer(this.handX, this.handY);
        } else {
            // No hand detected
            if (this.isHandDetected) {
                this.isHandDetected = false;
                if (this.onHandLost) {
                    this.onHandLost();
                }
            }
        }
    }

    /**
     * Draw hand landmarks
     */
    drawHandLandmarks(landmarks) {
        const ctx = this.canvasCtx;
        
        // Draw connections
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],  // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8],  // Index
            [0, 9], [9, 10], [10, 11], [11, 12],  // Middle
            [0, 13], [13, 14], [14, 15], [15, 16],  // Ring
            [0, 17], [17, 18], [18, 19], [19, 20],  // Pinky
            [5, 9], [9, 13], [13, 17]  // Palm
        ];
        
        ctx.strokeStyle = 'rgba(102, 126, 234, 0.5)';
        ctx.lineWidth = 2;
        
        connections.forEach(([start, end]) => {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];
            
            ctx.beginPath();
            ctx.moveTo(
                (1 - startPoint.x) * this.canvasElement.width,
                startPoint.y * this.canvasElement.height
            );
            ctx.lineTo(
                (1 - endPoint.x) * this.canvasElement.width,
                endPoint.y * this.canvasElement.height
            );
            ctx.stroke();
        });
        
        // Draw landmarks
        landmarks.forEach((landmark, index) => {
            const x = (1 - landmark.x) * this.canvasElement.width;
            const y = landmark.y * this.canvasElement.height;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            
            // Highlight index finger tip
            if (index === 8) {
                ctx.fillStyle = '#ff0000';
                ctx.arc(x, y, 8, 0, 2 * Math.PI);
            } else {
                ctx.fillStyle = 'rgba(102, 126, 234, 0.8)';
            }
            
            ctx.fill();
        });
    }

    /**
     * Draw pointer indicator
     */
    drawPointer(normalizedX, normalizedY) {
        const ctx = this.canvasCtx;
        const x = normalizedX * this.canvasElement.width;
        const y = normalizedY * this.canvasElement.height;
        
        // Draw crosshair
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        
        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(x - 15, y);
        ctx.lineTo(x + 15, y);
        ctx.stroke();
        
        // Vertical line
        ctx.beginPath();
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x, y + 15);
        ctx.stroke();
        
        // Circle
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.stroke();
    }

    /**
     * Get current hand position in game coordinates
     */
    getHandPosition(gameWidth, gameHeight) {
        return {
            x: this.handX * gameWidth,
            y: this.handY * gameHeight
        };
    }

    /**
     * Check if hand is currently detected
     */
    isHandVisible() {
        return this.isHandDetected;
    }

    /**
     * Stop camera and clean up
     */
    stop() {
        if (this.camera) {
            this.camera.stop();
        }
        if (this.hands) {
            this.hands.close();
        }
    }

    /**
     * Set callback for hand position updates
     */
    setOnHandPositionUpdate(callback) {
        this.onHandPositionUpdate = callback;
    }

    /**
     * Set callback for hand detected
     */
    setOnHandDetected(callback) {
        this.onHandDetected = callback;
    }

    /**
     * Set callback for hand lost
     */
    setOnHandLost(callback) {
        this.onHandLost = callback;
    }
}
