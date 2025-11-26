// Creates event listeners
function createEventListeners() {
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("cell")) {
            const parent = e.target.parentNode;
            const children = parent.children;
            const i = Array.prototype.indexOf.call(children, e.target);
            console.log(parent.parentNode.classList[0]);
            console.log(gridIndexToCoords(i));
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

// Updates grid square color

export { createEventListeners, displayShips };
