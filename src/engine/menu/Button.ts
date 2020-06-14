import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import Font from '../font/Font';
import Level from '../level/Level';
import Component from './Component';
import Text from './Text';

export default class Button extends Text {
    public selected = false;

    constructor(
        parent: Component | Level,
        position: PixelPosition,
        size: PixelSize,
        centered: boolean,
        text: string,
        font: Font,
        selected: boolean
    ) {
        super(parent, position, size, centered, text, font);
        this.selected = selected;
    }
}
