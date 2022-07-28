'use strict'

import Ghost from '../js/Ghost'
import { randomMovement } from "../js/GhostMoves";
import { OBJECT_TYPE, DIRECTIONS } from "../js/setup";


describe("test Ghost constructor", () => {
    const ghost = new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY);

    it('test new instance properties: ', () => {
        expect(ghost).toHaveProperty('name', OBJECT_TYPE.BLINKY);
        expect(ghost).toHaveProperty('movementFun');
        expect(ghost).toHaveProperty('startPos', 188);
        expect(ghost).toHaveProperty('pos', 188);
        expect(ghost).toHaveProperty('dir', DIRECTIONS.ArrowRight);
        expect(ghost).toHaveProperty('speed', 5);
        expect(ghost).toHaveProperty('timer', 0);
        expect(ghost).toHaveProperty('isScared', false);
        expect(ghost).toHaveProperty('rotation', false);

    })
});
