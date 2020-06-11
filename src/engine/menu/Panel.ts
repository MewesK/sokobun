import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import TilePosition from '../core/TilePosition';
import Font from '../font/Font';
import Game from '../Game';
import TileMap from '../tile/TileMap';
import Component from './Component';
import Text from './Text';

export default class Panel extends Text {
    public readonly components: Array<Component> = [];

    protected readonly tileMap: TileMap;

    constructor(
        position: PixelPosition,
        size: PixelSize,
        text: string,
        font: Font,
        centered: boolean,
        components: Array<Component>,
        tileMap: TileMap
    ) {
        super(position, size, text, font, centered);
        this.components = components;
        this.tileMap = tileMap;
    }

    /**
     * Draws the panel with the given context.
     * @param context
     */
    public draw = (context: CanvasRenderingContext2D): void => {
        // Draw panel
        this.tileMap.get(new TilePosition(0, 0)).draw(new PixelPosition(this.position.x, this.position.y), context);
        this.tileMap
            .get(new TilePosition(0, 2))
            .drawStretched(
                new PixelPosition(this.position.x + Game.TILE_SIZE.width, this.position.y),
                new PixelSize(this.size.width - 2 * Game.TILE_SIZE.width, Game.TILE_SIZE.height),
                context
            );
        this.tileMap
            .get(new TilePosition(0, 1))
            .draw(
                new PixelPosition(this.position.x + this.size.width - 2 * Game.TILE_SIZE.width, this.position.y),
                context
            );
        this.tileMap
            .get(new TilePosition(2, 0))
            .drawStretched(
                new PixelPosition(this.position.x, this.position.y + Game.TILE_SIZE.height),
                new PixelSize(Game.TILE_SIZE.width, this.size.height - 2 * Game.TILE_SIZE.height),
                context
            );
        this.tileMap
            .get(new TilePosition(2, 2))
            .drawStretched(
                new PixelPosition(this.position.x + Game.TILE_SIZE.width, this.position.y + Game.TILE_SIZE.height),
                new PixelSize(this.size.width - 2 * Game.TILE_SIZE.width, this.size.height - 2 * Game.TILE_SIZE.height),
                context
            );
        this.tileMap
            .get(new TilePosition(2, 1))
            .drawStretched(
                new PixelPosition(
                    this.position.x + this.size.width - 2 * Game.TILE_SIZE.width,
                    this.position.y + Game.TILE_SIZE.height
                ),
                new PixelSize(Game.TILE_SIZE.width, this.size.height - 2 * Game.TILE_SIZE.height),
                context
            );
        this.tileMap
            .get(new TilePosition(1, 0))
            .draw(
                new PixelPosition(this.position.x, this.position.y + this.size.height - Game.TILE_SIZE.height),
                context
            );
        this.tileMap
            .get(new TilePosition(1, 2))
            .drawStretched(
                new PixelPosition(
                    this.position.x + Game.TILE_SIZE.width,
                    this.position.y + this.size.height - Game.TILE_SIZE.height
                ),
                new PixelSize(this.size.width - 2 * Game.TILE_SIZE.width, Game.TILE_SIZE.height),
                context
            );
        this.tileMap
            .get(new TilePosition(1, 1))
            .draw(
                new PixelPosition(
                    this.position.x + this.size.width - 2 * Game.TILE_SIZE.width,
                    this.position.y + this.size.height - Game.TILE_SIZE.height
                ),
                context
            );

        // Draw text
        const fontSize = this.font.measure(this.text);
        this.font.drawCentered(
            this.text,
            new PixelPosition(this.position.x, this.position.y - fontSize.height),
            new PixelSize(this.size.width, fontSize.height),
            context
        );

        // Draw components
        this.components.forEach((component) => component.draw(context));
    };
}
