import TilePosition from '../../core/TilePosition';

export default class TileDefinition {
    public readonly position: TilePosition;

    public constructor(position: TilePosition) {
        this.position = position;
    }
}
