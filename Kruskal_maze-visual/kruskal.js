/*
Generate Kruskals ideal maze in visual way
Author: Tymoteusz Dolega
2020
*/


/*
    configuration
*/
var gridSize = 31; // cells, odd number looks best
var canvasSize = 800; // px


/*
    code
*/

// a*
var grid; // grid of all cells (2d)
// maze
var egrid; // grid of initial empty cells (2d)
var egridSize = f2(gridSize);
var sgrid; // grid of sets for initial empty cels (1d representing 2d)
var wallsDown = 0;
var wallsWanted = egridSize ** 2 - 1;

function f2(n) {
    return ~~(n / 2); // floor
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

function setup() {
    createCanvas(canvasSize, canvasSize);
    grid = Array.from(Array(gridSize), () => new Array(gridSize));
    egrid = Array.from(Array(egridSize), () => new Array(egridSize));
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            var newSpot = new Spot(x, y);
            grid[x][y] = newSpot;
            // is initial empty cell
            if (x % 2 == 1 && y % 2 == 1) {
                egrid[f2(x - 1)][f2(y - 1)] = newSpot;
                newSpot.wall = false;
                newSpot.s = f2(y) + f2(x) * egridSize;
            }
        }
    }
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            grid[x][y].addNeighbors(grid);
        }
    }
    for (var x = 0; x < egridSize; x++) {
        for (var y = 0; y < egridSize; y++) {
            egrid[x][y].addeNeighbors(grid);
        }
    }
    sgrid = [...Array(egridSize ** 2).keys()]; // array with indexes as values
    shuffleArray(sgrid);
}

function draw() {
    // maze generator
    if (wallsDown < wallsWanted) {
        var x = ~~(random(f2(gridSize)));
        var y = ~~(random(f2(gridSize)));
        current = egrid[x][y];
        var randomDirection = ['top', 'right', 'down', 'left'][~~(Math.random() * 4)];
        neighbor = current.eneighbors[randomDirection];
        wall = current.neighbors[randomDirection];
        current_s = sgrid[current.s];
        if (neighbor && wall.wall && current_s != (neighbor_s = sgrid[neighbor.s])) { // xd
            sgrid = sgrid.map(v => v === neighbor_s ? current_s : v);
            wall.wall = false;
            wallsDown++;
        }
    }
    else {
        noLoop();
    }
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            grid[x][y].show(color(255, 255, 255));
        }
    }
    document.getElementById("percent").innerHTML = floor((wallsDown / wallsWanted) * 100);
    // noLoop();
}