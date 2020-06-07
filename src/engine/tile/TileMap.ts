import Resource from '../resource/Resource';
import Tile from './Tile';

export interface Offset {
    x: number;
    y: number;
}

export interface TileOffsetDefinition {
    tile: Tile;
    offset: Offset;
}

export interface TileIndexOffsetDefinition {
    tileIndex: number;
    offset: Offset;
}

export interface WeightedTileDefinition {
    tileIndex: number;
    probability: number;
}

export interface PatternTileDefinition {
    pattern: RegExp;
    tileOffsetDefinitionList: Array<TileIndexOffsetDefinition>;
}

export interface TileMapDefinition {
    src: string;
    rows: number;
    columns: number;
    offsetRows: number;
    offsetColumns: number;
    tileWidth: number;
    tileHeight: number;
    grid: number;
    weightedTileDefinitionList: Array<WeightedTileDefinition> | undefined;
    patternTileDefinitionList: Array<PatternTileDefinition> | undefined;
}

export default class TileMap {
    /**
     * Creates a tile table based on the given resource.
     * @param resource
     * @param rows
     * @param columns
     * @param offsetRows
     * @param offsetColumns
     * @param tileWidth
     * @param tileHeight
     * @param grid
     */
    public static createTileTable(
        resource: Resource,
        rows: number,
        columns: number,
        offsetRows: number,
        offsetColumns: number,
        tileWidth: number,
        tileHeight: number,
        grid: number
    ): Array<Array<Tile>> {
        // Create individual tiles
        const tileTable: Array<Array<Tile>> = [];
        for (let row = 0; row < rows; row++) {
            tileTable[row] = [];
            for (let column = 0; column < columns; column++) {
                tileTable[row][column] = new Tile(
                    resource,
                    (column + offsetColumns) * (tileWidth + grid),
                    (row + offsetRows) * (tileHeight + grid),
                    tileWidth,
                    tileHeight
                );
            }
        }
        return tileTable;
    }

    protected readonly tileTable: Array<Array<Tile>>;

    public readonly resource: Resource;
    public readonly rows: number;
    public readonly columns: number;
    public readonly tileWidth: number;
    public readonly tileHeight: number;

    private readonly patternTileDefinitionList: Array<PatternTileDefinition> | undefined;
    private readonly weightedTileDefinitionList: Array<WeightedTileDefinition> | undefined;

    public constructor(
        tileTable: Array<Array<Tile>>,
        resource: Resource,
        patternTileDefinitionList: Array<PatternTileDefinition> | undefined,
        weightedTileDefinitionList: Array<WeightedTileDefinition> | undefined
    ) {
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

        this.resource = resource;
        this.rows = tileTable.length;
        this.columns = tileTable[0].length;
        this.tileWidth = tileTable[0][0].width;
        this.tileHeight = tileTable[0][0].height;

        this.patternTileDefinitionList = patternTileDefinitionList;
        this.weightedTileDefinitionList = weightedTileDefinitionList;
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
    };

    /**
     * Returns a list of tiles and their offsets corresponding to the given pattern.
     * @param pattern
     */
    public getTileListByPattern = (pattern: string): Array<TileOffsetDefinition> => {
        if (!this.patternTileDefinitionList) {
            throw new Error('Undefined patternTileDefinitionList');
        }

        // Find pattern-tile-definitions matching the pattern
        const patternTileDefinitionList = this.patternTileDefinitionList.filter((value) =>
            pattern.match(value.pattern)
        );
        if (patternTileDefinitionList.length === 0) {
            throw new Error(`Invalid pattern '${pattern}'`);
        }

        // Return tiles and tile offsets for the given pattern-tile-definitions
        const tileDefinitionList: Array<TileOffsetDefinition> = [];
        patternTileDefinitionList.forEach((patternTileDefinition) => {
            patternTileDefinition.tileOffsetDefinitionList.forEach((tileDefinition) => {
                tileDefinitionList.push({
                    tile: this.get(
                        Math.floor(tileDefinition.tileIndex / this.columns),
                        tileDefinition.tileIndex % this.columns
                    ),
                    offset: tileDefinition.offset
                });
            });
        });
        return tileDefinitionList;
    };

    /**
     * Return a random tile based according to the defined probabilities.
     */
    public getRandomTile = (): Tile => {
        if (!this.weightedTileDefinitionList) {
            throw new Error('Undefined weightedTileDefinitionList');
        }

        let sum = 0;
        let tileIndex = this.weightedTileDefinitionList[0].tileIndex;

        // Get random number from 0 to the sum of probabilities
        const random =
            Math.random() *
            this.weightedTileDefinitionList.reduce(
                (previousValue, currentValue) => previousValue + currentValue.probability,
                this.weightedTileDefinitionList[0].probability
            );

        // Get tile index
        for (
            let weightedTileIndex = 0;
            weightedTileIndex < this.weightedTileDefinitionList.length;
            weightedTileIndex++
        ) {
            sum += this.weightedTileDefinitionList[weightedTileIndex].probability;
            if (random <= sum) {
                tileIndex = this.weightedTileDefinitionList[weightedTileIndex].tileIndex;
                break;
            }
        }

        // Return tile
        return this.get(Math.floor(tileIndex / this.columns), tileIndex % this.columns);
    };
}
