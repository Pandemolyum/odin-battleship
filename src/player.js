import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";
const BOARD_SIZE = 10;

class Player {
    constructor(type) {
        this.type = type; // human or computer player
        this.board = new Gameboard(BOARD_SIZE);
    }

    // The below methods and variables should be used by computer players only
    hitCoords = []; // Stores prevously hit squares
    nextAttack = []; // Stores potential next attacks after hitting a ship
    previousHit = null; // Stores previous successful attack if applicable
    hitShip = null; // Stores the last ship that was hit if not already sunk
    firstHit = null; // Stores the first hit on a given ship
    lastSweep = false; // Determines if the AI stops attacking the ship
    forceClear = false; // Forces clearing of above variables (except hitCoords)

    // Sends a random attack to the enemy board.
    // If the attack hits, attack adjacent squares
    sendAttack(board) {
        // Return if all squares have been hit already
        if (this.hitCoords.length >= BOARD_SIZE ** 2) return;

        let x, y;
        do {
            if (this.nextAttack.length === 0) {
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
            } else {
                const i = Math.floor(
                    Math.random() * (this.nextAttack.length - 1)
                );

                x = this.nextAttack[i][0];
                y = this.nextAttack[i][1];

                this.nextAttack.splice(i, 1);
            }
        } while (this.hitCoords.some((elem) => elem[0] === x && elem[1] === y));

        this.hitCoords.push([x, y]);
        const ship = board.board[x][y];
        let isHit = board.receiveAttack([x, y]);

        if (ship instanceof Ship && this.hitShip === null) {
            this.hitShip = ship;
            this.firstHit = [x, y];
        }

        // while (
        //     this.hitCoords.some(
        //         (elem) =>
        //             elem[0] === this.nextAttack[0][0] &&
        //             elem[1] === this.nextAttack[0][1]
        //     )
        // ) {
        // If ship is sunk, clear variables
        if (
            (this.hitShip !== null && this.hitShip.isSunk()) ||
            (!isHit && this.lastSweep) ||
            this.forceClear
        ) {
            this.nextAttack = [];
            this.previousHit = null;
            this.hitShip = null;
            this.firstHit = null;
            this.lastSweep = false;
        } else if (
            (!isHit && this.hitShip !== null && this.nextAttack.length === 0) ||
            (isHit && this.lastSweep) ||
            (isHit &&
                this.previousHit !== null &&
                (x + x - this.previousHit[0] > 9 ||
                    x + x - this.previousHit[0] < 0 ||
                    y + y - this.previousHit[1] > 9 ||
                    y + y - this.previousHit[1] < 0))
        ) {
            let x2, y2;
            if (isHit) {
                x2 = x;
                y2 = y;
            } else {
                x2 = this.previousHit[0];
                y2 = this.previousHit[1];
            }

            if (this.firstHit[0] > x2 && this.firstHit !== 9) {
                this.nextAttack = [[this.firstHit[0] + 1, y2]];
            } else if (this.firstHit[0] < x2 && this.firstHit !== 0) {
                this.nextAttack = [[this.firstHit[0] - 1, y2]];
            } else if (this.firstHit[1] > y2 && this.firstHit !== 9) {
                this.nextAttack = [[x2, this.firstHit[1] + 1]];
            } else if (this.firstHit[1] < y2 && this.firstHit !== 0) {
                this.nextAttack = [[x2, this.firstHit[1] - 1]];
            }

            this.nextAttack = this.nextAttack.filter(
                (elem) =>
                    elem[0] >= 0 && elem[0] <= 9 && elem[1] >= 0 && elem[1] <= 9
            );

            if (this.nextAttack.length === 0) this.forceClear = true;

            this.lastSweep = true;
            this.previousHit = null;
        }
        // Determine next attack
        else if (isHit && this.previousHit !== null) {
            this.nextAttack = [
                [x + x - this.previousHit[0], y + y - this.previousHit[1]],
            ];
        } else if (isHit) {
            const relPos = [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0],
            ];

            this.nextAttack = relPos.map((elem) => [x + elem[0], y + elem[1]]);

            this.nextAttack = this.nextAttack.filter(
                (elem) =>
                    elem[0] >= 0 && elem[0] <= 9 && elem[1] >= 0 && elem[1] <= 9
            );
        }
        // }

        if (isHit && ship !== null && ship.isSunk()) {
            this.previousHit = null;
        } else if (isHit) {
            this.previousHit = [x, y];
        }

        return isHit;
    }

    // Place a ship randomly on this.board
    // Return true if the ship is placed successfully and 2 if there are no more ships to place
    ships = [new Ship(2), new Ship(3), new Ship(3), new Ship(4), new Ship(5)];
    placeShip() {
        if (this.ships.length === 0) return 2;

        const coords = [
            Math.floor(Math.random() * BOARD_SIZE),
            Math.floor(Math.random() * BOARD_SIZE),
        ];
        const direction = Math.floor(Math.random() * 2);

        const result = this.board.placeShip(
            coords,
            direction,
            this.ships.at(-1)
        );

        if (result) this.ships.pop();

        return result;
    }
}

export { Player };
