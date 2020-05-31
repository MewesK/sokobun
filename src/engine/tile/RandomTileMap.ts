import Tile from './Tile';
import TileMap from './TileMap';

export default class RandomTileMap extends TileMap {
    public static FLOOR_WEIGHTED_TILE_LIST: Array<[number, number]> = [
        [0, 2.0],
        [1, 0.4],
        [2, 0.1],
        [3, 0.1]
    ];
    public static WATER_WEIGHTED_TILE_LIST: Array<[number, number]> = [
        [0, 2.0],
        [1, 0.1],
        [2, 0.1],
        [3, 0.1]
    ];
    public static VOID_WEIGHTED_TILE_LIST: Array<[number, number]> = [
        [0, 2.0],
        [1, 0.1],
        [2, 0.1],
        [3, 0.1],
        [4, 0.1],
        [5, 0.1]
    ];

    private readonly weightedTileList: Array<[number, number]> = [];

    public constructor(tileTable: Array<Array<Tile>>, weightedTileList: Array<[number, number]>) {
        super(tileTable);

        this.weightedTileList = weightedTileList;
    }

    /**
     * Return a random tile based according to the defined probabilities.
     */
    public getRandomTile = (): Tile => {
        let sum = 0;
        let tileIndex = this.weightedTileList[0][0];
        let random =
            Math.random() *
            this.weightedTileList.reduce(
                (previousValue, currentValue) => previousValue + currentValue[1],
                this.weightedTileList[0][1]
            );

        for (let i in this.weightedTileList) {
            sum += this.weightedTileList[i][1];
            if (random <= sum) {
                tileIndex = this.weightedTileList[i][0];
                break;
            }
        }

        return this.get(Math.floor(tileIndex / this.columns), tileIndex % this.columns);
    };
}
