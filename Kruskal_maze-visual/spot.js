function Spot(x, y) {
    // position on grid
    this.x = x;
    this.y = y;
    this.s = undefined;

    this.wall = true;

    // stats
    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.neighbors = {};
    this.eneighbors = {};
    this.previous = undefined;

    // display itself
    this.show = function (color) {
        noStroke();
        fill(this.wall ? 0 : color);
        var squareSize = canvasSize / gridSize;
        rect(this.x * squareSize, this.y * squareSize, squareSize, squareSize);
    };

    // figure out my neighbors
    this.addNeighbors = function (grid) {
        if (this.x < gridSize - 1) {
            this.neighbors.right = grid[this.x + 1][this.y];
        }
        if (this.x > 0) {
            this.neighbors.left = grid[this.x - 1][this.y];
        }
        if (this.y < gridSize - 0) {
            this.neighbors.bottom = grid[this.x][this.y + 1];
        }
        if (this.y > 0) {
            this.neighbors.top = grid[this.x][this.y - 1];
        }
    };

    // e
    this.addeNeighbors = function (grid) {
        if (this.x < gridSize - 2) {
            this.eneighbors.right = grid[this.x + 2][this.y];
        }
        if (this.x > 1) {
            this.eneighbors.left = grid[this.x - 2][this.y];
        }
        if (this.y < gridSize - 2) {
            this.eneighbors.bottom = grid[this.x][this.y + 2];
        }
        if (this.y > 1) {
            this.eneighbors.top = grid[this.x][this.y - 2];
        }
    };
}