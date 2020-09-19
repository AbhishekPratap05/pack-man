import { LEVEL,OBJECT_TYPE  } from "./setup";
import { INITIAL_SCORE, GLOBAL_SPEED, POWER_PILL_TIME, EAT_GHOST_BONUS, DOT_SCORE} from "./const";
import { randomMovement } from "./GhostMoves";

import GameBoard from './GameBoard';
import Pacman from './Packman';
import Ghost from "./Ghost";


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


const gameOver = (pacman,grid) => {
    document.removeEventListener('keydown',e =>
        pacman.handleKeyInput(e, gameBoard.objectExist)
    );
    gameBoard.showGameStatus(gameWin);
    clearInterval(timer);

    startButton.classList.remove('hide');
    
}

const checkCollision = (pacman,ghosts) => {
    const collidedGhost = ghosts.find(ghost => pacman.pos === ghost.pos);

    if(collidedGhost){
        if(pacman.powerPill){
            gameBoard.removeObject(collidedGhost.pos, [
                OBJECT_TYPE.GHOST,
                OBJECT_TYPE.SCARED,
                collidedGhost.name
            ]);
            collidedGhost.pos = collidedGhost.startPos;
            score += EAT_GHOST_BONUS;
        }else{
            gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
            gameBoard.rotateDiv(pacman.pos,0);
            gameOver(pacman,gameGrid);
        }
    }
}

const gameLoop = (pacman,ghosts) => {
    gameBoard.moveCharacter(pacman);
    checkCollision(pacman,ghosts);

    ghosts.forEach(ghost => gameBoard.moveCharacter(ghost));
    checkCollision(pacman,ghosts);

    //check if pacman eats a dot
    if(gameBoard.objectExist(pacman.pos,OBJECT_TYPE.DOT)){
        gameBoard.removeObject(pacman.pos,[OBJECT_TYPE.DOT]);
        gameBoard.dotCount--;
        score += DOT_SCORE;
    }
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
    const ghosts = [
        new  Ghost(5,188,randomMovement,OBJECT_TYPE.BLINKY),
        new  Ghost(4,209,randomMovement,OBJECT_TYPE.PINKY),
        new  Ghost(3,230,randomMovement,OBJECT_TYPE.INKY),
        new  Ghost(2,251,randomMovement,OBJECT_TYPE.CLYDE)
    ]
    timer = setInterval(()=>
        gameLoop(pacman,ghosts),GLOBAL_SPEED
    )
}

//Initialize game
startButton.addEventListener('click',startGame);