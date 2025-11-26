const { Gameboard } = require("./gameboard");
const BOARD_SIZE = 10;

class Player {
    constructor(type) {
        this.type = type; // human or computer player
        this.gameboard = new Gameboard(BOARD_SIZE);
    }
}
