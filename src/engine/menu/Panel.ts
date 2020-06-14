import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import TilePosition from '../core/TilePosition';
import Font from '../font/Font';
import Game from '../Game';
import Level from '../level/Level';
import TileMap from '../tile/TileMap';
import Component from './Component';
import Text from './Text';

export default class Panel extends Text {
    public readonly componentList: Array<Component> = [];

    protected readonly tileMap: TileMap;

    constructor(
        parent: Level,
        position: PixelPosition,
        size: PixelSize,
        centered: boolean,
        text: string,
        font: Font,
        tileMap: TileMap
    ) {
        super(parent, position, size, centered, text, font);
        this.tileMap = tileMap;
    }

    /**
     * Draws the panel with the given context.
     * @param context
     */
    public draw = (context: CanvasRenderingContext2D): void => {
        const position = this.calculatePosition();

        // Draw panel
        this.tileMap.get(new TilePosition(0, 0)).draw(new PixelPosition(position.x, position.y), context);
        this.tileMap
            .get(new TilePosition(1, 0))
            .drawStretched(
                new PixelPosition(position.x + this.tileMap.tileSize.width, position.y),
                new PixelSize(this.size.width - 2 * this.tileMap.tileSize.width, this.tileMap.tileSize.height),
                context
            );
        this.tileMap
            .get(new TilePosition(2, 0))
            .draw(new PixelPosition(position.x + this.size.width - this.tileMap.tileSize.width, position.y), context);

        this.tileMap
            .get(new TilePosition(0, 1))
            .drawStretched(
                new PixelPosition(position.x, position.y + this.tileMap.tileSize.height),
                new PixelSize(this.tileMap.tileSize.width, this.size.height - 2 * this.tileMap.tileSize.height),
                context
            );
        this.tileMap
            .get(new TilePosition(1, 1))
            .drawStretched(
                new PixelPosition(position.x + this.tileMap.tileSize.width, position.y + this.tileMap.tileSize.height),
                new PixelSize(
                    this.size.width - 2 * this.tileMap.tileSize.width,
                    this.size.height - 2 * this.tileMap.tileSize.height
                ),
                context
            );
        this.tileMap
            .get(new TilePosition(2, 1))
            .drawStretched(
                new PixelPosition(
                    position.x + this.size.width - this.tileMap.tileSize.width,
                    position.y + this.tileMap.tileSize.height
                ),
                new PixelSize(this.tileMap.tileSize.width, this.size.height - 2 * this.tileMap.tileSize.height),
                context
            );

        this.tileMap
            .get(new TilePosition(0, 2))
            .draw(new PixelPosition(position.x, position.y + this.size.height - this.tileMap.tileSize.height), context);
        this.tileMap
            .get(new TilePosition(1, 2))
            .drawStretched(
                new PixelPosition(
                    position.x + this.tileMap.tileSize.width,
                    position.y + this.size.height - this.tileMap.tileSize.height
                ),
                new PixelSize(this.size.width - 2 * Game.TILE_SIZE.width, Game.TILE_SIZE.height),
                context
            );
        this.tileMap
            .get(new TilePosition(2, 2))
            .draw(
                new PixelPosition(
                    position.x + this.size.width - this.tileMap.tileSize.width,
                    position.y + this.size.height - this.tileMap.tileSize.height
                ),
                context
            );

        // Draw text
        const fontSize = this.font.measure(this.text);
        this.font.draw(
            this.text,
            new PixelPosition((this.size.width - fontSize.width) / 2 + position.x, position.y - fontSize.height),
            context
        );

        // Draw components
        this.componentList.forEach((component) => component.draw(context));
    };
}
