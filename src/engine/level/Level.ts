import TileMap from '../tile/TileMap';
import Tile, {TileType} from '../tile/Tile';

export default class Level extends TileMap {

    private static BACKGROUND = '#252230';

    public readonly src: string;

    public readonly playerPosition: [number, number];
    public readonly boxPositionList: Array<[number, number]>;
    public readonly destinationPositionList: Array<[number, number]>;

    private bufferCanvas!: HTMLCanvasElement;
    private bufferContext!: CanvasRenderingContext2D;
    private buffered: boolean = false;

    constructor(
        src: string,
        tileTable: Array<Array<Tile>>,
        playerPosition: [number, number],
        boxPositionList: Array<[number, number]>,
        destinationPositionList: Array<[number, number]>
    ) {
        super(tileTable);

        this.src = src;

        this.playerPosition = playerPosition;
        this.boxPositionList = boxPositionList;
        this.destinationPositionList = destinationPositionList;
    }

    /**
     * Draws the level with the given context.
     * @param context
     * @param zoom
     */
    public draw = (context: CanvasRenderingContext2D, zoom: number): void => {
        if (!this.buffered) {
            this.bufferCanvas = document.createElement('canvas');
            this.bufferCanvas.width = this.columns * this.tileWidth * zoom;
            this.bufferCanvas.height = this.rows * this.tileHeight * zoom;

            const levelContext = this.bufferCanvas.getContext('2d');
            if (levelContext === null) {
                throw new Error('2D context not supported');
            }
            this.bufferContext = levelContext;

            this.bufferContext.imageSmoothingEnabled = false;
            this.bufferContext.fillStyle = Level.BACKGROUND;
            this.bufferContext.fillRect(0, 0, context.canvas.width, context.canvas.height);

            for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
                for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                    const tile = this.get(rowIndex, columnIndex);
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
     * Checks if the given rectangle intersects with any blocking part of the level or the canvas boundaries.
     * @param rectangle [left, right, top, bottom]
     * @param context
     */
    public intersects = (rectangle: [number, number, number, number], context: CanvasRenderingContext2D): boolean => {
        // Check canvas boundaries
        if (
            rectangle[0] < 0 ||
            rectangle[1] >= context.canvas.width ||
            rectangle[2] < 0 ||
            rectangle[3] >= context.canvas.height
        ) {
            return true;
        }

        // Check all none floor tiles
        let tile: Tile, tileRectangle: [number, number, number, number];
        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                tile = this.tileTable[rowIndex][columnIndex];
                if (tile.type !== TileType.Floor) {
                    tileRectangle = [
                        columnIndex * this.tileWidth,
                        (columnIndex + 1) * this.tileWidth,
                        rowIndex * this.tileHeight,
                        (rowIndex + 1) * this.tileHeight
                    ];

                    if (rectangle[0] <= tileRectangle[1] &&
                        tileRectangle[0] <= rectangle[1] &&
                        rectangle[2] <= tileRectangle[3] &&
                        tileRectangle[2] <= rectangle[3]
                    ) {
                        console.debug('Collides with tile', rowIndex, columnIndex, rectangle, tileRectangle);
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
