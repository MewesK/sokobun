import PixelOffset from '../core/PixelOffset';
import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import Resource from '../resource/Resource';
import Tile from './Tile';

export class OffsetTile extends Tile {
    public offset: PixelOffset = new PixelOffset(0, 0);

    constructor(resource: Resource, position: PixelPosition, size: PixelSize, offset: PixelOffset) {
        super(resource, position, size);
        this.offset = offset;
    }
}
