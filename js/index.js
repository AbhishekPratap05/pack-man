import { LEVEL,OBJECT_TYPE  } from "./setup";
import { INITIAL_SCORE, GLOBAL_SPEED, POWER_PILL_TIME} from "./const";
import GameBoard from './GameBoard';

//DOM Elements
const gameGrid = document.querySelector("#game");
const scoreTable = document.querySelector("#score");
const startButton = document.querySelector("start-button");

const gameBoard = GameBoard.createGameBoard(gameGrid,LEVEL);

//Initial Score
let score = INITIAL_SCORE;
let timer = null;
let gameWin =false;
let powerPillActive = false;
let powerPillTimer = null;


const gameOver = (packman,grid) => {
    
}

const checkCollision = (packman,ghost) => {

}

const startGame = () => {

}