import { RandomMovementFun, ObjectExistFun, IDirection } from "../types";
import { DIRECTIONS, OBJECT_TYPE } from "./setup";

class Ghost {
    public name: string;
    private movementFun: RandomMovementFun;
    public startPos: number;
    public pos: number;
    private dir: IDirection
    private speed: number;
    private timer: number;
    public isScared: boolean;
    private rotation: boolean;

    constructor(speed = 5, startPos: number, movementFun: RandomMovementFun, name: string) {
        this.name = name;
        this.movementFun = movementFun;
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

    getNextMove = (objectExist: ObjectExistFun) => {
        const { nextMovePos, direction } = this.movementFun(this.pos, this.dir, objectExist);
        return { nextMovePos, direction };
    }
    makeMove = () => {
        const classesToRemove = [OBJECT_TYPE.GHOST, OBJECT_TYPE.SCARED, this.name];
        let classesToAdd = [OBJECT_TYPE.GHOST, this.name];

        if (this.isScared) classesToAdd = [...classesToAdd, OBJECT_TYPE.SCARED];
        return { classesToRemove, classesToAdd };
    }
    setNewPos = (nextMovePos: number, direction: IDirection) => {
        this.pos = nextMovePos;
        this.dir = direction;
    }
}

export default Ghost;