import Tile from '../tile/Tile';

export default class Frame {
    public readonly tile: Tile;
    public readonly duration: number;

    constructor(tile: Tile, duration: number) {
        this.tile = tile;
        this.duration = duration;
    }
}
