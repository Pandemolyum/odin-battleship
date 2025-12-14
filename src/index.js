import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { Subject, Observer } from "./observer.js";
import {
    createClickEventListeners,
    displayPlacedShips,
    displayShips,
    displayAttackedSquare,
    displayGameOver,
    displayShipOnGrid,
    createShipNodeRemoveObserver,
    removeShipPlacementButtons,
    undisplayShip,
    getChildIndex,
    gridIndexToCoords,
    togglePlayerSelect,
    toggleTurnDisplay,
} from "./dom-controller.js";

// Game state initialization
const gameState = new Subject(); // possible states: position1 (for p1 ship placement), position2 (for p2 ship placement), combat, ended
const stateObserver = new Observer("stateObserver", onStateChange);
gameState.subscribe(stateObserver);

const playerTurn = new Subject(false); // state false for player 1 turn and true for player 2 turn
const turnObserver = new Observer("turnObserver", onTurnChange);
playerTurn.subscribe(turnObserver);

// Player 1 initialization
const p1 = new Player("human");
const p1observer = new Observer("p1observer", onBoardChange);
p1.board.subject.subscribe(p1observer);

// Player 2 initialization
const p2 = new Player("computer");
const p2observer = new Observer("p1observer", onBoardChange);
p2.board.subject.subscribe(p2observer);

// Event listener and observers initialization
createClickEventListeners(p1, p2, gameState);
createDropEventListeners();

const shipsLeft = document.querySelector("div.left div.ships");
createShipNodeRemoveObserver(shipsLeft);

const shipsRight = document.querySelector("div.right div.ships");
createShipNodeRemoveObserver(shipsRight);

// Game start
togglePlayerSelect();

// ========== FUNCTIONS ==========
// Updates the board display dynamically based on the specified board state
function onBoardChange(state) {
    // Displays the board ships and squares based on the board state
    if (state[0] === "shipPlaced") {
        displayPlacedShips(playerTurn.state, state[1], state[2]);
    } else if (state[0] === "shipRemoved") {
        undisplayShip(playerTurn.state, state[1]);
    } else if (state[0] === "attackReceived") {
        displayAttackedSquare(playerTurn.state, state[1], state[2]);

        // End the game
        if (getOtherPlayer().board.areAllShipsSunk()) {
            let message;
            if (getCurrentPlayer() === p1) {
                message = "Player 1 Wins!";
            } else {
                message = "Player 2 Wins!";
            }

            displayGameOver(message);
            gameState.setState("ended");

            return;
        }

        // If the attack does not hit a ship, change player turn
        if (!state[2]) {
            playerTurn.setState(!playerTurn.state);
        }
    }
}

// Updates board display based on playerTurn state
function onTurnChange(state) {
    if (!state) {
        displayShips(p1, p2, state);
        if (p1.type === "human" && p2.type === "human")
            toggleTurnDisplay("Player 1");
    } else {
        displayShips(p2, p1, state);
        if (p1.type === "human" && p2.type === "human")
            toggleTurnDisplay("Player 2");
    }

    executeComputerAction();
}

// Triggers when the game state changes and updates the display accordingly
function onStateChange(state) {
    const leftSide = document.querySelector("div.left");
    const rightSide = document.querySelector("div.right");
    if (state === "position1") {
        // Set player to human or computer as selected by the user
        const playerSelect = document.querySelectorAll("select");
        p1.type = playerSelect[0].value;
        p2.type = playerSelect[1].value;

        rightSide.style.display = "none";
        playerTurn.setState(false);
    } else if (state === "position2") {
        leftSide.style.display = "none";
        rightSide.style.display = "flex";
        playerTurn.setState(true);
    } else if (state === "combat") {
        removeShipPlacementButtons();
        leftSide.style.display = "flex";
        playerTurn.setState(false); // Set current turn to player 1
    }
}

// Returns the player object whose turn it is to play
function getCurrentPlayer() {
    if (playerTurn.state) {
        return p2;
    } else if (!playerTurn.state) {
        return p1;
    }
}

// Returns the player object who is being attacked this turn
function getOtherPlayer() {
    if (playerTurn.state) {
        return p1;
    } else if (!playerTurn.state) {
        return p2;
    }
}

function createDropEventListeners() {
    // Defines the element that is currently being dragged
    let dragged = null;
    const draggables = document.querySelectorAll('[draggable="true"]');
    for (let draggable of draggables) {
        draggable.addEventListener("dragstart", (e) => {
            if (e.target.getAttribute("draggable")) {
                dragged = e.target;
            }
        });
    }

    const leftCells = document.querySelectorAll(".left .grid .cell");
    for (let cell of leftCells) {
        // Defines that item that is being dragged
        cell.addEventListener("dragstart", (e) => {
            if (e.target.getAttribute("draggable")) {
                dragged = e.target;
            }
        });

        cell.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        // Defines what happens when an item is dragged and dropped
        // This places or moves a ship on the grid
        cell.addEventListener("drop", (e) => {
            onDroppedElement(dragged, cell, e);
        });
    }

    const rightCells = document.querySelectorAll(".right .grid .cell");
    for (let cell of rightCells) {
        // Defines that item that is being dragged
        cell.addEventListener("dragstart", (e) => {
            if (e.target.getAttribute("draggable")) {
                dragged = e.target;
            }
        });

        cell.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        // Defines what happens when an item is dragged and dropped
        // This places or moves a ship on the grid
        cell.addEventListener("drop", (e) => {
            onDroppedElement(dragged, cell, e);
        });
    }
}

function onDroppedElement(dragged, cell, e) {
    const clsList = dragged.classList;
    let size;
    if (clsList.contains("two")) {
        size = 2;
    } else if (clsList.contains("three")) {
        size = 3;
    } else if (clsList.contains("four")) {
        size = 4;
    } else {
        size = 5;
    }

    // Check that the ship is being placed on the correct board
    const targetParentClass = cell.parentNode.parentNode.classList;
    const draggedParentClass = dragged.parentNode.parentNode.classList;
    if (
        (targetParentClass.contains("left") &&
            !draggedParentClass.contains("left")) ||
        (targetParentClass.contains("right") &&
            !draggedParentClass.contains("right"))
    ) {
        return;
    }

    // Display ship
    let target = e.target;
    let coordsArr;
    if (targetParentClass.contains("left")) {
        coordsArr = displayShipOnGrid(target, dragged, size, p1.board);
    } else {
        coordsArr = displayShipOnGrid(target, dragged, size, p2.board);
    }

    if (!coordsArr) return; // Check if array exists

    // Update board object with the new position of the ship
    if (clsList.contains("cell")) {
        // If the object is moved from the grid...
        if (targetParentClass.contains("left")) {
            const index = getChildIndex(dragged);
            p1.board.moveShip(gridIndexToCoords(index), coordsArr[0]);
        } else {
            const index = getChildIndex(dragged);
            p2.board.moveShip(gridIndexToCoords(index), coordsArr[0]);
        }
    } else {
        // If the object is new on the grid...
        const ship = new Ship(size);
        let hdirection = false;
        if (coordsArr[0][0] === coordsArr[1][0]) {
            hdirection = true;
        }

        if (targetParentClass.contains("left")) {
            p1.board.placeShip(coordsArr[0], hdirection, ship);
        } else {
            p2.board.placeShip(coordsArr[0], hdirection, ship);
        }
    }
}

// Execute computer player action if it is its turn
function executeComputerAction() {
    if (
        gameState.state === "combat" &&
        getCurrentPlayer().type === "computer"
    ) {
        let isHit = getCurrentPlayer().sendAttack(getOtherPlayer().board);

        if (isHit && getCurrentPlayer().type === "computer")
            executeComputerAction();
    } else if (
        gameState.state.startsWith("position") &&
        getCurrentPlayer().type === "computer"
    ) {
        let result;

        for (let i = 0; i < 5; i++) {
            result = false;
            while (!result) {
                result = getCurrentPlayer().placeShip();
            }
        }

        if (getCurrentPlayer() === p1) {
            const ships = document.querySelector(".left .ships");
            ships.replaceChildren();

            gameState.setState("position2");
        } else {
            const ships = document.querySelector(".right .ships");
            ships.replaceChildren();

            gameState.setState("combat");
        }
    }
}
