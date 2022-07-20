import { RandomMovementFun } from "./GhostMoves";
import { DIRECTIONS, OBJECT_TYPE } from "./setup";

class Ghost {
    private name: string;
    private movement: RandomMovementFun;
    private startPos: number;
    private pos: number;
    private dir: any; //IDirection
    private speed: number;
    private timer: number;
    private isScared: boolean;
    private rotation: boolean;

    constructor(speed = 5, startPos: number, movement: RandomMovementFun, name: string) {
        this.name = name;
        this.movement = movement;
        this.startPos = startPos;
        this.pos = startPos;
        this.dir = DIRECTIONS.ArrowRight;
        this.speed = speed;
        this.timer = 0;
        this.isScared = false;
        this.rotation = false;
    }

    shouldMove = () => {
        if (this.timer === this.speed) {
            this.timer = 0;
            return true;
        }
        this.timer++;
        return false;
    }

    getNextMove = (objectExist) => {
        const { nextMovePos, direction } = this.movement(this.pos, this.dir, objectExist);
        return { nextMovePos, direction };
    }
    makeMove = () => {
        const classesToRemove = [OBJECT_TYPE.GHOST, OBJECT_TYPE.SCARED, this.name];
        let classesToAdd = [OBJECT_TYPE.GHOST, this.name];

        if (this.isScared) classesToAdd = [...classesToAdd, OBJECT_TYPE.SCARED];
        return { classesToRemove, classesToAdd };
    }
    setNewPos = (nextMovePos: number, direction: any) => {
        this.pos = nextMovePos;
        this.dir = direction;
    }
}

export default Ghost;