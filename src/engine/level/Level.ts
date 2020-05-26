import TileMap from '../tile/TileMap';
import Tile, { TileType } from '../tile/Tile';
import CollisionBox from '../CollisionBox';

export default class Level extends TileMap {
    private static BACKGROUND_COLOR = '#252230';

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
     */
    public draw = (context: CanvasRenderingContext2D): void => {
        if (!this.buffered) {
            this.bufferCanvas = document.createElement('canvas');
            this.bufferCanvas.width = this.columns * this.tileWidth;
            this.bufferCanvas.height = this.rows * this.tileHeight;

            const levelContext = this.bufferCanvas.getContext('2d');
            if (levelContext === null) {
                throw new Error('2D context not supported');
            }
            this.bufferContext = levelContext;

            this.bufferContext.imageSmoothingEnabled = false;
            this.bufferContext.fillStyle = Level.BACKGROUND_COLOR;
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
                        columnIndex * tile.width,
                        rowIndex * tile.height,
                        tile.width,
                        tile.height
                    );
                }
            }

            this.buffered = true;
        }

        context.imageSmoothingEnabled = false;
        context.drawImage(this.bufferCanvas, 0, 0);
    };

    /**
     * Checks if the given rectangle intersects with any blocking part of the level or the canvas boundaries.
     * @param collisionBox
     * @param context
     */
    public intersects = (collisionBox: CollisionBox, context: CanvasRenderingContext2D): boolean => {
        // Check canvas boundaries
        if (
            collisionBox.left < 0 ||
            collisionBox.right >= context.canvas.width ||
            collisionBox.top < 0 ||
            collisionBox.bottom >= context.canvas.height
        ) {
            return true;
        }

        // Check all none floor tiles
        let tile: Tile, tileCollisionBox: CollisionBox;
        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                tile = this.tileTable[rowIndex][columnIndex];
                if (tile.type !== TileType.Floor) {
                    tileCollisionBox = new CollisionBox(
                        columnIndex * this.tileWidth,
                        columnIndex * this.tileWidth + this.tileWidth,
                        rowIndex * this.tileHeight,
                        rowIndex * this.tileHeight + this.tileHeight
                    );

                    if (
                        collisionBox.left < tileCollisionBox.right &&
                        tileCollisionBox.left < collisionBox.right &&
                        collisionBox.top < tileCollisionBox.bottom &&
                        tileCollisionBox.top < collisionBox.bottom
                    ) {
                        return true;
                    }
                }
            }
        }

        return false;
    };
}
