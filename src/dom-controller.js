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

export { createEventListeners, gridIndexToCoords };
