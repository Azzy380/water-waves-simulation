export class Grid {
    constructor(cols, rows, damping) {
        this.cols = cols; // Number of columns in the grid
        this.rows = rows; // Number of rows in the grid
        this.damping = damping; // Damping factor to control wave propagation
        this.grid = this.createGrid(); // Current state of the grid
        this.previousGrid = this.createGrid(); // Previous state of the grid for calculation
        this.obstacles = []; // List of obstacles in the grid
    }

    // Creates a 2D grid initialized with zeroes
    createGrid() {
        let grid = [];
        for (let i = 0; i < this.cols; i++) {
            grid[i] = [];
            for (let j = 0; j < this.rows; j++) {
                grid[i][j] = 0;
            }
        }
        return grid;
    }

    // Updates the grid state based on wave propagation
    updateGrid() {
        for (let i = 1; i < this.cols - 1; i++) {
            for (let j = 1; j < this.rows - 1; j++) {
                if (!this.isObstacle(i, j)) {
                    this.grid[i][j] = (this.previousGrid[i - 1][j] + this.previousGrid[i + 1][j] + this.previousGrid[i][j - 1] + this.previousGrid[i][j + 1]) / 2 - this.grid[i][j];
                    this.grid[i][j] *= this.damping;
                }
            }
        }
    }

    // Swaps the current grid with the previous grid
    swap() {
        let temp = this.previousGrid;
        this.previousGrid = this.grid;
        this.grid = temp;
    }

    // Adds an obstacle to the grid and resets the grid values within the obstacle bounds to zero
    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
        for (let i = obstacle.x; i < obstacle.x + obstacle.size; i++) {
            for (let j = obstacle.y; j < obstacle.y + obstacle.size; j++) {
                if (i >= 0 && i < this.cols && j >= 0 && j < this.rows) {
                    this.grid[i][j] = 0;
                    this.previousGrid[i][j] = 0; // Also reset the previous grid
                }
            }
        }
    }

    // Checks if a given position is an obstacle
    isObstacle(x, y) {
        return this.obstacles.some(obstacle => obstacle.isObstacle(x, y));
    }
}
