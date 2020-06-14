import Font from '../font/Font';
import Panel from './Panel';
import Text from './Text';

export default class Button extends Text {
    public selected = false;

    constructor(parent: Panel, marginTop: number, text: string, font: Font, selected: boolean) {
        super(parent, marginTop, text, font);
        this.selected = selected;
    }
}
