var gridSize = 31;
var canvasSize = 800;
endPosX = gridSize - 1;
endPosY = gridSize - 1;

var grid, egrid, sgrid;


function setup() {
    createCanvas(canvasSize, canvasSize);
    grid = Array.from(Array(gridSize), () => new Array(gridSize));
    egrid = Array.from(Array(floor(gridSize / 2)), () => new Array(floor(gridSize / 2)));
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            var newSpot = new Spot(x, y);
            grid[x][y] = newSpot;
            if (x % 2 == 1 && y % 2 == 1) {
                egrid[floor((x - 1) / 2)][floor((y - 1) / 2)] = newSpot;
                newSpot.wall = false;
                newSpot.s = floor(y / 2) + floor(x / 2) * floor(gridSize / 2);
            }
        }
    }
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            grid[x][y].addNeighbors(grid);
        }
    }
    for (var x = 0; x < floor(gridSize / 2); x++) {
        for (var y = 0; y < floor(gridSize / 2); y++) {
            egrid[x][y].addeNeighbors(grid);
        }
    }
    sgrid = new Array((floor(gridSize / 2)) * (floor(gridSize / 2)))
    for (var i = 0; i < (floor(gridSize / 2)) * (floor(gridSize / 2)); i++) {
        sgrid[i] = i;
    }
    generate();
}

function generate() {
    var walls_down = 0;
    while (walls_down < floor(gridSize / 2) * floor(gridSize / 2) - 1) {
        var x = floor(random(floor((gridSize) / 2)));
        var y = floor(random(floor((gridSize) / 2)));
        current = egrid[x][y];
        switch (floor(random(3))) {
            case 0:
                neighbor = current.eneighbors['top'];
                wall = current.neighbors.top;
                break;
            case 1:
                neighbor = current.eneighbors['right'];
                wall = current.neighbors.right;
                break;
            case 2:
                neighbor = current.eneighbors['bottom'];
                wall = current.neighbors.bottom;
                break;
            case 3:
                neighbor = current.eneighbors['left'];
                wall = current.neighbors.left;
                break;
        }
        if (neighbor && wall.wall) {
            if (sgrid[current.s] != sgrid[neighbor.s]) {
                sgrid = sgrid.map(v => v === sgrid[neighbor.s] ? sgrid[current.s] : v);
                wall.wall = false;
                walls_down++;
            }
        }
    }
}



function draw() {
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            grid[x][y].show(color(255, 255, 255));
        }
    }
    noLoop();
}