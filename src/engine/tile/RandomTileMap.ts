import Resource from '../resource/Resource';
import Tile from './Tile';
import TileMap, { TileMapDefinition } from './TileMap';

export interface RandomTileMapDefinition extends TileMapDefinition {
    weightedTileDefinitionList: Array<[number, number]>;
}

export default class RandomTileMap extends TileMap {
    /**
     * [tile index, [tile offset X, tile offset Y]]
     */
    public static FLOOR_WEIGHTED_TILE_LIST: Array<[number, number]> = [
        [0, 2.0],
        [1, 0.4],
        [2, 0.1],
        [3, 0.1]
    ];

    /**
     * [tile index, [tile offset X, tile offset Y]]
     */
    public static WATER_WEIGHTED_TILE_LIST: Array<[number, number]> = [
        [0, 2.0],
        [1, 0.1],
        [2, 0.1],
        [3, 0.1]
    ];

    /**
     * [tile index, [tile offset X, tile offset Y]]
     */
    public static VOID_WEIGHTED_TILE_LIST: Array<[number, number]> = [
        [0, 2.0],
        [1, 0.1],
        [2, 0.1],
        [3, 0.1],
        [4, 0.1],
        [5, 0.1]
    ];

    private readonly weightedTileDefinitionList: Array<[number, number]> = [];

    public constructor(
        tileTable: Array<Array<Tile>>,
        resource: Resource,
        weightedTileDefinitionList: Array<[number, number]>
    ) {
        super(tileTable, resource);

        this.weightedTileDefinitionList = weightedTileDefinitionList;
    }

    /**
     * Return a random tile based according to the defined probabilities.
     */
    public getRandomTile = (): Tile => {
        let sum = 0;
        let tileIndex = this.weightedTileDefinitionList[0][0];

        // Get random number from 0 to the sum of probabilities
        const random =
            Math.random() *
            this.weightedTileDefinitionList.reduce(
                (previousValue, currentValue) => previousValue + currentValue[1],
                this.weightedTileDefinitionList[0][1]
            );

        // Get tile index
        for (
            let weightedTileIndex = 0;
            weightedTileIndex < this.weightedTileDefinitionList.length;
            weightedTileIndex++
        ) {
            sum += this.weightedTileDefinitionList[weightedTileIndex][1];
            if (random <= sum) {
                tileIndex = this.weightedTileDefinitionList[weightedTileIndex][0];
                break;
            }
        }

        // Return tile
        return this.get(Math.floor(tileIndex / this.columns), tileIndex % this.columns);
    };
}
