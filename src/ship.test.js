const { Ship } = require("./ship.js");

test("returns true if ship is sunk", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();

    expect(ship.isSunk() === true).toBe(true);
});
