import { OBJECT_TYPE, CLASS_LIST } from "./setup";
import { GRID_SIZE, CELL_SIZE, WIN, LOSE } from "./const";
import { ObjectExistFun } from "../types";

class GameBoard {
    public dotCount: number;
    private grid: HTMLDivElement[];
    private domGrid: HTMLDivElement;
    public objectExist: ObjectExistFun;

    constructor(domGrid: HTMLDivElement) {
        this.dotCount = 0;
        this.grid = [];
        this.domGrid = domGrid;

        this.objectExist = (pos: number, object: string) => {
            return this.grid[pos].classList.contains(object);
        }
    }

    showGameStatus = (gameWin: boolean) => {
        const div = document.createElement('div');
        div.classList.add('game-status');
        div.innerHTML = `${gameWin ? WIN : LOSE}`;
        this.domGrid.appendChild(div);
    }
    createGrid = (level: number[]) => {
        this.dotCount = 0; //reset when game reset
        this.grid = [];
        this.domGrid.innerHTML = '';
        this.domGrid.style.cssText = `grid-template-columns:repeat(${GRID_SIZE},${CELL_SIZE}px)`;

        level.forEach((square: number, i: number) => {
            const div = document.createElement('div');
            div.classList.add('square', CLASS_LIST[square]);
            div.style.cssText = `width:${CELL_SIZE}px; height: ${CELL_SIZE}px;`;
            this.domGrid.appendChild(div);
            this.grid.push(div);

            CLASS_LIST[square] === OBJECT_TYPE.DOT ? this.dotCount++ : null;
        });

    }

    addObject = (pos: number, classes: string[]) => {
        this.grid[pos].classList.add(...classes);
    }

    removeObject = (pos: number, classes: string[]) => {
        this.grid[pos].classList.remove(...classes);
    }



    rotateDiv = (pos: number, deg: number) => {
        this.grid[pos].style.transform = `rotate(${deg}deg)`;
    }

    moveCharacter = (character) => {
        if (character.shouldMove()) {
            const { nextMovePos, direction } = character.getNextMove(this.objectExist);
            const { classesToRemove, classesToAdd } = character.makeMove();
            if (character.rotation && nextMovePos !== character.pos) {
                this.rotateDiv(nextMovePos, character.dir.rotation);
                this.rotateDiv(character.pos, 0)
            }
            this.removeObject(character.pos, classesToRemove);
            this.addObject(nextMovePos, classesToAdd);

            character.setNewPos(nextMovePos, direction);
        }
    }

    static createGameBoard = (domGrid: HTMLDivElement, level: number[]) => {
        const board = new this(domGrid);
        board.createGrid(level);
        return board;
    }

}

export default GameBoard;