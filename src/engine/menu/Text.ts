import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import Font from '../font/Font';
import Level from '../level/Level';
import Component from './Component';

export default class Text extends Component {
    public text: string;
    public font: Font;

    constructor(
        parent: Component | Level,
        position: PixelPosition,
        size: PixelSize,
        centered: boolean,
        text: string,
        font: Font
    ) {
        super(parent, position, size, centered);
        this.text = text;
        this.font = font;
    }

    public draw = (context: CanvasRenderingContext2D): void => {
        this.font.draw(this.text, this.calculatePosition(), context);
    };
}
