import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import Font from '../font/Font';
import Text from './Text';

export default class Button extends Text {
    public selected = false;

    constructor(
        position: PixelPosition,
        size: PixelSize,
        text: string,
        font: Font,
        centered: boolean,
        selected: boolean
    ) {
        super(position, size, text, font, centered);
        this.selected = selected;
    }
}
