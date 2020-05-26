import Resource from '../resource/Resource';

export enum TileType {
    Undefined = -1,
    Wall,
    Floor,
    Void,
    Water,
    Sprite
}

export default class Tile {
    public readonly resource: Resource;
    public readonly x: number;
    public readonly y: number;
    public readonly width: number;
    public readonly height: number;
    public readonly type: TileType;

    public constructor(resource: Resource, x: number, y: number, width: number, height: number, type: TileType) {
        this.resource = resource;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }
}
