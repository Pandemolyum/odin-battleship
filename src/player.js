import { Gameboard } from "./gameboard.js";
const BOARD_SIZE = 10;

class Player {
    constructor(type) {
        this.type = type; // human or computer player
        this.board = new Gameboard(BOARD_SIZE);
    }
}

export { Player };
