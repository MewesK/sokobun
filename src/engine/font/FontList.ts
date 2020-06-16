import tilesQarmic10Bright from '../../fonts/qarmic_10_bright.png';
import tilesQarmic10Dark from '../../fonts/qarmic_10_dark.png';
import definitionQarmic10 from '../../fonts/qarmic_10.json';
import tilesQarmic14Bright from '../../fonts/qarmic_14_bright.png';
import tilesQarmic14Dark from '../../fonts/qarmic_14_dark.png';
import definitionQarmic14 from '../../fonts/qarmic_14.json';
import FontDefinition from './definition/FontDefinition';
import { FontColor } from './Font';

const list: Array<[FontDefinition, FontColor, string]> = [
    [definitionQarmic10, FontColor.Bright, tilesQarmic10Bright],
    [definitionQarmic10, FontColor.Dark, tilesQarmic10Dark],
    [definitionQarmic14, FontColor.Bright, tilesQarmic14Bright],
    [definitionQarmic14, FontColor.Dark, tilesQarmic14Dark]
];
export default list;
