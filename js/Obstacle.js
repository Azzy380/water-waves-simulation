export class Obstacle {
    constructor(x, y, size) {
        this.x = x; // X-coordinate of the obstacle
        this.y = y; // Y-coordinate of the obstacle
        this.size = size; // Size of the obstacle
    }

    // Determines if a given grid cell is within the bounds of the obstacle
    isObstacle(i, j) {
        return i >= this.x && i < this.x + this.size && j >= this.y && j < this.y + this.size;
    }
}
