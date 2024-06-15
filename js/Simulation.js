import { Grid } from './Grid.js';
import { WaveSource } from './WaveSource.js';
import { Obstacle } from './Obstacle.js';

// Simulation class manages the wave simulation, including canvas rendering and user interactions
export class Simulation {
    constructor(canvasId) {
        // Initialize the canvas and its context for drawing
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Get various simulation parameters from the UI elements
        this.cols = parseInt(document.getElementById('resolutionRange').value);
        this.rows = parseInt(document.getElementById('resolutionRange').value);
        this.damping = parseFloat(document.getElementById('dampingRange').value);
        
        // Create the grid that will hold the wave data
        this.grid = new Grid(this.cols, this.rows, this.damping);
        
        // Initialize arrays to hold wave sources and other state variables
        this.waveSources = [];
        this.drawMode = 'waves';
        this.isDrawing = false;
        this.obstacleSize = parseInt(document.getElementById('obstacleSizeRange').value);
        this.selectedSource = null;
        this.speed = parseInt(document.getElementById('speedRange').value);
        this.maxHeight = parseFloat(document.getElementById('heightRange').value);
        this.originalButtonId = null;
        
        // Setup the canvas size and event listeners
        this.initializeCanvas();
        this.addEventListeners();
        // Start the animation loop
        this.animate();
    }

    // Method to initialize canvas dimensions based on window size
    initializeCanvas() {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = window.innerHeight * 0.6;
    }

    // Method to add various event listeners for user interactions
    addEventListeners() {
        // Handle mouse events for drawing on the canvas
        this.canvas.addEventListener('mousedown', () => {
            this.isDrawing = true;
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });

        this.canvas.addEventListener('mousemove', (event) => {
            if (this.isDrawing && this.drawMode === 'obstacles') {
                const { x, y } = this.getCanvasCoordinates(event);
                if (x > 0 && x < this.cols - 1 && y > 0 && y < this.rows - 1) {
                    this.grid.addObstacle(new Obstacle(x, y, this.obstacleSize));
                }
            }
        });

        // Handle clicks to add waves, obstacles, or wave sources
        this.canvas.addEventListener('click', (event) => {
            const { x, y } = this.getCanvasCoordinates(event);
            if (x > 0 && x < this.cols - 1 && y > 0 && y < this.rows - 1) {
                if (this.drawMode === 'waves') {
                    if (!this.grid.isObstacle(x, y)) {
                        this.grid.previousGrid[x][y] = this.maxHeight;
                    }
                } else if (this.drawMode === 'obstacles') {
                    this.grid.addObstacle(new Obstacle(x, y, this.obstacleSize));
                } else if (this.drawMode === 'waveSource') {
                    const amplitude = parseFloat(document.getElementById('amplitudeRange').value);
                    const frequency = parseFloat(document.getElementById('frequencyRange').value);
                    this.waveSources.push(new WaveSource(x, y, amplitude, frequency));
                    this.switchToDrawMode('waves');
                    this.restoreButtons();
                } else if (this.drawMode === 'selectSource') {
                    this.selectedSource = this.waveSources.find(source => Math.hypot(source.x - x, source.y - y) < 5);
                }
            }
        });

        // Update simulation parameters based on user input
        document.getElementById('dampingRange').addEventListener('input', (event) => {
            this.damping = parseFloat(event.target.value);
            this.grid.damping = this.damping;
        });

        document.getElementById('resolutionRange').addEventListener('input', (event) => {
            this.cols = parseInt(event.target.value);
            this.rows = parseInt(event.target.value);
            this.grid = new Grid(this.cols, this.rows, this.damping);
        });

        document.getElementById('speedRange').addEventListener('input', (event) => {
            this.speed = parseInt(event.target.value);
        });

        document.getElementById('heightRange').addEventListener('input', (event) => {
            this.maxHeight = parseFloat(event.target.value);
        });

        document.getElementById('amplitudeRange').addEventListener('input', (event) => {
            if (this.selectedSource) {
                this.selectedSource.amplitude = parseFloat(event.target.value);
            }
        });

        document.getElementById('frequencyRange').addEventListener('input', (event) => {
            if (this.selectedSource) {
                this.selectedSource.frequency = parseFloat(event.target.value);
            }
        });

        document.getElementById('obstacleSizeRange').addEventListener('input', (event) => {
            this.obstacleSize = parseInt(event.target.value);
        });

        document.getElementById('drawObstacles').addEventListener('click', () => {
            this.switchToDrawMode('obstacles');
            this.replaceButton('drawObstacles');
        });

        document.getElementById('addWaveSource').addEventListener('click', () => {
            this.switchToDrawMode('waveSource');
            this.replaceButton('addWaveSource');
        });
    }

    // Method to change the drawing mode and manage UI button states
    switchToDrawMode(mode) {
        this.drawMode = mode;

        const buttons = document.querySelectorAll('.control button');
        buttons.forEach(button => {
            if (button.id !== 'generateWaves') {
                button.disabled = true;
            }
        });

        if (mode === 'waves') {
            buttons.forEach(button => {
                button.disabled = false; // Enable all buttons
            });
        }
    }

    // Method to hide the current button and show the 'Generate Waves' button
    replaceButton(buttonId) {
        this.originalButtonId = buttonId;
        const originalButton = document.getElementById(buttonId);
        originalButton.classList.add('hidden');

        if (document.getElementById('generateWaves')) {
            return;
        }

        const generateWavesButton = document.createElement('button');
        generateWavesButton.id = 'generateWaves';
        generateWavesButton.className = 'visible';
        generateWavesButton.textContent = 'Generate Waves';
        generateWavesButton.addEventListener('click', () => {
            this.switchToDrawMode('waves');
            this.restoreButtons();
        });

        originalButton.parentNode.insertBefore(generateWavesButton, originalButton.nextSibling);
    }

    // Method to restore the original button state and remove the 'Generate Waves' button
    restoreButtons() {
        const generateWavesButton = document.getElementById('generateWaves');
        if (generateWavesButton) {
            generateWavesButton.parentNode.removeChild(generateWavesButton);
        }

        if (this.originalButtonId) {
            const originalButton = document.getElementById(this.originalButtonId);
            originalButton.classList.remove('hidden');
        }

        this.drawMode = 'waves';

        const buttons = document.querySelectorAll('.control button');
        buttons.forEach(button => {
            button.disabled = false;
        });
    }

    // Method to get the coordinates of the canvas relative to the event position
    getCanvasCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / rect.width * this.cols);
        const y = Math.floor((event.clientY - rect.top) / rect.height * this.rows);
        return { x, y };
    }

    // Method to get the color corresponding to a value
    getColor(value) {
        if (value === 0) return 'rgb(0, 0, 255)'; // Base color for zero value
        value = this.clamp(value);
        if (value > 0) {
            const w = Math.round(255 * value);
            return `rgb(${w}, ${w}, 255)`; // Color for positive values
        }
        const b = Math.round(255 + 150 * value);
        return `rgb(0, 0, ${b})`; // Color for negative values
    }

    // Method to clamp a value between -1 and 1
    clamp(value) {
        return Math.max(-1, Math.min(1, value));
    }

    // Method to draw the current state of the simulation on the canvas
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 1; i < this.grid.cols - 1; i++) {
            for (let j = 1; j < this.grid.rows - 1; j++) {
                const x = (i / this.grid.cols) * this.canvas.width;
                const y = (j / this.grid.rows) * this.canvas.height;
                const value = this.grid.grid[i][j];
                this.ctx.fillStyle = this.getColor(value);
                this.ctx.fillRect(x, y, this.canvas.width / this.grid.cols, this.canvas.height / this.grid.rows);
            }
        }

        // Draw obstacles in black
        this.ctx.fillStyle = 'black';
        this.grid.obstacles.forEach(obstacle => {
            const x = (obstacle.x / this.cols) * this.canvas.width;
            const y = (obstacle.y / this.rows) * this.canvas.height;
            
            this.ctx.fillRect(x, y, (obstacle.size / this.cols) * this.canvas.width, (obstacle.size / this.rows) * this.canvas.height);
        });

        // Draw wave sources in red
        this.ctx.fillStyle = 'red';
        this.waveSources.forEach(source => {
            const x = (source.x / this.cols) * this.canvas.width;
            const y = (source.y / this.rows) * this.canvas.height;
            const radius = Math.min(this.canvas.width / this.grid.cols, this.canvas.height / this.grid.rows) / 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }

    // Method to update the simulation state and redraw
    animate() {
        for (let s = 0; s < this.speed; s++) {
            this.grid.updateGrid();

            const time = performance.now();
            this.waveSources.forEach(source => {
                if (source.x > 0 && source.x < this.cols - 1 && source.y > 0 && source.y < this.rows - 1) {
                    this.grid.grid[source.x][source.y] = source.generateWave(time);
                }
            });
            this.grid.swap();
        }
        this.draw();
        // Request the next frame in the animation loop
        requestAnimationFrame(() => this.animate());
    }
}
