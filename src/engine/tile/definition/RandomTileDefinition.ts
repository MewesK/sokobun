import TilePosition from '../../core/TilePosition';
import TileDefinition from './TileDefinition';

export class RandomTileDefinition extends TileDefinition {
    public readonly probability: number;

    constructor(position: TilePosition, probability: number) {
        super(position);
        this.probability = probability;
    }
}
