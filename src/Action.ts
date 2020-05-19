import {Tile} from './Tile';

export class Action {
    directionList: Record<string, Array<Tile>>;
    duration: number;

    constructor(directionList: Record<string, Array<Tile>>, duration: number) {
        if (Object.keys(directionList).length === 0) {
            throw new Error('There must be at least one action.');
        }

        this.directionList = directionList;
        this.duration = duration;
    }
}