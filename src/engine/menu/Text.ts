import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import Font from '../font/Font';
import Component from './Component';

export default class Text extends Component {
    public text: string;
    public font: Font;
    public centered = false;

    constructor(position: PixelPosition, size: PixelSize, text: string, font: Font, centered: boolean) {
        super(position, size);
        this.text = text;
        this.font = font;
        this.centered = centered;
    }

    public draw = (context: CanvasRenderingContext2D): void => {
        if (this.centered) {
            this.font.drawCentered(this.text, this.position, this.size, context);
        } else {
            this.font.draw(this.text, this.position, context);
        }
    };
}
