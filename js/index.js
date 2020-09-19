import { LEVEL,OBJECT_TYPE  } from "./setup";
import { INITIAL_SCORE, GLOBAL_SPEED, POWER_PILL_TIME} from "./const";
import GameBoard from './GameBoard';
import Pacman from './Packman';

//DOM Elements
const gameGrid = document.querySelector("#game");
const scoreTable = document.querySelector("#score");
const startButton = document.querySelector("#start-button");

const gameBoard = GameBoard.createGameBoard(gameGrid,LEVEL);

//Initial Score
let score = INITIAL_SCORE;
let timer = null;
let gameWin =false;
let powerPillActive = false;
let powerPillTimer = null;


const gameOver = (Pacman,grid) => {
    
}

const checkCollision = (Pacman,ghost) => {

}

const gameLoop = (pacman,ghost) => {
    gameBoard.moveCharacter(pacman);
}

const startGame = () => {
    gameWin = false;
    powerPillActive = false;
    score = INITIAL_SCORE;

    startButton.classList.add('hide');

    gameBoard.createGrid(LEVEL);
    const pacman =new Pacman(2,287);
    gameBoard.addObject(287,[OBJECT_TYPE.PACMAN]);
    document.addEventListener('keydown',e => 
        pacman.handleKeyInput(e, gameBoard.objectExist)
    );
    timer = setInterval(()=>
        gameLoop(pacman),GLOBAL_SPEED
    )
}

//Initialize game
startButton.addEventListener('click',startGame);