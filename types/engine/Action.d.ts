import { Tile } from './Tile';
export declare class Action {
    directionList: Record<string, Array<Tile>>;
    duration: number;
    constructor(directionList: Record<string, Array<Tile>>, duration: number);
}
