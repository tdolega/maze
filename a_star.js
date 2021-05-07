var gridSize = 30;
var canvasSize = 800;
endPosX = gridSize - 1;
endPosY = gridSize - 1;
wallChance = 0.30; // 0 - 1

var grid = Array.from(Array(gridSize), () => new Array(gridSize)); // 2d array
var openSet = [];
var closedSet = [];
var start, end;

function heuristic(a, b) {
    return abs(a.x - b.x) + abs(a.y - b.y); // taxicab
    return dist(a.x, a.y, b.x, b.y); // euclidean
}

function setup() {
    createCanvas(canvasSize, canvasSize);
    console.log('A*');
    // make grid
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            grid[x][y] = new Spot(x, y);
        }
    }

    start = grid[0][0];
    openSet.push(start);
    end = grid[endPosX][endPosY];
    start.wall = false;
    end.wall = false;

    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            grid[x][y].addNeighbors(grid);
        }
    }
}


function draw() {
    // still searching?
    if (openSet.length > 0) {
        // best candidate
        var winner = openSet[0];
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < winner.f) {
                winner = openSet[i];
            }
        }
        // end
        if (winner == end) {
            console.log("DONE!");
            noLoop();
        }
        // move winner to closedSet
        closedSet.push(openSet.splice(openSet.indexOf(winner), 1)[0]);
        //check all neighbors
        for (var neighbor of winner.neighbors) {
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
        }
        // determine path
        path = [];
        var pathElem = winner;
        while (pathElem.previous) {
            path.push(pathElem.previous);
            pathElem = pathElem.previous;
        }
    } else {
        console.log("No solutions :(");
        noLoop();
    }

    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            grid[x][y].show(color(255, 255, 255));
        }
    }
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
}