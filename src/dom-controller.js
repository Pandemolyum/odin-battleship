// Creates event listeners
function createClickEventListeners(p1, p2, gameState) {
    document.addEventListener("click", (e) => {
        // Handles events when the grid cells are clicked
        if (e.target.classList.contains("friend")) {
            const parent = e.target.parentNode;
            const i = getChildIndex(e.target);
            const coords = gridIndexToCoords(i);

            // Determine board where ship is located and rotate ship
            if (parent.parentNode.classList.contains("left")) {
                p1.board.rotateShip(coords);
            } else {
                p2.board.rotateShip(coords);
            }
        } else if (e.target.classList.contains("cell")) {
            const parent = e.target.parentNode;
            const i = getChildIndex(e.target);
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
        } else if (
            e.target.classList.contains("confirm-placement") &&
            e.target.parentNode.classList.contains("left")
        ) {
            gameState.setState("position2");
        } else if (
            e.target.classList.contains("confirm-placement") &&
            e.target.parentNode.classList.contains("right")
        ) {
            gameState.setState("combat");
        }
    });
}

function createShipNodeRemoveObserver(observedNode) {
    const observer = new MutationObserver(() => {
        if (observedNode.children.length === 0) {
            const button = observedNode.parentNode.querySelector("button");
            button.disabled = false;
        }
    });

    observer.observe(observedNode, { childList: true });
}

// Returns the child index position of the specified element relative
// to its parent
function getChildIndex(child) {
    const parent = child.parentNode;
    const children = parent.children;
    return Array.prototype.indexOf.call(children, child);
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

    grid.children[index].classList.add("friend");
    grid.children[index].classList.add("active");
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

// Displays a game over message
function displayGameOver(message) {
    const gameOver = document.createElement("h2");
    gameOver.textContent = message;

    const body = document.querySelector("body");
    body.appendChild(gameOver);
}

// Checks if the position of the ship is valid and if valid, displays it
// Returns the coordinates of the new ship if it is displayed
function displayShipOnGrid(target, dragged, size) {
    // Check if position is within grid boundaries
    const coords = gridIndexToCoords(getChildIndex(target));
    if (coords[1] + size - 1 > 9) {
        return;
    }

    // Check if position does not overlap another ship
    let testTarget = target;
    for (let i = 0; i < size; i++) {
        if (testTarget.classList.contains("friend")) {
            return;
        }
        testTarget = testTarget.nextElementSibling;
    }

    // Record ship coordinates
    let coordsArr = [];
    for (let i = 0; i < size; i++) {
        coordsArr.push(gridIndexToCoords(getChildIndex(target)));
        target = target.nextElementSibling;
    }

    dragged.remove();

    return coordsArr;
}

// Removes a ship from the grid display
// side must be "left" or "right", indicating which board to change
function undisplayShip(turn, coordsArr) {
    const side = turn ? "right" : "left";
    const grid = document.querySelector("div." + side + ">div.grid");
    for (let coords of coordsArr) {
        const index = coordsToGridIndex(coords);
        const cell = grid.children[index];
        cell.classList.remove("friend"); // Changes grid color via CSS
        cell.classList.remove("active"); // Updates cursor style via CSS
    }
}

function removeShipPlacementButtons() {
    const buttons = document.querySelectorAll("button.confirm-placement");

    for (let button of buttons) {
        button.remove();
    }
}

export {
    createClickEventListeners,
    displayPlacedShips,
    displayShips,
    displayAttackedSquare,
    displayGameOver,
    displayShipOnGrid,
    createShipNodeRemoveObserver,
    removeShipPlacementButtons,
    undisplayShip,
};
