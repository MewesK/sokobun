import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import Resource from '../resource/Resource';
import Tile from './Tile';

export class RandomTile extends Tile {
    public readonly probability: number;

    constructor(resource: Resource, position: PixelPosition, size: PixelSize, probability: number) {
        super(resource, position, size);
        this.probability = probability;
    }
}
