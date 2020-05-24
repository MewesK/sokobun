import TileMap from '../tile/TileMap';
import Tile from '../tile/Tile';

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
        tileTable: Array<Array<Tile>>,
        rows: number,
        columns: number,
        tileWidth: number,
        tileHeight: number,
        src: string,
        playerPosition: [number, number],
        boxPositionList: Array<[number, number]>,
        destinationPositionList: Array<[number, number]>
    ) {
        super(
            tileTable,
            rows,
            columns,
            tileWidth,
            tileHeight
        );

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
     * Checks if the given rectangle intersects with any blocking part of the level.
     * @param rectangle
     * @param context
     */
    // @ts-ignore
    public intersects = (rectangle: [number, number, number, number], context: CanvasRenderingContext2D): boolean => {
        // TODO
        return false;
    }
}
