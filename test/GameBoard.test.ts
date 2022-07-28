/**
 * @jest-environment jsdom
 */

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const window = (new JSDOM(``, { pretendToBeVisual: true })).window;
import GameBoard from '../js/GameBoard'
import { LEVEL, OBJECT_TYPE } from "../js/setup";

describe("test jsdom GameBoard constructor", () => {
    document.body.innerHTML = '<div id="game"></div>';
    let mockGameGrid = document.querySelector("#game") as HTMLDivElement;
    const gameBoard = GameBoard.createGameBoard(mockGameGrid, LEVEL);

    it('test new instance properties: ', () => {
        expect(gameBoard).toHaveProperty('dotCount', 172);
        expect(gameBoard).toHaveProperty('grid');
        expect(gameBoard['grid'].length).toBe(460);
        expect(gameBoard).toHaveProperty('domGrid');
        expect(gameBoard['domGrid'].childElementCount).toBe(460);
    });

    it('test dot tiles count: ', () => {
        let mockTiles = document.querySelectorAll("#game .square.dot");
        expect(mockTiles.length).toBe(172);
    });

    it('test wall tiles count: ', () => {
        let mockTiles = document.querySelectorAll("#game .square.wall");
        expect(mockTiles.length).toBe(232);
    });

    it('test blank tiles count: ', () => {
        let mockTiles = document.querySelectorAll("#game .square.blank");
        expect(mockTiles.length).toBe(36);
    });

    it('test lair tiles count: ', () => {
        let mockTiles = document.querySelectorAll("#game .square.lair");
        expect(mockTiles.length).toBe(16);
    });

    it('test objectExist fun: ', () => {
        expect(gameBoard.objectExist(1, "wall")).toBe(true);
        expect(gameBoard.objectExist(1, "dot")).toBe(false);
        expect(gameBoard.objectExist(22, "dot")).toBe(true);
        expect(gameBoard.objectExist(161, "blank")).toBe(true);
        expect(gameBoard.objectExist(189, "lair")).toBe(true);
    });
});