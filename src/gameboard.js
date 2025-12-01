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
        // Return if a dfferent ship already exists in the position of the placed ship
        // or if it is outside of the grid boundaries
        for (let i = 0; i < ship.length; i++) {
            if (
                (hdirection && coords[1] + i > 9) ||
                (!hdirection && coords[0] + i > 9)
            )
                return;

            if (
                (hdirection && this.board[coords[0]][coords[1] + i] !== null) ||
                (!hdirection && this.board[coords[0] + i][coords[1]] !== null)
            )
                return;
        }

        // Assign ship to gameboard coordinates
        for (let i = 0; i < ship.length; i++) {
            if (hdirection) {
                this.board[coords[0]][coords[1] + i] = ship;

                this.subject.setState([
                    "shipPlaced",
                    [coords[0], coords[1] + i],
                    ship.length,
                ]);
            } else {
                this.board[coords[0] + i][coords[1]] = ship;

                this.subject.setState([
                    "shipPlaced",
                    [coords[0] + i, coords[1]],
                    ship.length,
                ]);
            }
        }

        return true;
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
        this.subject.setState(["shipRemoved", coordsArr]);
    }

    // Rotates the object at the position indicated by coords
    rotateShip(coords) {
        const ship = this.board[coords[0]][coords[1]];

        const lastCoords = this.getShipCoords(ship);
        this.clearCells(lastCoords);

        // Attempt to rotate ship
        let placed;
        if (lastCoords[0][0] === lastCoords[1][0]) {
            placed = this.placeShip(lastCoords[0], false, ship);
        } else {
            placed = this.placeShip(lastCoords[0], true, ship);
        }

        // If the ship is not rotated, maintain previous position
        if (!placed) {
            if (lastCoords[0][0] === lastCoords[1][0]) {
                this.placeShip(lastCoords[0], true, ship);
            } else {
                this.placeShip(lastCoords[0], false, ship);
            }
        }
    }

    // Moves the object at the position indicated by coords
    moveShip(targetCoords, newCoords) {
        const ship = this.board[targetCoords[0]][targetCoords[1]];

        const lastCoords = this.getShipCoords(ship);
        this.clearCells(lastCoords);

        // Attempt to move the ship
        let placed;
        if (lastCoords[0][0] === lastCoords[1][0]) {
            placed = this.placeShip(newCoords, true, ship);
        } else {
            placed = this.placeShip(newCoords, false, ship);
        }

        // If the ship is not moved, maintain previous position
        if (!placed) {
            if (lastCoords[0][0] === lastCoords[1][0]) {
                this.placeShip(targetCoords, true, ship);
            } else {
                this.placeShip(targetCoords, false, ship);
            }
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
