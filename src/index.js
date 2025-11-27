import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { Subject, Observer } from "./observer.js";
import {
    createEventListeners,
    displayPlacedShips,
    displayShips,
    displayAttackedSquare,
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
createEventListeners(p1, p2);

// Combat phase start
playerTurn.setState(false);

// ========== FUNCTIONS ==========
// Updates the board display dynamically based on the specified board state
function onBoardChange(state) {
    if (state[0] === "shipPlaced") {
        displayPlacedShips(playerTurn.state, state[1]);
    } else if (state[0] === "attackReceived") {
        displayAttackedSquare(playerTurn.state, state[1], state[2]);

        // If the attack does not hit a ship
        if (!state[2]) {
            playerTurn.setState(!playerTurn.state);
        }
    }

    // Execute computer player action if it is its turn
    if (playerTurn.state && p2.type === "computer") {
        p2.sendAttack(p1.board);
    } else if (!playerTurn.state && p1.type === "computer") {
        p1.sendAttack(p2.board);
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
