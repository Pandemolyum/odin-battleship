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
} from "./dom-controller.js";

// Game state initialization
let gameState = "combat"; // possible states: position, combat, ended
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

// Player 1 ship initialization
const P1hugeShip = new Ship(5);
const P1bigShip = new Ship(4);
const P1mediumShip = new Ship(3);
const P1mediumShip2 = new Ship(3);
const P1smallShip = new Ship(2);
p1.board.placeShip([0, 0], true, P1hugeShip);
p1.board.placeShip([1, 6], true, P1bigShip);
p1.board.placeShip([3, 4], false, P1mediumShip);
p1.board.placeShip([3, 0], true, P1mediumShip2);
p1.board.placeShip([7, 6], false, P1smallShip);

// Player 2 ship initialization
playerTurn.state = true;
const P2hugeShip = new Ship(5);
const P2bigShip = new Ship(4);
const P2mediumShip = new Ship(3);
const P2mediumShip2 = new Ship(3);
const P2smallShip = new Ship(2);
p2.board.placeShip([0, 0], false, P2hugeShip);
p2.board.placeShip([5, 4], true, P2bigShip);
p2.board.placeShip([8, 2], true, P2mediumShip);
p2.board.placeShip([7, 6], false, P2mediumShip2);
p2.board.placeShip([1, 7], true, P2smallShip);

// Event listener initialization
createClickEventListeners(p1, p2);
createDropEventListeners();

// Combat phase start
playerTurn.setState(false);

// ========== FUNCTIONS ==========
// Updates the board display dynamically based on the specified board state
function onBoardChange(state) {
    // Displays the board ships and squares based on the board state
    if (state[0] === "shipPlaced") {
        displayPlacedShips(playerTurn.state, state[1]);
    } else if (state[0] === "attackReceived") {
        displayAttackedSquare(playerTurn.state, state[1], state[2]);

        // If the attack does not hit a ship
        if (!state[2]) {
            playerTurn.setState(!playerTurn.state);
        }

        if (getOtherPlayer().board.areAllShipsSunk()) {
            let message;
            if (getCurrentPlayer() === p1) {
                message = "Player 1 Wins!";
            } else {
                message = "Player 2 Wins!";
            }

            displayGameOver(message);

            return;
        }
    }

    // Execute computer player action if it is its turn
    if (getCurrentPlayer().type === "computer") {
        getCurrentPlayer().sendAttack(getOtherPlayer().board);
    }
}

// Updates board display based on provided state
function onTurnChange(state) {
    if (!state) {
        displayShips(p1, p2, state);
    } else {
        displayShips(p2, p1, state);
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
            dragged = e.target;
        });
    }

    const leftCells = document.querySelectorAll(".left .grid .cell");
    for (let cell of leftCells) {
        cell.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        cell.addEventListener("drop", (e) => {
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

            let target = e.target;
            displayShipOnGrid(target, dragged, size);
        });
    }

    const rightCells = document.querySelectorAll(".right .grid .cell");
    for (let cell of rightCells) {
        cell.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        cell.addEventListener("drop", (e) => {
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
            displayShipOnGrid(target, dragged, size);
        });
    }
}
