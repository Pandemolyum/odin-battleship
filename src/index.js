import { Player } from "./player.js";
import { createEventListeners } from "./dom-controller.js";

const p1 = new Player("human");
const p2 = new Player("computer");

createEventListeners();
