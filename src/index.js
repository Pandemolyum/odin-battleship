import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { Observer } from "./observer.js";
import { createEventListeners, displayShips } from "./dom-controller.js";

const p1 = new Player("human");
const p1observer = new Observer("p1observer", p1obs);
p1.board.subject.subscribe(p1observer);
const p2 = new Player("computer");
const p2observer = new Observer("p1observer", p2obs);
p2.board.subject.subscribe(p2observer);

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

createEventListeners();

function p1obs(state) {
    if (state === "shipPlaced") {
        displayShips(p1, "left");
    }
}

function p2obs(state) {
    if (state === "shipPlaced") {
        displayShips(p2, "right");
    }
}
