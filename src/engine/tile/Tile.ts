import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import Resource from '../resource/Resource';

export enum TileType {
    Undefined = -1,
    Wall,
    Floor,
    Void,
    Water
}

export default class Tile {
    public readonly resource: Resource;
    public readonly position: PixelPosition;
    public readonly size: PixelSize;

    public constructor(resource: Resource, position: PixelPosition, size: PixelSize) {
        this.resource = resource;
        this.position = position;
        this.size = size;
    }

    /**
     * Draws the sprite with the given context.
     * @param position
     * @param context
     */
    public draw = (position: PixelPosition, context: CanvasRenderingContext2D): void => {
        this.drawStretched(position, this.size, context);
    };

    /**
     * Draws the sprite with the given context.
     * @param position
     * @param size
     * @param context
     */
    public drawStretched = (position: PixelPosition, size: PixelSize, context: CanvasRenderingContext2D): void => {
        context.imageSmoothingEnabled = false;
        context.drawImage(
            <CanvasImageSource>this.resource.data,
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height,
            position.x,
            position.y,
            size.width,
            size.height
        );
    };
}
