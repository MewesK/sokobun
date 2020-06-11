import PixelOffset from '../core/PixelOffset';
import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';

export default abstract class Component {
    public position: PixelPosition;
    public size: PixelSize;

    protected constructor(position: PixelPosition, size: PixelSize) {
        this.position = position;
        this.size = size;
    }

    /**
     * Draws the given text.
     * @param parentSize
     * @param offset
     */
    public center = (parentSize: PixelSize, offset: PixelOffset = new PixelOffset(0, 0)): void => {
        this.position.x = (parentSize.width - this.size.width) / 2 + offset.x;
        this.position.y = (parentSize.height - this.size.height) / 2 + offset.y;
    };

    /**
     * Draws the component in the given context.
     * @param context
     */
    public abstract draw(context: CanvasRenderingContext2D): void;
}
