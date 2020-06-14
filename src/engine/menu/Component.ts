import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import Level from '../level/Level';

export default abstract class Component {
    public parent: Component | Level;
    public position: PixelPosition;
    public size: PixelSize;
    public centered = false;

    protected constructor(parent: Component | Level, position: PixelPosition, size: PixelSize, centered: boolean) {
        this.parent = parent;
        this.position = position;
        this.size = size;
        this.centered = centered;
    }

    /**
     * Draws the component in the given context.
     * @param context
     */
    public abstract draw(context: CanvasRenderingContext2D): void;

    /**
     * Calculates the actual position.
     */
    protected calculatePosition = (): PixelPosition => {
        const parentPosition =
            this.parent instanceof Level
                ? new PixelPosition(0, 0)
                : (<Component>this.parent).calculatePosition();
        const parentSize =
            this.parent instanceof Level
                ? new PixelSize((<Level>this.parent).levelCanvas.width, (<Level>this.parent).levelCanvas.height)
                : (<Component>this.parent).size;

        return this.centered
            ? new PixelPosition(
                  (parentSize.width - this.size.width) / 2 + parentPosition.x + this.position.x,
                  (parentSize.height - this.size.height) / 2 + parentPosition.y + this.position.y
              )
            : this.position;
    };
}
