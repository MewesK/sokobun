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

    src: string;
    tileMap: TileMap;

    levelMap: Array<Array<Tile>>;
    playerPosition: [number, number];
    boxPositionList: Array<[number, number]>;
    destinationPositionList: Array<[number, number]>;

    bufferCanvas!: HTMLCanvasElement;
    bufferContext!: CanvasRenderingContext2D;
    buffered: boolean = false;

    constructor(
        src: string,
        tileMap: TileMap,
        levelMap: Array<Array<Tile>>,
        playerPosition: [number, number],
        boxPositionList: Array<[number, number]>,
        destinationPositionList: Array<[number, number]>
    ) {
        this.src = src;
        this.tileMap = tileMap;

        this.levelMap = levelMap;
        this.playerPosition = playerPosition;
        this.boxPositionList = boxPositionList;
        this.destinationPositionList = destinationPositionList;
    }

    /**
     * Draws the level with the given context.
     *
     * @param context
     * @param zoom
     */
    draw = (context: CanvasRenderingContext2D, zoom: number): void => {
        if (!this.buffered) {
            this.bufferCanvas = document.createElement('canvas');
            this.bufferCanvas.width = this.levelMap[0].length * this.getTile(0, 0).width * zoom;
            this.bufferCanvas.height = this.levelMap.length * this.getTile(0, 0).height * zoom;

            const levelContext = this.bufferCanvas.getContext('2d');
            if (levelContext === null) {
                throw new Error('2D context not supported');
            }
            this.bufferContext = levelContext;

            this.bufferContext.imageSmoothingEnabled = false;
            this.bufferContext.fillStyle = Level.backgroundColor;
            this.bufferContext.fillRect(0, 0, context.canvas.width, context.canvas.height);

            for (let rowIndex = 0; rowIndex < this.levelMap.length; rowIndex++) {
                for (let columnIndex = 0; columnIndex < this.levelMap[0].length; columnIndex++) {
                    const tile = this.getTile(rowIndex, columnIndex);

                    this.bufferContext.drawImage(
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

            this.buffered = true;
        }

        context.imageSmoothingEnabled = false;
        context.drawImage(this.bufferCanvas, 0, 0);
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
}
