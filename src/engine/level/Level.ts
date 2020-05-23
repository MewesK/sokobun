import TileMap from '../tile/TileMap';
import Tile from '../tile/Tile';

export enum TileStyle {
    Grass,
    Snow,
    Water,
    Dirt
}

export default class Level {
    static backgroundColor = '#252230';
    static rowsPerTileStyle = 8
    static columnsPerTileStyle = 8
    static tilePatternList:Record<number, number> = {
        0b00000000: 0,
        0b00000001: 1,
        0b00000010: 1,
        0b00000011: 1,
        0b00000100: 2,
        0b00000101: 5,
        0b00000110: 5,
        0b00000111: 17,
        0b00001000: 17,
        0b00001001: 17,
        0b00001010: 17,
        0b00001011: 17,
        0b00001100: 17,
        0b00001101: 17,
        0b00001110: 17,
        0b00001111: 17,
        0b00010000: 17,
        0b00010001: 17,
        0b00010010: 17,
        0b00010011: 17,
        0b00010100: 17,
        0b00010101: 17,
        0b00010110: 17,
        0b00010111: 17,
        0b00011000: 17,
        0b00011001: 17,
        0b00011010: 17,
        0b00011011: 17,
        0b00011100: 17,
        0b00011101: 17,
        0b00011110: 17,
        0b00011111: 17,
        0b00100000: 3,
        0b00100001: 7,
        0b00100010: 7,
        0b00100011: 7,
        0b00100100: 9,
        0b00100101: 11,
        0b00100110: 11,
        0b00100111: 24,
        0b00101000: 24,
        0b00101001: 16,
        0b00101010: 16,
        0b00101011: 16,
        0b00101100: 16,
        0b00101101: 20,
        0b00101110: 20,
        0b00101111: 34,
        0b00110000: 34,
        0b00110001: 34,
        0b00110010: 34,
        0b00110011: 34,
        0b00110100: 34,
        0b00110101: 34,
        0b00110110: 34,
        0b00110111: 34,
        0b00111000: 34,
        0b00111001: 32,
        0b00111010: 32,
        0b00111011: 32,
        0b00111100: 32,
        0b00111101: 32,
        0b00111110: 32,
        0b00111111: 32,
        0b01000000: 32,
        0b01000001: 32,
        0b01000010: 32,
        0b01000011: 32,
        0b01000100: 32,
        0b01000101: 32,
        0b01000110: 32,
        0b01000111: 33,
        0b01001000: 33,
        0b01001001: 33,
        0b01001010: 33,
        0b01001011: 33,
        0b01001100: 33,
        0b01001101: 33,
        0b01001110: 33,
        0b01001111: 33,
        0b01010000: 33,
        0b01010001: 33,
        0b01010010: 33,
        0b01010011: 33,
        0b01010100: 33,
        0b01010101: 33,
        0b01010110: 33,
        0b01010111: 33,
        0b01011000: 33,
        0b01011001: 33,
        0b01011010: 46,
        0b01011011: 46,
        0b01011100: 46,
        0b01011101: 46,
        0b01011110: 46,
        0b01011111: 46,
        0b01100000: 46,
        0b01100001: 46,
        0b01100010: 46,
        0b01100011: 46,
        0b01100100: 46,
        0b01100101: 46,
        0b01100110: 46,
        0b01100111: 33,
        0b01101000: 33,
        0b01101001: 33,
        0b01101010: 33,
        0b01101011: 33,
        0b01101100: 33,
        0b01101101: 33,
        0b01101110: 33,
        0b01101111: 33,
        0b01110000: 33,
        0b01110001: 33,
        0b01110010: 33,
        0b01110011: 33,
        0b01110100: 33,
        0b01110101: 33,
        0b01110110: 33,
        0b01110111: 33,
        0b01111000: 33,
        0b01111001: 33,
        0b01111010: 46,
        0b01111011: 46,
        0b01111100: 46,
        0b01111101: 46,
        0b01111110: 46,
        0b01111111: 46,
        0b10000000: 4,
        0b10000001: 6,
        0b10000010: 6,
        0b10000011: 6,
        0b10000100: 8,
        0b10000101: 12,
        0b10000110: 12,
        0b10000111: 23,
        0b10001000: 23,
        0b10001001: 23,
        0b10001010: 23,
        0b10001011: 23,
        0b10001100: 23,
        0b10001101: 23,
        0b10001110: 23,
        0b10001111: 23,
        0b10010000: 23,
        0b10010001: 23,
        0b10010010: 23,
        0b10010011: 23,
        0b10010100: 18,
        0b10010101: 26,
        0b10010110: 26,
        0b10010111: 35,
        0b10011000: 35,
        0b10011001: 35,
        0b10011010: 35,
        0b10011011: 35,
        0b10011100: 32,
        0b10011101: 32,
        0b10011110: 32,
        0b10011111: 32,
        0b10100000: 10,
        0b10100001: 14,
        0b10100010: 14,
        0b10100011: 14,
        0b10100100: 13,
        0b10100101: 15,
        0b10100110: 15,
        0b10100111: 25,
        0b10101000: 25,
        0b10101001: 21,
        0b10101010: 21,
        0b10101011: 21,
        0b10101100: 21,
        0b10101101: 22,
        0b10101110: 22,
        0b10101111: 38,
        0b10110000: 38,
        0b10110001: 38,
        0b10110010: 38,
        0b10110011: 38,
        0b10110100: 27,
        0b10110101: 28,
        0b10110110: 28,
        0b10110111: 39,
        0b10111000: 39,
        0b10111001: 32,
        0b10111010: 32,
        0b10111011: 32,
        0b10111100: 32,
        0b10111101: 32,
        0b10111110: 32,
        0b10111111: 43,
        0b11000000: 43,
        0b11000001: 43,
        0b11000010: 43,
        0b11000011: 43,
        0b11000100: 43,
        0b11000101: 43,
        0b11000110: 43,
        0b11000111: 33,
        0b11001000: 33,
        0b11001001: 33,
        0b11001010: 33,
        0b11001011: 33,
        0b11001100: 33,
        0b11001101: 33,
        0b11001110: 33,
        0b11001111: 33,
        0b11010000: 33,
        0b11010001: 33,
        0b11010010: 33,
        0b11010011: 33,
        0b11010100: 33,
        0b11010101: 33,
        0b11010110: 33,
        0b11010111: 33,
        0b11011000: 33,
        0b11011001: 33,
        0b11011010: 46,
        0b11011011: 46,
        0b11011100: 46,
        0b11011101: 46,
        0b11011110: 46,
        0b11011111: 46,
        0b11100000: 19,
        0b11100001: 30,
        0b11100010: 33,
        0b11100011: 33,
        0b11100100: 29,
        0b11100101: 31,
        0b11100110: 33,
        0b11100111: 33,
        0b11101000: 33,
        0b11101001: 37,
        0b11101010: 37,
        0b11101011: 37,
        0b11101100: 37,
        0b11101101: 41,
        0b11101110: 41,
        0b11101111: 42,
        0b11110000: 42,
        0b11110001: 42,
        0b11110010: 42,
        0b11110011: 42,
        0b11110100: 36,
        0b11110101: 40,
        0b11110110: 40,
        0b11110111: 44,
        0b11111000: 44,
        0b11111001: 44,
        0b11111010: 46,
        0b11111011: 46,
        0b11111100: 46,
        0b11111101: 45,
        0b11111110: 46,
        0b11111111: 46
    }
    static tileStyleOffset: Record<TileStyle, [number, number]> = {
        [TileStyle.Grass]: [0, 0],
        [TileStyle.Snow]: [Level.rowsPerTileStyle, 0],
        [TileStyle.Water]: [0, Level.columnsPerTileStyle],
        [TileStyle.Dirt]: [Level.rowsPerTileStyle, Level.columnsPerTileStyle]
    }

    src: string;
    tileMap: TileMap;

    levelMap: Array<Array<Tile>> = [];
    playerPosition!: [number, number];
    boxPositionList: Array<[number, number]> = [];
    destinationPositionList: Array<[number, number]> = [];

    constructor(src: string, tileMap: TileMap) {
        this.src = src;
        this.tileMap = tileMap;
    }

    /**
     * Draws the level with the given context.
     *
     * @param context
     * @param zoom
     */
    draw = (context: CanvasRenderingContext2D, zoom: number): void => {
        context.imageSmoothingEnabled = false;
        context.fillStyle = Level.backgroundColor;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        for (let rowIndex = 0; rowIndex < this.levelMap.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.levelMap[0].length; columnIndex++) {
                const tile = this.getTile(rowIndex, columnIndex);

                context.drawImage(
                    tile.resource.data,
                    tile.x,
                    tile.y,
                    tile.width,
                    tile.height,
                    columnIndex * tile.width * zoom,
                    rowIndex * tile.height * zoom,
                    tile.width * zoom,
                    tile.height * zoom
                );
            }
        }
    }

    /**
     * Returns the tile at the given coordinates.
     *
     * @param row
     * @param column
     */
    getTile = (row: number, column: number): Tile => {
        if (row < 0 || row >= this.levelMap.length) {
            throw new Error('Invalid row');
        }
        if (column < 0 || column >= this.levelMap[0].length) {
            throw new Error('Invalid column');
        }
        return this.levelMap[row][column];
    }

    /**
     * Returns the tile corresponding to the given pattern in the given style.
     *
     * @param pattern
     * @param tileStyle
     */
    getTileByPattern = (pattern: number, tileStyle: TileStyle): Tile => {
        const patternIndex = Level.tilePatternList[pattern];
        if (patternIndex < 0) {
            throw new Error('Invalid pattern');
        }
        return this.tileMap.get(
            Math.floor(patternIndex / Level.columnsPerTileStyle) + Level.tileStyleOffset[tileStyle][1],
            (patternIndex % Level.columnsPerTileStyle) + Level.tileStyleOffset[tileStyle][0]
        );
    }
}
