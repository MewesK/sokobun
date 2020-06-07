import TileMap from './TileMap';
import RandomTileMap from './RandomTileMap';
import PatternTileMap from './PatternTileMap';

import playerSprites from '../../images/player_base.png';
import boxSprites from '../../images/bun.png';
import destinationSprites from '../../images/pillow.png';
import tilesFloor from '../../images/tiles_floor.png';
import tilesMoon from '../../images/moon.png';
import tilesPillar from '../../images/tiles_pillar.png';
import tilesShadow from '../../images/shadow.png';
import tilesVoid from '../../images/tiles_void.png';
import tilesVoidBorder from '../../images/tiles_void_border.png';
import tilesWater from '../../images/tiles_water.png';
import tilesWaterBorder from '../../images/tiles_water_border.png';

export const tileMapList: Array<[
    new (...args: any[]) => TileMap,
    string,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    any
]> = [
    // Sprite tiles
    [TileMap, playerSprites, 4, 6, 0, 0, 18, 24, 1, undefined],
    [TileMap, boxSprites, 1, 1, 0, 0, 16, 16, 0, undefined],
    [TileMap, destinationSprites, 1, 1, 0, 0, 16, 16, 0, undefined],
    // Level tiles
    [RandomTileMap, tilesFloor, 2, 2, 0, 0, 16, 16, 0, RandomTileMap.FLOOR_WEIGHTED_TILE_LIST],
    [TileMap, tilesMoon, 1, 1, 0, 0, 32, 32, 0, undefined],
    [TileMap, tilesShadow, 1, 1, 0, 0, 16, 16, 0, undefined],
    [PatternTileMap, tilesPillar, 3, 4, 0, 0, 16, 16, 0, PatternTileMap.PILLAR_PATTERN_TILE_DEFINITION_LIST],
    [RandomTileMap, tilesVoid, 3, 2, 0, 0, 16, 16, 0, RandomTileMap.VOID_WEIGHTED_TILE_LIST],
    [PatternTileMap, tilesVoidBorder, 4, 4, 0, 0, 8, 8, 0, PatternTileMap.BORDER_PATTERN_TILE_DEFINITION_LIST],
    [RandomTileMap, tilesWater, 2, 2, 0, 0, 16, 16, 0, RandomTileMap.WATER_WEIGHTED_TILE_LIST],
    [PatternTileMap, tilesWaterBorder, 4, 4, 0, 0, 8, 8, 0, PatternTileMap.BORDER_PATTERN_TILE_DEFINITION_LIST]
];
