import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { Observer } from "./observer.js";
import {
    createEventListeners,
    displayShips,
    displayAttackedSquare,
} from "./dom-controller.js";

// Player 1 initialization
const p1 = new Player("human");
const p1observer = new Observer("p1observer", p1obs);
p1.board.subject.subscribe(p1observer);

// Player 2 initialization
const p2 = new Player("computer");
const p2observer = new Observer("p1observer", p2obs);
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

// Game state initialization
let gameState = "combat"; // possible states: position, combat, ended
let playerTurn = 0; // 0 for player 1 turn and 1 for player 2 turn

// ========== FUNCTIONS ==========
function p1obs(state) {
    if (state[0] === "shipPlaced") {
        displayShips(p1, "left", state[1]);
    } else if (state[0] === "attackReceived") {
        displayAttackedSquare(p1, "left", state[1]);
    }
}

function p2obs(state) {
    if (state[0] === "shipPlaced") {
        displayShips(p2, "right", state[1]);
    } else if (state[0] === "attackReceived") {
        displayAttackedSquare(p2, "right", state[1]);
    }
}
