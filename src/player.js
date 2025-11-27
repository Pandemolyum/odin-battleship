import { Gameboard } from "./gameboard.js";
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
}

export { Player };
