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
import PixelOffset from '../core/PixelOffset';
import PixelSize from '../core/PixelSize';
import TileOffset from '../core/TileOffset';
import TilePosition from '../core/TilePosition';
import TileSize from '../core/TileSize';
import { OffsetTileDefinition } from './definition/OffsetTileDefinition';
import { PatternOffsetTileListDefinition } from './definition/PatternOffsetTileListDefinition';
import { RandomTileDefinition } from './definition/RandomTileDefinition';
import { TileMapDefinition } from './definition/TileMapDefinition';

const borderPatternDefinitionList = [
    new PatternOffsetTileListDefinition(/.1.1..../, [
        new OffsetTileDefinition(new TilePosition(0, 0), new PixelOffset(0, 0))
    ]),
    new PatternOffsetTileListDefinition(/.1.0..../, [
        new OffsetTileDefinition(new TilePosition(1, 0), new PixelOffset(0, 0))
    ]),
    new PatternOffsetTileListDefinition(/.1..0.../, [
        new OffsetTileDefinition(new TilePosition(2, 0), new PixelOffset(8, 0))
    ]),
    new PatternOffsetTileListDefinition(/.1..1.../, [
        new OffsetTileDefinition(new TilePosition(3, 0), new PixelOffset(8, 0))
    ]),
    new PatternOffsetTileListDefinition(/.0.1..../, [
        new OffsetTileDefinition(new TilePosition(0, 1), new PixelOffset(0, 0))
    ]),
    new PatternOffsetTileListDefinition(/....0.01/, [
        new OffsetTileDefinition(new TilePosition(1, 1), new PixelOffset(8, 8))
    ]),
    new PatternOffsetTileListDefinition(/...0.10./, [
        new OffsetTileDefinition(new TilePosition(2, 1), new PixelOffset(0, 8))
    ]),
    new PatternOffsetTileListDefinition(/.0..1.../, [
        new OffsetTileDefinition(new TilePosition(3, 1), new PixelOffset(8, 0))
    ]),
    new PatternOffsetTileListDefinition(/...1..0./, [
        new OffsetTileDefinition(new TilePosition(0, 2), new PixelOffset(0, 8))
    ]),
    new PatternOffsetTileListDefinition(/.01.0.../, [
        new OffsetTileDefinition(new TilePosition(1, 2), new PixelOffset(8, 0))
    ]),
    new PatternOffsetTileListDefinition(/10.0..../, [
        new OffsetTileDefinition(new TilePosition(2, 2), new PixelOffset(0, 0))
    ]),
    new PatternOffsetTileListDefinition(/....1.0./, [
        new OffsetTileDefinition(new TilePosition(3, 2), new PixelOffset(8, 8))
    ]),
    new PatternOffsetTileListDefinition(/...1..1./, [
        new OffsetTileDefinition(new TilePosition(0, 3), new PixelOffset(0, 8))
    ]),
    new PatternOffsetTileListDefinition(/...0..1./, [
        new OffsetTileDefinition(new TilePosition(1, 3), new PixelOffset(0, 8))
    ]),
    new PatternOffsetTileListDefinition(/....0.1./, [
        new OffsetTileDefinition(new TilePosition(2, 3), new PixelOffset(8, 8))
    ]),
    new PatternOffsetTileListDefinition(/....1.1./, [
        new OffsetTileDefinition(new TilePosition(3, 3), new PixelOffset(8, 8))
    ])
];

const list: Array<TileMapDefinition> = [
    // Sprite tiles
    new TileMapDefinition(
        playerSprites,
        new TileSize(6, 4),
        new TileOffset(0, 0),
        new PixelSize(18, 24),
        1,
        undefined,
        undefined
    ),
    new TileMapDefinition(
        boxSprites,
        new TileSize(1, 1),
        new TileOffset(0, 0),
        new PixelSize(16, 16),
        0,
        undefined,
        undefined
    ),
    new TileMapDefinition(
        destinationSprites,
        new TileSize(1, 1),
        new TileOffset(0, 0),
        new PixelSize(16, 16),
        0,
        undefined,
        undefined
    ),
    // Level tiles
    new TileMapDefinition(
        tilesPanel,
        new TileSize(3, 3),
        new TileOffset(0, 0),
        new PixelSize(16, 16),
        0,
        undefined,
        undefined
    ),
    new TileMapDefinition(
        tilesFloor,
        new TileSize(2, 2),
        new TileOffset(0, 0),
        new PixelSize(16, 16),
        0,
        [
            new RandomTileDefinition(new TilePosition(0, 0), 2.0),
            new RandomTileDefinition(new TilePosition(1, 0), 0.4),
            new RandomTileDefinition(new TilePosition(0, 1), 0.1),
            new RandomTileDefinition(new TilePosition(1, 1), 0.1)
        ],
        undefined
    ),
    new TileMapDefinition(
        tilesMoon,
        new TileSize(1, 1),
        new TileOffset(0, 0),
        new PixelSize(32, 32),
        0,
        undefined,
        undefined
    ),
    new TileMapDefinition(
        tilesShadow,
        new TileSize(1, 1),
        new TileOffset(0, 0),
        new PixelSize(16, 16),
        0,
        undefined,
        undefined
    ),
    new TileMapDefinition(tilesPillar, new TileSize(3, 4), new TileOffset(0, 0), new PixelSize(16, 16), 0, undefined, [
        new PatternOffsetTileListDefinition(/...00.0./, [
            new OffsetTileDefinition(new TilePosition(0, 0), new PixelOffset(0, 16)),
            new OffsetTileDefinition(new TilePosition(0, 1), new PixelOffset(0, 32)),
            new OffsetTileDefinition(new TilePosition(0, 2), new PixelOffset(0, 48))
        ]),
        new PatternOffsetTileListDefinition(/...01.0./, [
            new OffsetTileDefinition(new TilePosition(1, 0), new PixelOffset(0, 16)),
            new OffsetTileDefinition(new TilePosition(1, 1), new PixelOffset(0, 32)),
            new OffsetTileDefinition(new TilePosition(1, 2), new PixelOffset(0, 48))
        ]),
        new PatternOffsetTileListDefinition(/...11.0./, [
            new OffsetTileDefinition(new TilePosition(2, 0), new PixelOffset(0, 16)),
            new OffsetTileDefinition(new TilePosition(2, 1), new PixelOffset(0, 32)),
            new OffsetTileDefinition(new TilePosition(2, 2), new PixelOffset(0, 48))
        ]),
        new PatternOffsetTileListDefinition(/...10.0./, [
            new OffsetTileDefinition(new TilePosition(3, 0), new PixelOffset(0, 16)),
            new OffsetTileDefinition(new TilePosition(3, 1), new PixelOffset(0, 32)),
            new OffsetTileDefinition(new TilePosition(3, 2), new PixelOffset(0, 48))
        ])
    ]),
    new TileMapDefinition(
        tilesVoid,
        new TileSize(2, 3),
        new TileOffset(0, 0),
        new PixelSize(16, 16),
        0,
        [
            new RandomTileDefinition(new TilePosition(0, 0), 2.0),
            new RandomTileDefinition(new TilePosition(1, 0), 0.1),
            new RandomTileDefinition(new TilePosition(0, 1), 0.1),
            new RandomTileDefinition(new TilePosition(1, 1), 0.1),
            new RandomTileDefinition(new TilePosition(0, 2), 0.1),
            new RandomTileDefinition(new TilePosition(1, 2), 0.1)
        ],
        undefined
    ),
    new TileMapDefinition(
        tilesVoidBorder,
        new TileSize(4, 4),
        new TileOffset(0, 0),
        new PixelSize(8, 8),
        0,
        undefined,
        borderPatternDefinitionList
    ),
    new TileMapDefinition(
        tilesWater,
        new TileSize(2, 2),
        new TileOffset(0, 0),
        new PixelSize(16, 16),
        0,
        [
            new RandomTileDefinition(new TilePosition(0, 0), 2.0),
            new RandomTileDefinition(new TilePosition(1, 0), 0.1),
            new RandomTileDefinition(new TilePosition(0, 1), 0.1),
            new RandomTileDefinition(new TilePosition(1, 1), 0.1)
        ],
        undefined
    ),
    new TileMapDefinition(
        tilesWaterBorder,
        new TileSize(4, 4),
        new TileOffset(0, 0),
        new PixelSize(8, 8),
        0,
        undefined,
        borderPatternDefinitionList
    )
];
export default list;
