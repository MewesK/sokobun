import Resource from '../resource/Resource';
import Tile, {TileType} from './Tile';

export default class TileMap {

    /**
     * Creates a tile table based on the given resource.
     * @param input
     * @param rows
     * @param columns
     * @param offsetRows
     * @param offsetColumns
     * @param tileWidth
     * @param tileHeight
     * @param tileType
     */
    public static createTileTable(
        input: Resource,
        rows: number,
        columns: number,
        offsetRows: number,
        offsetColumns: number,
        tileWidth: number,
        tileHeight: number,
        tileType: TileType
    ) {
        // Create individual tiles
        const tileTable: Array<Array<Tile>> = [];
        for (let row = 0; row < rows; row++) {
            tileTable[row] = [];
            for (let column = 0; column < columns; column++) {
                tileTable[row][column] = new Tile(
                    input,
                    (column + offsetColumns) * tileWidth,
                    (row + offsetRows) * tileHeight,
                    tileWidth,
                    tileHeight,
                    tileType
                );
            }
        }
        return tileTable;
    }

    protected readonly tileTable: Array<Array<Tile>>;

    public readonly rows: number;
    public readonly columns: number;
    public readonly tileWidth: number;
    public readonly tileHeight: number;

    public constructor(tileTable: Array<Array<Tile>>) {
        if (tileTable.length === 0) {
            throw new Error('Invalid tile table (no rows)');
        }
        if (tileTable[0].length === 0) {
            throw new Error('Invalid tile table (no columns)');
        }
        if (tileTable[0][0] === undefined) {
            throw new Error('Invalid tile table (no cells)');
        }
        this.tileTable = tileTable;
        this.rows = tileTable.length;
        this.columns = tileTable[0].length;
        this.tileWidth = tileTable[0][0].width;
        this.tileHeight = tileTable[0][0].height;
    }

    /**
     * Get the tile at the given coordinates.
     * @param row
     * @param column
     */
    public get = (row: number, column: number): Tile => {
        if (row < 0 || row >= this.rows) {
            throw new Error('Invalid row');
        }
        if (column < 0 || column >= this.columns) {
            throw new Error('Invalid column');
        }

        return this.tileTable[row][column];
    }
}
