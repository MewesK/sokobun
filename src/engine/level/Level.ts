import TileMap from '../tile/TileMap';
import Tile, { TileType } from '../tile/Tile';
import CollisionBox from '../CollisionBox';
import LevelTileMap from '../tile/LevelTileMap';
import Sprite from '../sprite/Sprite';

export default class Level extends TileMap {
    private static BACKGROUND_COLOR = '#252230';
    private static MOON_OFFSET = 32;

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
     * @param spriteList
     * @param voidTileMap
     * @param moonTileMap
     * @param context
     */
    public draw = (
        spriteList: Array<Sprite>,
        voidTileMap: LevelTileMap,
        moonTileMap: LevelTileMap,
        context: CanvasRenderingContext2D
    ): void => {
        const rowMax = context.canvas.height / this.tileHeight;
        const columnMax = context.canvas.width / this.tileWidth;
        const xOffset = ((columnMax - this.columns) / 2) * this.tileWidth;
        const yOffset = ((rowMax - this.rows) / 2) * this.tileHeight;

        if (!this.buffered) {
            this.bufferCanvas = document.createElement('canvas');
            this.bufferCanvas.width = context.canvas.width;
            this.bufferCanvas.height = context.canvas.height;

            const levelContext = this.bufferCanvas.getContext('2d');
            if (levelContext === null) {
                throw new Error('2D context not supported');
            }
            this.bufferContext = levelContext;

            this.bufferContext.imageSmoothingEnabled = false;
            this.bufferContext.fillStyle = Level.BACKGROUND_COLOR;
            this.bufferContext.fillRect(0, 0, context.canvas.width, context.canvas.height);

            // Draw background
            for (let rowIndex = 0; rowIndex < rowMax; rowIndex++) {
                for (let columnIndex = 0; columnIndex < columnMax; columnIndex++) {
                    const tile = voidTileMap.getWeightedRandomTile();
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

            // Draw moon
            [
                [0, 0],
                [0, 1],
                [1, 0],
                [1, 1]
            ].forEach((value) => {
                const tile = moonTileMap.get(value[0], value[1]);
                this.bufferContext.drawImage(
                    tile.resource.data,
                    tile.x,
                    tile.y,
                    tile.width,
                    tile.height,
                    value[1] * tile.width + Level.MOON_OFFSET,
                    value[0] * tile.height + Level.MOON_OFFSET,
                    tile.width,
                    tile.height
                );
            });

            // Draw level
            for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
                for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                    const tile = this.get(rowIndex, columnIndex);
                    this.bufferContext.drawImage(
                        tile.resource.data,
                        tile.x,
                        tile.y,
                        tile.width,
                        tile.height,
                        xOffset + columnIndex * tile.width,
                        yOffset + rowIndex * tile.height,
                        tile.width,
                        tile.height
                    );
                }
            }

            this.buffered = true;
        }

        // Draw buffer
        context.imageSmoothingEnabled = false;
        context.drawImage(this.bufferCanvas, 0, 0);

        // Draw sprites
        spriteList.forEach((value) => value.draw(xOffset, yOffset, context));
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
