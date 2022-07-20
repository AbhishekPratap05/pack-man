import { DIRECTIONS, OBJECT_TYPE } from "./setup";


export type RandomMovementFun = (position: number, direction: any, objectExist: any) => any;

export const randomMovement: RandomMovementFun = (position: number, direction: any, objectExist: any) => {
    let dir = direction;
    let nextMovePos = position + dir.movement;
    //Create an array from the directions object keys

    const keys = Object.keys(DIRECTIONS);
    while (
        objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
        objectExist(nextMovePos, OBJECT_TYPE.GHOST)
    ) {
        //Get a random key from the key array
        const key = keys[Math.floor(Math.random() * keys.length)];
        //set the next move
        dir = DIRECTIONS[key];
        nextMovePos = position + dir.movement;
    }
    return { nextMovePos, direction: dir };
}
