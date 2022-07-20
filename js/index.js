import { LEVEL, OBJECT_TYPE } from "./setup";
import { INITIAL_SCORE, GLOBAL_SPEED, POWER_PILL_TIME, EAT_GHOST_BONUS, DOT_SCORE, PILL_SCORE } from "./const";
import { randomMovement, RandomMovement } from "./GhostMoves.ts";

import GameBoard from './GameBoard.ts';
import Pacman from './Packman.ts';
import Ghost from "./Ghost.ts";

import soundDot from '../sounds/munch.wav';
import soundPill from '../sounds/pill.wav';
import soundGameStart from '../sounds/game_start.wav';
import soundGameOver from '../sounds/death.wav';
import soundGhost from '../sounds/eat_ghost.wav';

//DOM Elements
const gameGrid = document.querySelector("#game");
const scoreTable = document.querySelector("#score");
const startButton = document.querySelector("#start-button");
const topButton = document.querySelector("#top-button");
const leftButton = document.querySelector("#left-button");
const rightButton = document.querySelector("#right-button");
const bottomButton = document.querySelector("#bottom-button");
const navigationButtonContainer = document.querySelector("#navigationContainer");
startButton.textContent = "🕹️";
topButton.textContent = "🔼";
leftButton.textContent = "◀️";
rightButton.textContent = "▶️";
bottomButton.textContent = "🔽";

const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);

//Initial Score
let score = INITIAL_SCORE;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;

//Audio
const playAudio = (audio) => {
    const soundEffect = new Audio(audio);
    soundEffect.play();
}


const gameOver = (pacman, grid) => {
    playAudio(soundGameOver);
    document.removeEventListener('keydown', e =>
        pacman.handleKeyInput(e, gameBoard.objectExist)
    );
    topButton.removeEventListener('click', () => pacman.handleKeyInput("ArrowUp", gameBoard.objectExist));
    leftButton.removeEventListener('click', () => pacman.handleKeyInput("ArrowLeft", gameBoard.objectExist));
    rightButton.removeEventListener('click', () => pacman.handleKeyInput("ArrowRight", gameBoard.objectExist));
    bottomButton.removeEventListener('click', () => pacman.handleKeyInput("ArrowDown", gameBoard.objectExist));

    gameBoard.showGameStatus(gameWin);
    clearInterval(timer);

    startButton.classList.remove('hide');
    navigationButtonContainer.classList.add('hide');

}

const checkCollision = (pacman, ghosts) => {
    const collidedGhost = ghosts.find(ghost => pacman.pos === ghost.pos);

    if (collidedGhost) {
        if (pacman.powerPill) {
            playAudio(soundGhost);
            gameBoard.removeObject(collidedGhost.pos, [
                OBJECT_TYPE.GHOST,
                OBJECT_TYPE.SCARED,
                collidedGhost.name
            ]);
            collidedGhost.pos = collidedGhost.startPos;
            score += EAT_GHOST_BONUS;
        } else {
            gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
            gameBoard.rotateDiv(pacman.pos, 0);
            gameOver(pacman, gameGrid);
        }
    }
}

const gameLoop = (pacman, ghosts) => {
    gameBoard.moveCharacter(pacman);
    checkCollision(pacman, ghosts);

    ghosts.forEach(ghost => gameBoard.moveCharacter(ghost));
    checkCollision(pacman, ghosts);

    //check if pacman eats a dot
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {
        playAudio(soundDot);
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
        gameBoard.dotCount--;
        score += DOT_SCORE;
    }
    //check if pacman eats a powerPill
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {
        playAudio(soundPill);
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);

        pacman.powerPill = true;
        score += PILL_SCORE;

        clearTimeout(powerPillTimer);
        powerPillTimer = setTimeout(() => (pacman.powerPill = false), POWER_PILL_TIME);
    }
    //check ghost scare mode depending on power pill
    if (pacman.powerPill !== powerPillActive) {
        powerPillActive = pacman.powerPill;
        ghosts.forEach(ghost => (ghost.isScared = pacman.powerPill));
    }

    //check if all the dots have been eaten
    if (gameBoard.dotCount === 0) {
        gameWin = true;
        gameOver(pacman, ghosts);
    }

    //show the score
    scoreTable.innerHTML = score;
}

const startGame = () => {
    playAudio(soundGameStart);
    gameWin = false;
    powerPillActive = false;
    score = INITIAL_SCORE;

    startButton.classList.add('hide');
    navigationButtonContainer.classList.remove('hide');

    gameBoard.createGrid(LEVEL);
    const pacman = new Pacman(2, 287);
    gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
    document.addEventListener('keydown', e =>
        pacman.handleKeyInput(e, gameBoard.objectExist)
    );

    topButton.addEventListener('click', () => pacman.handleKeyInput("ArrowUp", gameBoard.objectExist));
    leftButton.addEventListener('click', () => pacman.handleKeyInput("ArrowLeft", gameBoard.objectExist));
    rightButton.addEventListener('click', () => pacman.handleKeyInput("ArrowRight", gameBoard.objectExist));
    bottomButton.addEventListener('click', () => pacman.handleKeyInput("ArrowDown", gameBoard.objectExist));
    const ghosts = [
        new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
        new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
        new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
        new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
    ]
    timer = setInterval(() =>
        gameLoop(pacman, ghosts), GLOBAL_SPEED
    )
}

//Initialize game
startButton.addEventListener('click', startGame);