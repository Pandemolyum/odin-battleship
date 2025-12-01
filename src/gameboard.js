import { Ship } from "./ship.js";
import { Subject } from "./observer.js";

class Gameboard {
    constructor(size) {
        this.board = this.initializeBoard(size);
        this.subject = new Subject();
    }

    // Creates a square empty board of specified size with all cell values set to null
    initializeBoard(size) {
        const board = new Array(size)
            .fill(0)
            .map(() => new Array(size).fill(null));
        return board;
    }

    // Places ship object at the specified coordinates, facing the indicated
    // direction. hdirection is true when the ship is placed horizontally and
    // false if it is placed vertically
    placeShip(coords, hdirection, ship) {
        // Return if a ship already exists in the position of the placed ship
        for (let i = 0; i < ship.length; i++) {
            if (
                (hdirection && this.board[coords[0]][coords[1] + i] !== null) ||
                (!hdirection && this.board[coords[0] + i][coords[1]] !== null)
            ) {
                return;
            }
        }

        // Assign ship to gameboard coordinates
        for (let i = 0; i < ship.length; i++) {
            if (hdirection) {
                this.board[coords[0]][coords[1] + i] = ship;

                this.subject.setState([
                    "shipPlaced",
                    [coords[0], coords[1] + i],
                ]);
            } else {
                this.board[coords[0] + i][coords[1]] = ship;

                this.subject.setState([
                    "shipPlaced",
                    [coords[0] + i, coords[1]],
                ]);
            }
        }
    }

    // Returns the ship coordinates
    getShipCoords(ship) {
        let coordsArr = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                if (this.board[i][j] === ship) {
                    coordsArr.push([i, j]);
                }
            }
        }
        return coordsArr;
    }

    clearCells(coordsArr) {
        coordsArr.forEach((e) => {
            this.board[e[0]][e[1]] = null;
        });
    }

    // Rotates the object at the position indicated by coords
    rotateShip(coords) {
        const ship = this.board[coords[0]][coords[1]];

        const lastCoords = this.getShipCoords(ship);
        this.clearCells(lastCoords);

        this.subject.setState(["shipRotated", lastCoords]);

        if (lastCoords[0][0] === lastCoords[1][0]) {
            this.placeShip(lastCoords[0], false, ship);
        } else {
            this.placeShip(lastCoords[0], true, ship);
        }
    }

    // If there is a ship at the specified coordinates, the ship is damaged and the
    // square is updated to indicate that it has been attacked
    receiveAttack(coords) {
        const ship = this.board[coords[0]][coords[1]];
        if (ship !== null && ship !== 1 && ship !== 0) {
            ship.hit();
            this.board[coords[0]][coords[1]] = 1;
            this.subject.setState(["attackReceived", coords, true]);
        } else if (ship === null) {
            this.board[coords[0]][coords[1]] = 0;
            this.subject.setState(["attackReceived", coords, false]);
        }
    }

    // Returns true if all ships on the board are sunk and false otherwise
    areAllShipsSunk() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                if (this.board[i][j] instanceof Ship) {
                    return false;
                }
            }
        }
        return true;
    }
}

export { Gameboard };
