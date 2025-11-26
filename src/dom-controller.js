// Creates event listeners
function createEventListeners(p1, p2) {
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("cell")) {
            const parent = e.target.parentNode;
            const children = parent.children;
            const i = Array.prototype.indexOf.call(children, e.target);
            const coords = gridIndexToCoords(i);

            // Send attack to grid square
            if (parent.parentNode.classList[0] === "right") {
                p2.board.receiveAttack(coords);
            } else if (parent.parentNode.classList[0] === "left") {
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

// Displays ships on the grid
// side must be "left" or "right"
function displayShips(player, side, coords) {
    const grid = document.querySelector("div." + side + ">div.grid");
    const index = coordsToGridIndex(coords);

    if (player.board.board[coords[0]][coords[1]] !== null && side === "left") {
        grid.children[index].classList.add("friend");
    } else if (
        player.board.board[coords[0]][coords[1]] !== null &&
        side === "right"
    ) {
        grid.children[index].classList.add("foe");
    }
}

function displayAttackedSquare(player, side, coords) {
    const grid = document.querySelector("div." + side + ">div.grid");
    const index = coordsToGridIndex(coords);

    grid.children[index].classList.add("attacked");
}

export { createEventListeners, displayShips, displayAttackedSquare };
