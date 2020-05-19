import { Resource } from './Resource';
import { Tile } from './Tile';
export declare class TileMap {
    tileTable: Array<Array<Tile>>;
    constructor(resource: Resource, rows: number, columns: number);
    get: (row: number, column: number) => Tile;
}
