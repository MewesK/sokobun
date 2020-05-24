import Sprite, {Action, ActionType, DirectionType, Direction} from './Sprite';
import TileMap from '../tile/TileMap';

export default class Bunnie extends Sprite {

    public constructor(tileMap: TileMap) {
        super(
            tileMap,
            {
                [ActionType.Stand]: new Action({
                    [DirectionType.Up]: new Direction([[2, 0]], 1),
                    [DirectionType.Down]: new Direction([[3, 0]], 1),
                    [DirectionType.Left]: new Direction([[0, 0]], 1),
                    [DirectionType.Right]: new Direction([[1, 0]], 1)
                },),
                [ActionType.Walk]: new Action({
                    [DirectionType.Up]: new Direction([[2, 1], [2, 0], [2, 2], [2, 0]], 0.6),
                    [DirectionType.Down]: new Direction([[3, 1], [3, 0], [3, 2], [3, 0]], 0.6),
                    [DirectionType.Left]: new Direction([[0, 1], [0, 0], [0, 2], [0, 0]], 0.6),
                    [DirectionType.Right]: new Direction([[1, 1], [1, 0], [1, 2], [1, 0]], 0.6),
                }),
                [ActionType.Push]: new Action({
                    [DirectionType.Up]: new Direction([[2, 3], [2, 2], [2, 4], [2, 2]], 0.6),
                    [DirectionType.Down]: new Direction([[3, 3], [3, 2], [3, 4], [3, 2]], 0.6),
                    [DirectionType.Left]: new Direction([[0, 3], [0, 2], [0, 4], [0, 2]], 0.6),
                    [DirectionType.Right]: new Direction([[1, 3], [1, 2], [1, 4], [1, 2]], 0.6),
                })
            },
            [0, tileMap.tileWidth, tileMap.tileWidth, tileMap.tileHeight] // [left, right, top, bottom]
        );
    }

    /**
     * Draws the sprite with the given context.
     * @param context
     * @param zoom
     */
    public draw = (context: CanvasRenderingContext2D, zoom: number): void => {
        const tile = this.getTile();
        context.imageSmoothingEnabled = false;
        context.drawImage(
            tile.resource.data,
            tile.x,
            tile.y,
            tile.width,
            tile.height,
            this.x * zoom,
            (this.y - Math.round(tile.height / 2)) * zoom,
            tile.width * zoom,
            tile.height * zoom
        );
    }
}
