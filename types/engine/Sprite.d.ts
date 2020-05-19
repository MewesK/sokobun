import { Tile } from './Tile';
import { Action } from './Action';
export declare class Sprite {
    actionList: Record<string, Action>;
    x: number;
    y: number;
    action: string;
    direction: string;
    timer: number;
    constructor(actionList: Record<string, Action>);
    setAction: (name: string) => void;
    setDirection: (name: string) => void;
    update: (dt: number) => void;
    getTile: () => Tile;
}
