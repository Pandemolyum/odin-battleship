function createEventListeners() {
    document.addEventListener("click", (e) => {
        if (e.target) {
            console.log(e.target);
        }
    });
}

export { createEventListeners };
