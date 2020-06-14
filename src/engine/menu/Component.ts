import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import Panel from './Panel';

export default abstract class Component {
    public parent: Panel;
    public marginTop: number;

    protected constructor(parent: Panel, marginTop = 0) {
        this.parent = parent;
        this.marginTop = marginTop;
    }

    /**
     * Draws the component in the given context.
     * @param position
     * @param context
     */
    public abstract draw(position: PixelPosition, context: CanvasRenderingContext2D): void;

    /**
     * Measures the size of the component.
     */
    public abstract measure(): PixelSize;
}
