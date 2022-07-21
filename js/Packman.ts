import { RandomMovementFun, ObjectExistFun, IDirection } from "../types";
import { OBJECT_TYPE, DIRECTIONS } from "./setup";

class Pacman {
    public pos: number;
    private speed: number;
    private dir: IDirection;
    private timer: number;
    public powerPill: boolean;
    private rotation: boolean;

    constructor(speed: number, startPos: number) {
        this.pos = startPos;
        this.speed = speed;
        this.dir = DIRECTIONS.None;
        this.timer = 0;
        this.powerPill = false;
        this.rotation = true;
    }

    shouldMove = () => {
        if (!this.dir) return false;

        if (this.timer === this.speed) {
            this.timer = 0;
            return true;
        }
        this.timer++;
    }

    getNextMove = (objectExist: ObjectExistFun) => {
        let nextMovePos = this.pos + this.dir.movement;

        if (
            objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
            objectExist(nextMovePos, OBJECT_TYPE.GHOSTLAIR)
        ) {
            nextMovePos = this.pos;
        }

        return { nextMovePos, direction: this.dir };
    }

    makeMove = () => {
        const classesToRemove = [OBJECT_TYPE.PACMAN];
        const classesToAdd = [OBJECT_TYPE.PACMAN];

        return { classesToRemove, classesToAdd }
    }

    setNewPos = (nextMovePos: number) => {
        this.pos = nextMovePos;
    }

    handleKeyInput = (e: string | KeyboardEvent, objectExist: ObjectExistFun) => {
        let dir;
        if (typeof e === "string") {
            dir = DIRECTIONS[e];
        } else if (e.keyCode >= 37 && e.keyCode <= 40) {
            dir = DIRECTIONS[e.key];
        } else {
            return;
        }
        const nextMovePos = this.pos + dir.movement;
        if (objectExist(nextMovePos, OBJECT_TYPE.WALL) || objectExist(nextMovePos, OBJECT_TYPE.GHOSTLAIR)) return;
        this.dir = dir;
    }
}

export default Pacman;