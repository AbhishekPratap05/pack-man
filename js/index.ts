'use strict'

import { LEVEL, OBJECT_TYPE } from "./setup";
import { INITIAL_SCORE, GLOBAL_SPEED, POWER_PILL_TIME, EAT_GHOST_BONUS, DOT_SCORE, PILL_SCORE } from "./const";
import { randomMovement } from "./GhostMoves";

import GameBoard from './GameBoard';
import Pacman from './Packman';
import Ghost from "./Ghost";

import soundDot from '../sounds/munch.wav';
import soundPill from '../sounds/pill.wav';
import soundGameStart from '../sounds/game_start.wav';
import soundGameOver from '../sounds/death.wav';
import soundGhost from '../sounds/eat_ghost.wav';

class Game {

    private score = INITIAL_SCORE;
    private timer: number | ReturnType<typeof setTimeout> | undefined = undefined;
    private gameWin = false;
    private powerPillActive = false;
    private powerPillTimer: number | ReturnType<typeof setTimeout> | undefined = undefined;

    private readonly gameGrid: HTMLDivElement | null;
    private readonly scoreTable: HTMLDivElement | null;
    private readonly startButton: HTMLButtonElement | null;
    private readonly topButton: HTMLButtonElement | null;
    private readonly leftButton: HTMLButtonElement | null;
    private readonly rightButton: HTMLButtonElement | null;
    private readonly bottomButton: HTMLButtonElement | null;
    private readonly navigationButtonContainer: HTMLDivElement | null;

    private readonly gameBoard: GameBoard;

    constructor() {
        this.gameGrid = document.querySelector("#game");
        this.scoreTable = document.querySelector("#score");
        this.startButton = document.querySelector("#start-button");
        this.topButton = document.querySelector("#top-button");
        this.leftButton = document.querySelector("#left-button");
        this.rightButton = document.querySelector("#right-button");
        this.bottomButton = document.querySelector("#bottom-button");
        this.navigationButtonContainer = document.querySelector("#navigationContainer");


        this.startButton!.textContent = "🕹️";
        this.topButton!.textContent = "🔼";
        this.leftButton!.textContent = "◀️";
        this.rightButton!.textContent = "▶️";
        this.bottomButton!.textContent = "🔽";


        if (this.gameGrid) {
            this.gameBoard = GameBoard.createGameBoard(this.gameGrid, LEVEL);
        }

    }
    //Audio
    private playAudio = (audio: string) => {
        const soundEffect = new Audio(audio);
        soundEffect.play();
    }


    private gameOver = (pacman: Pacman) => {
        this.playAudio(soundGameOver);
        document.removeEventListener('keydown', e =>
            pacman.handleKeyInput(e, this.gameBoard.objectExist)
        );
        this.topButton!.removeEventListener('click', () => pacman.handleKeyInput("ArrowUp", this.gameBoard.objectExist));
        this.leftButton!.removeEventListener('click', () => pacman.handleKeyInput("ArrowLeft", this.gameBoard.objectExist));
        this.rightButton!.removeEventListener('click', () => pacman.handleKeyInput("ArrowRight", this.gameBoard.objectExist));
        this.bottomButton!.removeEventListener('click', () => pacman.handleKeyInput("ArrowDown", this.gameBoard.objectExist));

        this.gameBoard.showGameStatus(this.gameWin);
        clearInterval(this.timer);

        this.startButton!.classList.remove('hide');
        this.navigationButtonContainer!.classList.add('hide');

    }

    private checkCollision = (pacman: Pacman, ghosts: Ghost[]) => {
        const collidedGhost = ghosts.find(ghost => pacman.pos === ghost.pos);

        if (collidedGhost) {
            if (pacman.powerPill) {
                this.playAudio(soundGhost);
                this.gameBoard.removeObject(collidedGhost.pos, [
                    OBJECT_TYPE.GHOST,
                    OBJECT_TYPE.SCARED,
                    collidedGhost.name
                ]);
                collidedGhost.pos = collidedGhost.startPos;
                this.score += EAT_GHOST_BONUS;
            } else {
                this.gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
                this.gameBoard.rotateDiv(pacman.pos, 0);
                this.gameOver(pacman/*, this.gameGrid*/);
            }
        }
    }

    private gameLoop = (pacman: Pacman, ghosts: Ghost[]) => {
        this.gameBoard.moveCharacter(pacman);
        this.checkCollision(pacman, ghosts);

        ghosts.forEach(ghost => this.gameBoard.moveCharacter(ghost));
        this.checkCollision(pacman, ghosts);

        //check if pacman eats a dot
        if (this.gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {
            this.playAudio(soundDot);
            this.gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
            this.gameBoard.dotCount--;
            this.score += DOT_SCORE;
        }
        //check if pacman eats a powerPill
        if (this.gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {
            this.playAudio(soundPill);
            this.gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);

            pacman.powerPill = true;
            this.score += PILL_SCORE;

            clearTimeout(this.powerPillTimer);
            this.powerPillTimer = setTimeout(() => (pacman.powerPill = false), POWER_PILL_TIME);
        }
        //check ghost scare mode depending on power pill
        if (pacman.powerPill !== this.powerPillActive) {
            this.powerPillActive = pacman.powerPill;
            ghosts.forEach(ghost => (ghost.isScared = pacman.powerPill));
        }

        //check if all the dots have been eaten
        if (this.gameBoard.dotCount === 0) {
            this.gameWin = true;
            this.gameOver(pacman/*, ghosts*/);
        }

        //show the score
        this.scoreTable!.innerHTML = `${this.score}`;
    }

    private startGame = () => {
        this.playAudio(soundGameStart);
        this.gameWin = false;
        this.powerPillActive = false;
        this.score = INITIAL_SCORE;

        this.startButton!.classList.add('hide');
        this.navigationButtonContainer!.classList.remove('hide');

        this.gameBoard.createGrid(LEVEL);
        const pacman = new Pacman(2, 287);
        this.gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
        document.addEventListener('keydown', e =>
            pacman.handleKeyInput(e, this.gameBoard.objectExist)
        );

        this.topButton!.addEventListener('click', () => pacman.handleKeyInput("ArrowUp", this.gameBoard.objectExist));
        this.leftButton!.addEventListener('click', () => pacman.handleKeyInput("ArrowLeft", this.gameBoard.objectExist));
        this.rightButton!.addEventListener('click', () => pacman.handleKeyInput("ArrowRight", this.gameBoard.objectExist));
        this.bottomButton!.addEventListener('click', () => pacman.handleKeyInput("ArrowDown", this.gameBoard.objectExist));
        const ghosts = [
            new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
            new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
            new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
            new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
        ]
        this.timer = setInterval(() =>
            this.gameLoop(pacman, ghosts), GLOBAL_SPEED
        )
    }

    public init = () => {
        this.startButton!.addEventListener('click', this.startGame);
    }
}

const game = new Game();
game.init();
