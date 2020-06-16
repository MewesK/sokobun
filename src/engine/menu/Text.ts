import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import Font from '../font/Font';
import Component from './Component';
import Panel from './Panel';

export default class Text extends Component {
    public text: string;
    public font: Font;

    constructor(parent: Panel, marginTop: number, text: string, font: Font) {
        super(parent, marginTop);
        this.text = text;
        this.font = font;
    }

    public draw = (position: PixelPosition, context: CanvasRenderingContext2D): void => {
        const fontWidth = this.font.measure(this.text).width;
        const parentWidth = this.parent.width;
        this.font.draw(this.text, new PixelPosition(Math.round((parentWidth - fontWidth) / 2) + position.x, position.y), context);
    };

    public measure = (): PixelSize => {
        return new PixelSize(this.parent.width, this.font.measure(this.text).height);
    };
}
