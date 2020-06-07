import Tile from './Tile';
import TileMap from './TileMap';
import Resource from '../resource/Resource';

export default class PatternTileMap extends TileMap {
    /**
     * [pattern, [[tile index, [tile offset X, tile offset Y]]]]
     */
    public static BORDER_PATTERN_TILE_DEFINITION_LIST: Array<[RegExp, Array<[number, [number, number]]>]> = [
        [/.1.1..../, [[0, [0, 0]]]],
        [/.1.0..../, [[1, [0, 0]]]],
        [/.1..0.../, [[2, [8, 0]]]],
        [/.1..1.../, [[3, [8, 0]]]],
        [/.0.1..../, [[4, [0, 0]]]],
        [/.0..0.01/, [[5, [8, 8]]]],
        [/.0.0.10./, [[6, [0, 8]]]],
        [/.0..1.../, [[7, [8, 0]]]],
        [/...1..0./, [[8, [0, 8]]]],
        [/.01.0.0./, [[9, [8, 0]]]],
        [/10.0..0./, [[10, [0, 0]]]],
        [/....1.0./, [[11, [8, 8]]]],
        [/...1..1./, [[12, [0, 8]]]],
        [/...0..1./, [[13, [0, 8]]]],
        [/....0.1./, [[14, [8, 8]]]],
        [/....1.1./, [[15, [8, 8]]]]
    ];

    /**
     * [pattern, [[tile index, [tile offset X, tile offset Y]]]]
     */
    public static PILLAR_PATTERN_TILE_DEFINITION_LIST: Array<[RegExp, Array<[number, [number, number]]>]> = [
        [
            /...00.0./,
            [
                [0, [0, 16]],
                [4, [0, 32]],
                [8, [0, 48]]
            ]
        ],
        [
            /...01.0./,
            [
                [1, [0, 16]],
                [5, [0, 32]],
                [9, [0, 48]]
            ]
        ],
        [
            /...11.0./,
            [
                [2, [0, 16]],
                [6, [0, 32]],
                [10, [0, 48]]
            ]
        ],
        [
            /...10.0./,
            [
                [3, [0, 16]],
                [7, [0, 32]],
                [11, [0, 48]]
            ]
        ]
    ];

    private readonly patternTileDefinitionList: Array<[RegExp, Array<[number, [number, number]]>]> = [];

    public constructor(
        tileTable: Array<Array<Tile>>,
        resource: Resource,
        patternTileDefinitionList: Array<[RegExp, Array<[number, [number, number]]>]>
    ) {
        super(tileTable, resource);
        this.patternTileDefinitionList = patternTileDefinitionList;
    }

    /**
     * Returns a list of tiles and their offsets corresponding to the given pattern.
     * @param pattern
     */
    public getTileListByPattern = (pattern: string): Array<[Tile, [number, number]]> => {
        // Find pattern-tile-definitions matching the pattern
        const patternTileDefinitionList = this.patternTileDefinitionList.filter((value) => pattern.match(value[0]));
        if (patternTileDefinitionList.length === 0) {
            throw new Error(`Invalid pattern '${pattern}'`);
        }

        // Return tiles and tile offsets for the given pattern-tile-definitions
        const tileDefinitionList: Array<[Tile, [number, number]]> = [];
        patternTileDefinitionList.forEach((patternTileDefinition) => {
            tileDefinitionList.push(
                ...patternTileDefinition[1].map<[Tile, [number, number]]>((tileDefinition) => [
                    this.get(Math.floor(tileDefinition[0] / this.columns), tileDefinition[0] % this.columns),
                    tileDefinition[1]
                ])
            );
        });
        return tileDefinitionList;
    };
}
