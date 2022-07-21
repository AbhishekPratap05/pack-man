export type ObjectExistFun = (pos: number, object: string) => boolean;

export type RandomMovementFun = (position: number, direction: any, objectExist: any) => any;

export interface IDirection {
    code: number,
    movement: number,
    rotation: number
}