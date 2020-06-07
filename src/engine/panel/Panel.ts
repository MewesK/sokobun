import Game from '../Game';
import Tile from '../tile/Tile';
import TileMap from '../tile/TileMap';

export default class Panel {
    public readonly tileMap: TileMap;

    public width = 3;
    public height = 3;

    constructor(tileMap: TileMap, width: number, height: number) {
        this.tileMap = tileMap;
        this.width = width;
        this.height = height;
    }

    /**
     * Draws the panel with the given context.
     * @param x
     * @param y
     * @param context
     */
    public draw = (x: number, y: number, context: CanvasRenderingContext2D): void => {
        let tile: Tile;
        for (let rowIndex = 0; rowIndex < this.height; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.width; columnIndex++) {
                if (rowIndex == 0) {
                    if (columnIndex == 0) {
                        tile = this.tileMap.get(0, 0);
                    } else if (columnIndex == this.width - 1) {
                        tile = this.tileMap.get(0, 2);
                    } else {
                        tile = this.tileMap.get(0, 1);
                    }
                } else if (rowIndex == this.height - 1) {
                    if (columnIndex == 0) {
                        tile = this.tileMap.get(2, 0);
                    } else if (columnIndex == this.width - 1) {
                        tile = this.tileMap.get(2, 2);
                    } else {
                        tile = this.tileMap.get(2, 1);
                    }
                } else {
                    if (columnIndex == 0) {
                        tile = this.tileMap.get(1, 0);
                    } else if (columnIndex == this.width - 1) {
                        tile = this.tileMap.get(1, 2);
                    } else {
                        tile = this.tileMap.get(1, 1);
                    }
                }
                tile.draw(x + columnIndex * tile.width, y + rowIndex * tile.height, context);
            }
        }
    };

    /**
     * Draws the given text.
     * @param offsetX
     * @param offsetY
     * @param context
     */
    public drawCentered = (offsetX: number, offsetY: number, context: CanvasRenderingContext2D): void => {
        const size = this.calculateSize();
        this.draw(
            (context.canvas.width - size[0]) / 2 + offsetX,
            (context.canvas.height - size[1]) / 2 + offsetY,
            context
        );
    };

    /**
     * Calculates the size of the given text.
     */
    public calculateSize = (): [number, number] => {
        return [this.width * Game.TILE_WIDTH, this.height * Game.TILE_HEIGHT];
    };
}
