import PixelOffset from '../core/PixelOffset';
import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import TileOffset from '../core/TileOffset';
import TilePosition from '../core/TilePosition';
import TileSize from '../core/TileSize';
import Resource from '../resource/Resource';
import { OffsetTile } from './OffsetTile';
import { PatternOffsetTileList } from './PatternOffsetTileList';
import { RandomTile } from './RandomTile';
import Tile from './Tile';

export default class TileMap {
    /**
     * Creates a tile table based on the given resource.
     * @param resource
     * @param size
     * @param offset
     * @param tileSize
     * @param grid
     */
    public static createTileTable(
        resource: Resource,
        size: TileSize,
        offset: TileOffset,
        tileSize: PixelSize,
        grid: number
    ): Array<Array<Tile>> {
        // Create individual tiles
        const tileTable: Array<Array<Tile>> = [];
        for (let row = 0; row < size.height; row++) {
            tileTable[row] = [];
            for (let column = 0; column < size.width; column++) {
                tileTable[row][column] = new Tile(
                    resource,
                    new PixelPosition(
                        (column + offset.x) * (tileSize.width + grid),
                        (row + offset.y) * (tileSize.height + grid)
                    ),
                    tileSize
                );
            }
        }
        return tileTable;
    }

    protected readonly tileTable: Array<Array<Tile>>;

    public readonly resource: Resource;
    public readonly size: TileSize;
    public readonly tileSize: TileSize;

    private readonly randomTileList: Array<RandomTile> | undefined;
    private readonly patternOffsetTileListList: Array<PatternOffsetTileList> | undefined;

    public constructor(
        tileTable: Array<Array<Tile>>,
        resource: Resource,
        randomTileList: Array<RandomTile> | undefined,
        patternOffsetTileListList: Array<PatternOffsetTileList> | undefined
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
        this.size = new TileSize(tileTable[0].length, tileTable.length);
        this.tileSize = tileTable[0][0].size;

        this.randomTileList = randomTileList;
        this.patternOffsetTileListList = patternOffsetTileListList;
    }

    /**
     * Get the tile at the given coordinates.
     * @param position
     */
    public get = (position: TilePosition): Tile => {
        if (position.x < 0 || position.x >= this.size.width) {
            throw new Error('Invalid column');
        }
        if (position.y < 0 || position.y >= this.size.height) {
            throw new Error('Invalid row');
        }

        return this.tileTable[position.y][position.x];
    };

    /**
     * Get the tile at the given coordinates.
     * @param position
     * @param offset
     */
    public getWithOffset = (position: TilePosition, offset: PixelOffset): OffsetTile => {
        const tile = this.get(position);
        return new OffsetTile(tile.resource, tile.position, tile.size, offset);
    };

    /**
     * Get the tile at the given coordinates.
     * @param position
     * @param probability
     */
    public getWithProbability = (position: TilePosition, probability: number): RandomTile => {
        const tile = this.get(position);
        return new RandomTile(tile.resource, tile.position, tile.size, probability);
    };

    /**
     * Returns a list of tiles and their offsets corresponding to the given pattern.
     * @param pattern
     */
    public getOffsetTileListByPattern = (pattern: string): Array<OffsetTile> => {
        if (!this.patternOffsetTileListList) {
            throw new Error('Undefined patternOffsetTileSetDefinitionList');
        }

        // Find pattern-tile-definitions matching the pattern
        const patternOffsetTileListList = this.patternOffsetTileListList.filter((value) =>
            pattern.match(value.pattern)
        );
        if (patternOffsetTileListList.length === 0) {
            throw new Error(`Invalid pattern '${pattern}'`);
        }

        // Return tiles and tile offsets for the given pattern-tile-definitions
        const offsetTileList: Array<OffsetTile> = [];
        patternOffsetTileListList.forEach((patternOffsetTileList) => {
            patternOffsetTileList.offsetTileList.forEach((offsetTile) => {
                offsetTileList.push(offsetTile);
            });
        });
        return offsetTileList;
    };

    /**
     * Return a random tile based according to the defined probabilities.
     */
    public getRandomTile = (): Tile => {
        if (!this.randomTileList) {
            throw new Error('Undefined randomTileDefinitionList');
        }

        let sum = 0;
        let weightedTileDefinition = this.randomTileList[0];

        // Get random number from 0 to the sum of probabilities
        const random =
            Math.random() *
            this.randomTileList.reduce(
                (previousValue, currentValue) => previousValue + currentValue.probability,
                this.randomTileList[0].probability
            );

        // Get tile index
        for (let weightedTileIndex = 0; weightedTileIndex < this.randomTileList.length; weightedTileIndex++) {
            sum += this.randomTileList[weightedTileIndex].probability;
            if (random <= sum) {
                weightedTileDefinition = this.randomTileList[weightedTileIndex];
                break;
            }
        }

        // Return tile
        return weightedTileDefinition;
    };
}
