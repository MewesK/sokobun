import PixelOffset from '../../core/PixelOffset';
import TilePosition from '../../core/TilePosition';
import TileDefinition from './TileDefinition';

export class OffsetTileDefinition extends TileDefinition {
    public readonly offset: PixelOffset;

    constructor(position: TilePosition, offset: PixelOffset) {
        super(position);
        this.offset = offset;
    }
}
