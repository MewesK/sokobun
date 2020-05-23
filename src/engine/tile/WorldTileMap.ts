import TileMap from './TileMap';
import {TileStyle} from '../level/Level';
import Tile from './Tile';

export default class WorldTileMap extends TileMap {
    static rowsPerTileStyle = 8
    static columnsPerTileStyle = 8

    static tilePatternList:Array<[number, RegExp]> = [
        [ 0, /00000000/],
        [ 1, /00000001/],
        [ 2, /00000100/],
        [ 3, /00100000/],
        [ 4, /10000000/],
        [ 5, /00000101/],
        [ 6, /10000001/],
        [ 7, /00100001/],
        [ 8, /10000100/],
        [ 9, /00100100/],
        [10, /10100000/],
        [11, /00100101/],
        [12, /10000101/],
        [13, /10100100/],
        [14, /10100001/],
        [15, /10100101/],
        [16, /00.0100./],
        [17, /00000.1./],
        [18, /.0010.00/],
        [19, /.1.00000/],
        [20, /00.0110./],
        [21, /10.0100./],
        [22, /10.0110./],
        [23, /10000.1./],
        [24, /00100.1./],
        [25, /10100.1./],
        [26, /.0010.01/],
        [27, /.0110.00/],
        [28, /.0110.01/],
        [29, /.1.00100/],
        [30, /.1.00001/],
        [31, /.1.00101/],
        [32, /.0.11.0./],
        [33, /.1.00.1./],
        [34, /00.01.1./],
        [35, /.0.10.1./],
        [36, /.1.10.00/],
        [37, /.1.0100./],
        [38, /10.01.1./],
        [39, /.0110.1./],
        [40, /.1.10.01/],
        [41, /.1.0110./],
        [42, /.1.01.1./],
        [43, /.0.11.1./],
        [44, /.1.10.1./],
        [45, /.1.11.0./],
        [46, /.1.11.1./]
    ]

    static tileStyleOffset: Record<TileStyle, [number, number]> = {
        [TileStyle.Grass]: [0, 0],
        [TileStyle.Snow]: [WorldTileMap.rowsPerTileStyle, 0],
        [TileStyle.Water]: [0, WorldTileMap.columnsPerTileStyle],
        [TileStyle.Dirt]: [WorldTileMap.rowsPerTileStyle, WorldTileMap.columnsPerTileStyle]
    }

    /**
     * Returns the tile corresponding to the given pattern in the given style.
     *
     * @param pattern
     * @param tileStyle
     */
    getTileByPattern = (pattern: string, tileStyle: TileStyle): Tile => {
        const tilePattern = WorldTileMap.tilePatternList.find(value => pattern.match(value[1]));
        if (tilePattern === undefined) {
            throw new Error(`Invalid pattern '${pattern}'`);
        }
        return this.get(
            Math.floor(tilePattern[0] / WorldTileMap.columnsPerTileStyle) + WorldTileMap.tileStyleOffset[tileStyle][1],
            (tilePattern[0] % WorldTileMap.columnsPerTileStyle) + WorldTileMap.tileStyleOffset[tileStyle][0]
        );
    }
}
