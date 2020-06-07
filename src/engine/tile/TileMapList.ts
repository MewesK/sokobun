import boxSprites from '../../images/bun.png';
import tilesMoon from '../../images/moon.png';
import destinationSprites from '../../images/pillow.png';
import playerSprites from '../../images/player_base.png';
import tilesShadow from '../../images/shadow.png';
import tilesFloor from '../../images/tiles_floor.png';
import tilesPillar from '../../images/tiles_pillar.png';
import tilesVoidBorder from '../../images/tiles_void_border.png';
import tilesVoid from '../../images/tiles_void.png';
import tilesWaterBorder from '../../images/tiles_water_border.png';
import tilesWater from '../../images/tiles_water.png';
import PatternTileMap, { PatternTileMapDefinition } from './PatternTileMap';
import RandomTileMap, { RandomTileMapDefinition } from './RandomTileMap';
import { TileMapDefinition } from './TileMap';

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
        grid: 1
    },
    {
        src: boxSprites,
        rows: 1,
        columns: 1,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0
    },
    {
        src: destinationSprites,
        rows: 1,
        columns: 1,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0
    },
    // Level tiles
    <RandomTileMapDefinition>{
        src: tilesFloor,
        rows: 2,
        columns: 2,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0,
        weightedTileDefinitionList: RandomTileMap.FLOOR_WEIGHTED_TILE_LIST
    },
    {
        src: tilesMoon,
        rows: 1,
        columns: 1,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 32,
        tileHeight: 32,
        grid: 0
    },
    {
        src: tilesShadow,
        rows: 1,
        columns: 1,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0
    },
    <PatternTileMapDefinition>{
        src: tilesPillar,
        rows: 3,
        columns: 4,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0,
        patternTileDefinitionList: PatternTileMap.PILLAR_PATTERN_TILE_DEFINITION_LIST
    },
    <RandomTileMapDefinition>{
        src: tilesVoid,
        rows: 3,
        columns: 2,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0,
        weightedTileDefinitionList: RandomTileMap.VOID_WEIGHTED_TILE_LIST
    },
    <PatternTileMapDefinition>{
        src: tilesVoidBorder,
        rows: 4,
        columns: 4,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 8,
        tileHeight: 8,
        grid: 0,
        patternTileDefinitionList: PatternTileMap.BORDER_PATTERN_TILE_DEFINITION_LIST
    },
    <RandomTileMapDefinition>{
        src: tilesWater,
        rows: 2,
        columns: 2,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 16,
        tileHeight: 16,
        grid: 0,
        weightedTileDefinitionList: RandomTileMap.WATER_WEIGHTED_TILE_LIST
    },
    <PatternTileMapDefinition>{
        src: tilesWaterBorder,
        rows: 4,
        columns: 4,
        offsetRows: 0,
        offsetColumns: 0,
        tileWidth: 8,
        tileHeight: 8,
        grid: 0,
        patternTileDefinitionList: PatternTileMap.BORDER_PATTERN_TILE_DEFINITION_LIST
    }
];
