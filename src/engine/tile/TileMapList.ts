import boxSprites from '../../images/bun.png';
import tilesMoon from '../../images/moon.png';
import destinationSprites from '../../images/pillow.png';
import playerSprites from '../../images/player_base.png';
import tilesShadow from '../../images/shadow.png';
import tilesFloor from '../../images/tiles_floor.png';
import tilesPanel from '../../images/tiles_panel.png';
import tilesPillar from '../../images/tiles_pillar.png';
import tilesVoidBorder from '../../images/tiles_void_border.png';
import tilesVoid from '../../images/tiles_void.png';
import tilesWaterBorder from '../../images/tiles_water_border.png';
import tilesWater from '../../images/tiles_water.png';
import { PatternTileDefinition, TileMapDefinition } from './TileMap';

const borderPatternTileDefinition: Array<PatternTileDefinition> = [
    { pattern: /.1.1..../, tileOffsetDefinitionList: [{ tileIndex: 0, offset: { x: 0, y: 0 } }] },
    { pattern: /.1.0..../, tileOffsetDefinitionList: [{ tileIndex: 1, offset: { x: 0, y: 0 } }] },
    { pattern: /.1..0.../, tileOffsetDefinitionList: [{ tileIndex: 2, offset: { x: 8, y: 0 } }] },
    { pattern: /.1..1.../, tileOffsetDefinitionList: [{ tileIndex: 3, offset: { x: 8, y: 0 } }] },
    { pattern: /.0.1..../, tileOffsetDefinitionList: [{ tileIndex: 4, offset: { x: 0, y: 0 } }] },
    { pattern: /....0.01/, tileOffsetDefinitionList: [{ tileIndex: 5, offset: { x: 8, y: 8 } }] },
    { pattern: /...0.10./, tileOffsetDefinitionList: [{ tileIndex: 6, offset: { x: 0, y: 8 } }] },
    { pattern: /.0..1.../, tileOffsetDefinitionList: [{ tileIndex: 7, offset: { x: 8, y: 0 } }] },
    { pattern: /...1..0./, tileOffsetDefinitionList: [{ tileIndex: 8, offset: { x: 0, y: 8 } }] },
    { pattern: /.01.0.../, tileOffsetDefinitionList: [{ tileIndex: 9, offset: { x: 8, y: 0 } }] },
    { pattern: /10.0..../, tileOffsetDefinitionList: [{ tileIndex: 10, offset: { x: 0, y: 0 } }] },
    { pattern: /....1.0./, tileOffsetDefinitionList: [{ tileIndex: 11, offset: { x: 8, y: 8 } }] },
    { pattern: /...1..1./, tileOffsetDefinitionList: [{ tileIndex: 12, offset: { x: 0, y: 8 } }] },
    { pattern: /...0..1./, tileOffsetDefinitionList: [{ tileIndex: 13, offset: { x: 0, y: 8 } }] },
    { pattern: /....0.1./, tileOffsetDefinitionList: [{ tileIndex: 14, offset: { x: 8, y: 8 } }] },
    { pattern: /....1.1./, tileOffsetDefinitionList: [{ tileIndex: 15, offset: { x: 8, y: 8 } }] }
];

export const tileMapList: Array<TileMapDefinition> = [
    // Sprite tiles
    {
        src: playerSprites,
        rows: 4,
        columns: 6,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 18,
        tileHeight: 24,
        grid: 1,
        weightedTileDefinitionList: undefined,
        patternTileDefinitionList: undefined
    },
    {
        src: boxSprites,
        rows: 1,
        columns: 1,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0,
        weightedTileDefinitionList: undefined,
        patternTileDefinitionList: undefined
    },
    {
        src: destinationSprites,
        rows: 1,
        columns: 1,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0,
        weightedTileDefinitionList: undefined,
        patternTileDefinitionList: undefined
    },
    // Level tiles
    {
        src: tilesPanel,
        rows: 3,
        columns: 3,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0,
        weightedTileDefinitionList: undefined,
        patternTileDefinitionList: undefined
    },
    {
        src: tilesFloor,
        rows: 2,
        columns: 2,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0,
        weightedTileDefinitionList: [
            { tileIndex: 0, probability: 2.0 },
            { tileIndex: 1, probability: 0.4 },
            { tileIndex: 2, probability: 0.1 },
            { tileIndex: 3, probability: 0.1 }
        ],
        patternTileDefinitionList: undefined
    },
    {
        src: tilesMoon,
        rows: 1,
        columns: 1,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 32,
        tileHeight: 32,
        grid: 0,
        weightedTileDefinitionList: undefined,
        patternTileDefinitionList: undefined
    },
    {
        src: tilesShadow,
        rows: 1,
        columns: 1,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0,
        weightedTileDefinitionList: undefined,
        patternTileDefinitionList: undefined
    },
    {
        src: tilesPillar,
        rows: 3,
        columns: 4,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0,
        weightedTileDefinitionList: undefined,
        patternTileDefinitionList: [
            {
                pattern: /...00.0./,
                tileOffsetDefinitionList: [
                    { tileIndex: 0, offset: { x: 0, y: 16 } },
                    { tileIndex: 4, offset: { x: 0, y: 32 } },
                    { tileIndex: 8, offset: { x: 0, y: 48 } }
                ]
            },
            {
                pattern: /...01.0./,
                tileOffsetDefinitionList: [
                    { tileIndex: 1, offset: { x: 0, y: 16 } },
                    { tileIndex: 5, offset: { x: 0, y: 32 } },
                    { tileIndex: 9, offset: { x: 0, y: 48 } }
                ]
            },
            {
                pattern: /...11.0./,
                tileOffsetDefinitionList: [
                    { tileIndex: 2, offset: { x: 0, y: 16 } },
                    { tileIndex: 6, offset: { x: 0, y: 32 } },
                    { tileIndex: 10, offset: { x: 0, y: 48 } }
                ]
            },
            {
                pattern: /...10.0./,
                tileOffsetDefinitionList: [
                    { tileIndex: 3, offset: { x: 0, y: 16 } },
                    { tileIndex: 7, offset: { x: 0, y: 32 } },
                    { tileIndex: 11, offset: { x: 0, y: 48 } }
                ]
            }
        ]
    },
    {
        src: tilesVoid,
        rows: 3,
        columns: 2,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0,
        weightedTileDefinitionList: [
            { tileIndex: 0, probability: 2.0 },
            { tileIndex: 1, probability: 0.1 },
            { tileIndex: 2, probability: 0.1 },
            { tileIndex: 3, probability: 0.1 },
            { tileIndex: 4, probability: 0.1 },
            { tileIndex: 5, probability: 0.1 }
        ],
        patternTileDefinitionList: undefined
    },
    {
        src: tilesVoidBorder,
        rows: 4,
        columns: 4,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 8,
        tileHeight: 8,
        grid: 0,
        weightedTileDefinitionList: undefined,
        patternTileDefinitionList: borderPatternTileDefinition
    },
    {
        src: tilesWater,
        rows: 2,
        columns: 2,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0,
        weightedTileDefinitionList: [
            { tileIndex: 0, probability: 2.0 },
            { tileIndex: 1, probability: 0.1 },
            { tileIndex: 2, probability: 0.1 },
            { tileIndex: 3, probability: 0.1 }
        ],
        patternTileDefinitionList: undefined
    },
    {
        src: tilesWaterBorder,
        rows: 4,
        columns: 4,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 8,
        tileHeight: 8,
        grid: 0,
        weightedTileDefinitionList: undefined,
        patternTileDefinitionList: borderPatternTileDefinition
    }
];
