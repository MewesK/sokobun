import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import TilePosition from '../core/TilePosition';
import Font from '../font/Font';
import TileMap from '../tile/TileMap';
import Component from './Component';

export default class Panel {
    public static readonly PADDING = 6;

    public readonly componentList: Array<Component> = [];

    protected readonly tileMap: TileMap;

    public parent: HTMLCanvasElement;
    public width: number;
    public text: string;
    public font: Font;

    constructor(tileMap: TileMap, parent: HTMLCanvasElement, width: number, text: string, font: Font) {
        this.tileMap = tileMap;
        this.parent = parent;
        this.width = width;
        this.text = text;
        this.font = font;
    }

    /**
     * Draws the panel with the given context.
     * @param context
     */
    public draw = (context: CanvasRenderingContext2D): void => {
        const size = this.calculateSize();
        const position = this.calculatePosition(size);

        // Draw panel
        this.tileMap.get(new TilePosition(0, 0)).draw(new PixelPosition(position.x, position.y), context);
        this.tileMap
            .get(new TilePosition(1, 0))
            .drawStretched(
                new PixelPosition(position.x + this.tileMap.tileSize.width, position.y),
                new PixelSize(size.width - 2 * this.tileMap.tileSize.width, this.tileMap.tileSize.height),
                context
            );
        this.tileMap
            .get(new TilePosition(2, 0))
            .draw(new PixelPosition(position.x + size.width - this.tileMap.tileSize.width, position.y), context);

        this.tileMap
            .get(new TilePosition(0, 1))
            .drawStretched(
                new PixelPosition(position.x, position.y + this.tileMap.tileSize.height),
                new PixelSize(this.tileMap.tileSize.width, size.height - 2 * this.tileMap.tileSize.height),
                context
            );
        this.tileMap
            .get(new TilePosition(1, 1))
            .drawStretched(
                new PixelPosition(position.x + this.tileMap.tileSize.width, position.y + this.tileMap.tileSize.height),
                new PixelSize(
                    size.width - 2 * this.tileMap.tileSize.width,
                    size.height - 2 * this.tileMap.tileSize.height
                ),
                context
            );
        this.tileMap
            .get(new TilePosition(2, 1))
            .drawStretched(
                new PixelPosition(
                    position.x + size.width - this.tileMap.tileSize.width,
                    position.y + this.tileMap.tileSize.height
                ),
                new PixelSize(this.tileMap.tileSize.width, size.height - 2 * this.tileMap.tileSize.height),
                context
            );

        this.tileMap
            .get(new TilePosition(0, 2))
            .draw(new PixelPosition(position.x, position.y + size.height - this.tileMap.tileSize.height), context);
        this.tileMap
            .get(new TilePosition(1, 2))
            .drawStretched(
                new PixelPosition(
                    position.x + this.tileMap.tileSize.width,
                    position.y + size.height - this.tileMap.tileSize.height
                ),
                new PixelSize(size.width - 2 * this.tileMap.tileSize.width, this.tileMap.tileSize.height),
                context
            );
        this.tileMap
            .get(new TilePosition(2, 2))
            .draw(
                new PixelPosition(
                    position.x + size.width - this.tileMap.tileSize.width,
                    position.y + size.height - this.tileMap.tileSize.height
                ),
                context
            );

        // Draw text
        const fontSize = this.font.measure(this.text);
        this.font.draw(
            this.text,
            new PixelPosition((size.width - fontSize.width) / 2 + position.x, position.y - fontSize.height - Panel.PADDING),
            context
        );

        // Draw components
        let y = position.y;
        this.componentList.forEach((component) => {
            y += component.marginTop + Panel.PADDING;
            component.draw(new PixelPosition(position.x + Panel.PADDING, y), context);
            y += component.measure().height;
        });
    };

    /**
     * Calculates the actual position.
     */
    private calculatePosition = (size: PixelSize): PixelPosition => {
        return new PixelPosition((this.parent.width - size.width) / 2, (this.parent.height - size.height) / 2);
    };

    /**
     * Calculates the actual size based on the child components.
     */
    private calculateSize = (): PixelSize => {
        let height = Panel.PADDING;
        this.componentList.forEach((component) => {
            height += component.measure().height + component.marginTop + Panel.PADDING;
        });
        return new PixelSize(this.width + 2 * Panel.PADDING, height + (this.componentList.length == 0 ? Panel.PADDING : 0));
    };
}
