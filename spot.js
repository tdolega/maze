function Spot(x, y) {
    // position on grid
    this.x = x;
    this.y = y;

    // stats
    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.neighbors = [];
    this.previous = undefined

    // randomly make wall
    this.wall = (random(1) < wallChance);

    // display itself
    this.show = function (color) {
        fill(this.wall ? 0 : color);
        var squareSize = canvasSize / gridSize;
        rect(this.x * squareSize, this.y * squareSize, squareSize - 1, squareSize - 1)
    }

    // figure out my neighbors
    this.addNeighbors = function (grid) {
        if (this.x < gridSize - 1) {
            this.neighbors.push(grid[this.x + 1][this.y]);
        }
        if (this.x > 0) {
            this.neighbors.push(grid[this.x - 1][this.y]);
        }
        if (this.y < gridSize - 1) {
            this.neighbors.push(grid[this.x][this.y + 1]);
        }
        if (this.y > 0) {
            this.neighbors.push(grid[this.x][this.y - 1]);
        }
    }
}