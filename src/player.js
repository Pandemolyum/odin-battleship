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

    // Sends a random attack to the enemy board
    sendAttack(board) {
        // Ensure that there are squares left
        if (this.hitCoords.length <= BOARD_SIZE ** 2) {
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
            } while (
                this.hitCoords.some((elem) => elem[0] === x && elem[1] === y)
            );

            this.hitCoords.push([x, y]);
            const ship = board.board[x][y];
            let isHit = board.receiveAttack([x, y]);

            // If ship is sunk, clear nextAttack array and do not plan
            // for more targeted attacks
            if (ship instanceof Ship && ship.isSunk()) {
                isHit = false;
                this.nextAttack = [];
            }

            // Determine next attack
            if (isHit) {
                const relPos = [
                    [0, 1],
                    [1, 0],
                    [0, -1],
                    [-1, 0],
                ];

                this.nextAttack = relPos.map((elem) => [
                    x + elem[0],
                    y + elem[1],
                ]);

                this.nextAttack = this.nextAttack.filter(
                    (elem) =>
                        elem[0] >= 0 &&
                        elem[0] <= 9 &&
                        elem[1] >= 0 &&
                        elem[1] <= 9
                );
            }
        }
    }
}

export { Player };
