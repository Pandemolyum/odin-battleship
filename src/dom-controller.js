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
function displayShips(player, side) {
    const grid = document.querySelector("div." + side + ">div.grid");

    for (let i = 0; i < player.board.board.length; i++) {
        for (let j = 0; j < player.board.board.length; j++) {
            const index = coordsToGridIndex([i, j]);

            if (player.board.board[i][j] !== null && side === "left") {
                grid.children[index].classList.add("friend");
            } else if (player.board.board[i][j] !== null && side === "right") {
                grid.children[index].classList.add("foe");
            }
        }
    }
}

export { createEventListeners, displayShips };
