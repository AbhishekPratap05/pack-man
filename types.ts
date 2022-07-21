
export interface IDirection {
    code: number,
    movement: number,
    rotation: number
}

export interface IMovement {
    nextMovePos: number,
    direction: IDirection
}


export type ObjectExistFun = (pos: number, object: string) => boolean;

export type RandomMovementFun = (position: number, direction: IDirection, objectExist: ObjectExistFun) => IMovement;

