'use strict'

import Packman from '../js/Packman'
import { OBJECT_TYPE, DIRECTIONS } from "../js/setup";

describe("test Packman constructor", () => {
    const pacman = new Packman(2, 287);

    it('test new instance properties: ', () => {
        expect(pacman).toHaveProperty('pos', 287);
        expect(pacman).toHaveProperty('speed', 2);
        expect(pacman).toHaveProperty('dir', DIRECTIONS.None);
        expect(pacman).toHaveProperty('dir', DIRECTIONS.None);
        expect(pacman).toHaveProperty('timer', 0);
        expect(pacman).toHaveProperty('powerPill', false);
        expect(pacman).toHaveProperty('rotation', true);
    })
});
