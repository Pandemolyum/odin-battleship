const { Gameboard } = require("./gameboard.js");
const { Ship } = require("./ship.js");

let gameboard;
let bigShip;
let mediumShip;
let smallShip;
beforeEach(() => {
    gameboard = new Gameboard(10);
    bigShip = new Ship(4);
    mediumShip = new Ship(3);
    smallShip = new Ship(2);
});

test("place ships on gameboard", () => {
    gameboard.placeShip([6, 2], true, bigShip);
    gameboard.placeShip([4, 4], false, smallShip);

    expect(gameboard.board[6][2]).not.toBe(null);
    expect(gameboard.board[6][3]).not.toBe(null);
    expect(gameboard.board[6][4]).not.toBe(null);
    expect(gameboard.board[6][5]).not.toBe(null);

    expect(gameboard.board[4][4]).not.toBe(null);
    expect(gameboard.board[5][4]).not.toBe(null);
});

test("prevent ships from overlapping", () => {
    gameboard.placeShip([6, 2], true, bigShip);
    gameboard.placeShip([4, 4], false, mediumShip);

    expect(gameboard.board[4][4]).toBe(null);
    expect(gameboard.board[5][4]).toBe(null);
    expect(gameboard.board[6][4]).not.toBe(null);
});

test("update board when an attack is received", () => {
    gameboard.placeShip([6, 2], true, bigShip);
    gameboard.placeShip([4, 4], false, smallShip);

    gameboard.receiveAttack([4, 4]);
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([9, 9]);

    expect(gameboard.board[4][4]).toBe(1);
    expect(gameboard.board[5][4]).not.toBe(1);
    expect(gameboard.board[5][4]).not.toBe(0);
    expect(gameboard.board[0][0]).toBe(0);
    expect(gameboard.board[9][9]).toBe(0);
    expect(gameboard.board[9][8]).toBe(null);
});

test("sink ship after all of its squares have been hit", () => {
    gameboard.placeShip([6, 2], true, bigShip);
    gameboard.placeShip([4, 4], false, smallShip);

    expect(bigShip.isSunk()).toBeFalsy();
    expect(smallShip.isSunk()).toBeFalsy();

    gameboard.receiveAttack([6, 2]);
    gameboard.receiveAttack([6, 3]);
    gameboard.receiveAttack([6, 4]);
    gameboard.receiveAttack([6, 5]);

    expect(bigShip.isSunk()).toBeTruthy();
    expect(smallShip.isSunk()).toBeFalsy();

    gameboard.receiveAttack([4, 4]);
    gameboard.receiveAttack([5, 4]);

    expect(gameboard.board[4][4]).toBeTruthy();
    expect(gameboard.board[4][4]).toBeTruthy();
});

test("check if all ships on the board have been sunk", () => {
    gameboard.placeShip([6, 2], true, bigShip);
    gameboard.placeShip([4, 4], false, smallShip);

    expect(gameboard.areAllShipsSunk()).toBeFalsy();

    gameboard.receiveAttack([6, 2]);
    gameboard.receiveAttack([6, 3]);
    gameboard.receiveAttack([6, 4]);
    gameboard.receiveAttack([6, 5]);

    expect(gameboard.areAllShipsSunk()).toBeFalsy();

    gameboard.receiveAttack([4, 4]);
    gameboard.receiveAttack([5, 4]);

    expect(gameboard.areAllShipsSunk()).toBeTruthy();
});
