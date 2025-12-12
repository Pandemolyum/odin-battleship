import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";
const BOARD_SIZE = 10;

class Player {
    constructor(type) {
        this.type = type; // human or computer player
        this.board = new Gameboard(BOARD_SIZE);
    }

    // The below methods should be used by computer players only
    hitCoords = [];

    // Sends a random attack to the enemy board
    sendAttack(board) {
        // Ensure that there are squares left
        if (this.hitCoords.length <= BOARD_SIZE ** 2) {
            let x, y;
            do {
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
            } while (
                this.hitCoords.some((elem) => elem[0] === x && elem[1] === y)
            );

            this.hitCoords.push([x, y]);
            board.receiveAttack([x, y]);
        }
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
