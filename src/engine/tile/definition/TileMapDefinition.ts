import PixelSize from '../../core/PixelSize';
import TileOffset from '../../core/TileOffset';
import TileSize from '../../core/TileSize';
import { PatternOffsetTileListDefinition } from './PatternOffsetTileListDefinition';
import { RandomTileDefinition } from './RandomTileDefinition';

export class TileMapDefinition {
    public src: string;
    public size: TileSize;
    public offset: TileOffset;
    public tileSize: PixelSize;
    public grid: number;
    public randomTileDefinitionList: Array<RandomTileDefinition> | undefined;
    public patternOffsetTileSetDefinitionList: Array<PatternOffsetTileListDefinition> | undefined;

    constructor(
        src: string,
        size: TileSize,
        offset: TileOffset,
        tileSize: PixelSize,
        grid: number,
        randomTileDefinitionList: Array<RandomTileDefinition> | undefined,
        patternOffsetTileSetDefinitionList: Array<PatternOffsetTileListDefinition> | undefined
    ) {
        this.src = src;
        this.size = size;
        this.offset = offset;
        this.tileSize = tileSize;
        this.grid = grid;
        this.randomTileDefinitionList = randomTileDefinitionList;
        this.patternOffsetTileSetDefinitionList = patternOffsetTileSetDefinitionList;
    }
}
