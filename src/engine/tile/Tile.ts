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
    public readonly x: number;
    public readonly y: number;
    public readonly width: number;
    public readonly height: number;

    public constructor(resource: Resource, x: number, y: number, width: number, height: number) {
        this.resource = resource;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Draws the sprite with the given context.
     * @param x
     * @param y
     * @param context
     */
    public draw = (x: number, y: number, context: CanvasRenderingContext2D): void => {
        context.imageSmoothingEnabled = false;
        context.drawImage(<CanvasImageSource>this.resource.data, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
    };
}
