import Sprite, {Action, Direction} from './Sprite';
import TileMap from './tile/TileMap';

export default class Bunnie extends Sprite {
    constructor(spriteMap: TileMap) {
        super({
            stand: new Action({
                [Direction.Up]: [spriteMap.get(2, 0)],
                [Direction.Down]: [spriteMap.get(3, 0)],
                [Direction.Left]: [spriteMap.get(0, 0)],
                [Direction.Right]: [spriteMap.get(1, 0)]
            }, 1),
            walk: new Action({
                [Direction.Up]: [
                    spriteMap.get(2, 1),
                    spriteMap.get(2, 0),
                    spriteMap.get(2, 2),
                    spriteMap.get(2, 0)
                ],
                [Direction.Down]: [
                    spriteMap.get(3, 1),
                    spriteMap.get(3, 0),
                    spriteMap.get(3, 2),
                    spriteMap.get(3, 0)
                ],
                [Direction.Left]: [
                    spriteMap.get(0, 1),
                    spriteMap.get(0, 0),
                    spriteMap.get(0, 2),
                    spriteMap.get(0, 0)
                ],
                [Direction.Right]: [
                    spriteMap.get(1, 1),
                    spriteMap.get(1, 0),
                    spriteMap.get(1, 2),
                    spriteMap.get(1, 0)
                ],
            }, 0.6),
            push: new Action({
                [Direction.Up]: [
                    spriteMap.get(2, 3),
                    spriteMap.get(2, 2),
                    spriteMap.get(2, 4),
                    spriteMap.get(2, 2)],
                [Direction.Down]: [
                    spriteMap.get(3, 3),
                    spriteMap.get(3, 2),
                    spriteMap.get(3, 4),
                    spriteMap.get(3, 2)],
                [Direction.Left]: [
                    spriteMap.get(0, 3),
                    spriteMap.get(0, 2),
                    spriteMap.get(0, 4),
                    spriteMap.get(0, 2)],
                [Direction.Right]: [
                    spriteMap.get(1, 3),
                    spriteMap.get(1, 2),
                    spriteMap.get(1, 4),
                    spriteMap.get(1, 2)
                ],
            }, 0.6)
        }, 'stand', Direction.Down);
    }

    /**
     * Draws the sprite with the given context.
     *
     * @param context
     * @param zoom
     */
    draw = (context: CanvasRenderingContext2D, zoom: number): void => {
        const tile = this.getTile();

        context.drawImage(
            tile.resource.data,
            tile.x,
            tile.y,
            tile.width,
            tile.height,
            this.x * zoom,
            this.y * zoom - (tile.height / (3 - zoom)),
            tile.width * zoom,
            tile.height * zoom
        );
    }
}
