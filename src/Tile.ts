import {Resource} from "./Resource";

export class Tile {
    resource: Resource;
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(resource: Resource, x: number, y: number, width: number, height: number) {
        this.resource = resource;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}