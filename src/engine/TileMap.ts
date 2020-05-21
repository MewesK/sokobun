import Resource from './resource/Resource';
import Tile from './Tile';

export default class TileMap {
    tileTable: Array<Array<Tile>>

    constructor(resource: Resource, rows: number, columns: number) {
        const width = resource.resource.width / columns;
        const height = resource.resource.height / rows;

        // Calculate individual tiles
        this.tileTable = [];
        for (let row = 0; row < rows; row++) {
            this.tileTable[row] = [];
            for (let column = 0; column < columns; column++) {
                this.tileTable[row][column] = new Tile(
                    resource,
                    column * width,
                    row * height,
                    width,
                    height
                );
            }
        }
    }

    get = (row: number, column: number): Tile => {
        return this.tileTable[row][column];
    }
}