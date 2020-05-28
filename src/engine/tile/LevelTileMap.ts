import Tile from './Tile';
import TileMap from './TileMap';

export default class LevelTileMap extends TileMap {
    public static FLOOR_PATTERN_TILE_LIST: Array<[RegExp, Array<number>]> = [
        [/00000000/, [0]],
        [/00000001/, [1]],
        [/00000100/, [2]],
        [/00100000/, [3]],
        [/10000000/, [4]],
        [/00000101/, [5]],
        [/10000001/, [6]],
        [/00100001/, [7]],
        [/10000100/, [8]],
        [/00100100/, [9]],
        [/10100000/, [10]],
        [/00100101/, [11]],
        [/10000101/, [12]],
        [/10100100/, [13]],
        [/10100001/, [14]],
        [/10100101/, [15]],
        [/00.0100./, [16]],
        [/00000.1./, [17]],
        [/.0010.00/, [18]],
        [/.1.00000/, [19]],
        [/00.0110./, [20]],
        [/10.0100./, [21]],
        [/10.0110./, [22]],
        [/10000.1./, [23]],
        [/00100.1./, [24]],
        [/10100.1./, [25]],
        [/.0010.01/, [26]],
        [/.0110.00/, [27]],
        [/.0110.01/, [28]],
        [/.1.00100/, [29]],
        [/.1.00001/, [30]],
        [/.1.00101/, [31]],
        [/.0.11.0./, [32]],
        [/.1.00.1./, [33]],
        [/00.01.1./, [34]],
        [/.0.10.1./, [35]],
        [/.1.10.00/, [36]],
        [/.1.0100./, [37]],
        [/10.01.1./, [38]],
        [/.0110.1./, [39]],
        [/.1.10.01/, [40]],
        [/.1.0110./, [41]],
        [/.1.01.1./, [42]],
        [/.0.11.1./, [43]],
        [/.1.10.1./, [44]],
        [/.1.11.0./, [45]],
        [/.1.11.1./, [46]]
    ];

    public static PILLAR_PATTERN_TILE_LIST: Array<[RegExp, Array<number>]> = [
        [/...11.1./, [0, 8, 16]],
        [/...10.1./, [1, 9, 17]],
        [/...00.1./, [2, 10, 18]],
        [/...00.1./, [3, 11, 19]],
        [/...01.1./, [4, 12, 20]]
    ];

    public static VOID_WEIGHTED_TILE_LIST: Array<[number, number]> = [
        [5, 2.0],
        [6, 0.1],
        [7, 0.1],
        [13, 0.1],
        [14, 0.1],
        [15, 0.1]
    ];

    private readonly weightedTileList: Array<[number, number]> = [];
    private readonly patternTileList: Array<[RegExp, Array<number>]> = [];

    public constructor(
        tileTable: Array<Array<Tile>>,
        weightedTileList: Array<[number, number]>,
        patternTileList: Array<[RegExp, Array<number>]>
    ) {
        super(tileTable);

        this.weightedTileList = weightedTileList;
        this.patternTileList = patternTileList;
    }

    /**
     * Return a random tile based according to the defined probabilities.
     */
    public getWeightedRandomTile = (): Tile => {
        let sum = 0;
        let random = Math.random() * this.weightedTileList.reduce((previousValue, currentValue) => previousValue + currentValue[1], this.weightedTileList[0][1]);
        let tileIndex = this.weightedTileList[0][0];
        for (let i in this.weightedTileList) {
            sum += this.weightedTileList[i][1];
            if (random <= sum) {
                tileIndex = this.weightedTileList[i][0];
                break;
            }
        }
        return this.get(Math.floor(tileIndex / this.columns), tileIndex % this.columns);
    };

    /**
     * Returns the tile list corresponding to the given pattern.
     * @param pattern
     */
    public getTileListByPattern = (pattern: string): Array<Tile> => {
        const patternTile = this.patternTileList.find((value) => pattern.match(value[0]));
        if (patternTile === undefined) {
            throw new Error(`Invalid pattern '${pattern}'`);
        }

        return patternTile[1].map((value) => this.get(Math.floor(value / this.columns), value % this.columns));
    };
}