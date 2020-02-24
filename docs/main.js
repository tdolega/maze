/*
Visually generate ideal (mathematical) maze using randomized Kruskal's algorithm and solve it using A* algorithm
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
var openSet = [];
var closedSet = [];
var start, end;
// maze
var egrid; // grid of initial empty cells (2d)
var egridSize = f2(gridSize);
var sgrid; // grid of sets for initial empty cels (1d representing 2d)
var wallsDown = 0;
var wallsWanted = egridSize ** 2 - 1;

function f2(n) {
    return ~~(n / 2); // floor
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

    start = grid[1][1];
    openSet.push(start);
    end = grid[gridSize - 2][gridSize - 2];
}

function heuristic(a, b) {
    return abs(a.x - b.x) + abs(a.y - b.y); // taxicab
}

function draw() {
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            grid[x][y].show(color(255, 255, 255));
        }
    }
    // maze generator
    if (wallsDown < wallsWanted) {
        do {
            var x = ~~(random(f2(gridSize)));
            var y = ~~(random(f2(gridSize)));
            current = egrid[x][y];
            var randomDirection = ['top', 'right', 'down', 'left'][~~(Math.random() * 4)];
            neighbor = current.eneighbors[randomDirection];
            wall = current.neighbors[randomDirection];
            current_s = sgrid[current.s];
        } while (!(neighbor && wall.wall && current_s != (neighbor_s = sgrid[neighbor.s]))); // xd
        sgrid = sgrid.map(v => v === neighbor_s ? current_s : v);
        wall.wall = false;
        wallsDown++;

    }
    // pathfind
    else if (openSet.length > 0) {
        // best candidate
        var winner = openSet[0];
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < winner.f) {
                winner = openSet[i];
            }
        }
        // end
        if (winner == end) {
            noLoop();
        }
        // move winner to closedSet
        closedSet.push(openSet.splice(openSet.indexOf(winner), 1)[0]);
        //check all neighbors
        // for (var neighbor in winner.neighbors) {
        Object.values(winner.neighbors).forEach(neighbor => {
            if (!neighbor.wall && !closedSet.includes(neighbor)) {
                var newG = winner.g + heuristic(neighbor, winner); // always + 1
                // Is this a better path than before?
                var newPath = false;
                if (openSet.includes(neighbor)) {
                    if (newG < neighbor.g) {
                        neighbor.g = newG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = newG;
                    newPath = true;
                    openSet.push(neighbor);
                }
                // Yes, it's a better path
                if (newPath) {
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = winner;
                }
            }
            // determine path
            path = [];
            var pathElem = winner;
            while (pathElem.previous) {
                path.push(pathElem.previous);
                pathElem = pathElem.previous;
            }
        });

        // draw
        for (var i = 0; i < openSet.length; i++) {
            openSet[i].show(color(26, 55, 240));
        }
        for (var i = 0; i < closedSet.length; i++) {
            closedSet[i].show(color(179, 179, 255));
        }
        for (var i = 0; i < path.length; i++) {
            path[i].show(color(243, 255, 18));
        }
        start.show(color(255, 0, 0));
        end.show(color(255, 0, 0));
    } else {
        console.log("Error ocured...");
        noLoop();
    }
    var completed = floor((wallsDown / wallsWanted) * 100);
    document.getElementById("percent").innerHTML = completed;
}