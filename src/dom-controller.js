// Creates event listeners
function createEventListeners(p1, p2) {
    document.addEventListener("click", (e) => {
        // Handles events when the grid cells are clicked
        if (e.target.classList.contains("cell")) {
            const parent = e.target.parentNode;
            const children = parent.children;
            const i = Array.prototype.indexOf.call(children, e.target);
            const coords = gridIndexToCoords(i);

            // Send attack to grid square
            if (
                e.target.classList.contains("active") &&
                parent.parentNode.classList[0] === "right"
            ) {
                p2.board.receiveAttack(coords);
            } else if (
                e.target.classList.contains("active") &&
                parent.parentNode.classList[0] === "left"
            ) {
                p1.board.receiveAttack(coords);
            }
        }
    });
}

function gridIndexToCoords(gridIndex) {
    return [Math.floor(gridIndex / 10), gridIndex % 10];
}

function coordsToGridIndex(coords) {
    return coords[0] * 10 + coords[1];
}

// Displays ships on the grid one by one
function displayPlacedShips(turn, coords) {
    const side = turn ? "right" : "left";
    const grid = document.querySelector("div." + side + ">div.grid");
    const index = coordsToGridIndex(coords);

    if (!turn) {
        grid.children[index].classList.add("friend");
    } else {
        grid.children[index].classList.add("foe");
    }
}

// Displays ships on the grid
function displayShips(currPlayer, otherPlayer, turn) {
    let side = !turn ? "left" : "right";
    const friendGrid = document.querySelector("div." + side + ">div.grid");
    side = turn ? "left" : "right";
    const enemyGrid = document.querySelector("div." + side + ">div.grid");

    // Loop through all cells of the grids
    for (let i = 0; i < currPlayer.board.board.length; i++) {
        for (let j = 0; j < currPlayer.board.board.length; j++) {
            const index = coordsToGridIndex([i, j]);

            // Set friendly cell class to update their style
            const value = currPlayer.board.board[i][j];
            if (value === null) {
                friendGrid.children[index].className = "cell";
            } else if (value === 0) {
                friendGrid.children[index].className = "cell attacked";
            } else if (value === 1) {
                friendGrid.children[index].className = "cell friend attacked";
            } else {
                friendGrid.children[index].className = "cell friend";
            }

            // Set enemy cell class to update their style
            const valueFoe = otherPlayer.board.board[i][j];
            if (valueFoe === null) {
                enemyGrid.children[index].className = "cell active";
            } else if (valueFoe === 0) {
                enemyGrid.children[index].className = "cell attacked";
            } else if (valueFoe === 1) {
                enemyGrid.children[index].className = "cell foe attacked";
            } else {
                enemyGrid.children[index].className = "cell active";
            }
        }
    }
}

// Reveals the attacked square
function displayAttackedSquare(turn, coords, hit) {
    const side = !turn ? "right" : "left";
    const grid = document.querySelector("div." + side + ">div.grid");
    const index = coordsToGridIndex(coords);

    if (hit) {
        grid.children[index].classList.add("foe");
    } else {
        grid.children[index].classList.add("attacked");
    }
    grid.children[index].classList.remove("active");
}

export {
    createEventListeners,
    displayPlacedShips,
    displayShips,
    displayAttackedSquare,
};
