import tilesYosterIsland8Bright from '../../fonts/yoster_island_8_bright.png';
import tilesYosterIsland8Dark from '../../fonts/yoster_island_8_dark.png';
import definitionYosterIsland8 from '../../fonts/yoster_island_8.json';
import tilesYosterIsland10Bright from '../../fonts/yoster_island_10_bright.png';
import tilesYosterIsland10Dark from '../../fonts/yoster_island_10_dark.png';
import definitionYosterIsland10 from '../../fonts/yoster_island_10.json';
import tilesYosterIsland12Bright from '../../fonts/yoster_island_12_bright.png';
import tilesYosterIsland12Dark from '../../fonts/yoster_island_12_dark.png';
import definitionYosterIsland12 from '../../fonts/yoster_island_12.json';
import tilesYosterIsland14Bright from '../../fonts/yoster_island_14_bright.png';
import tilesYosterIsland14Dark from '../../fonts/yoster_island_14_dark.png';
import definitionYosterIsland14 from '../../fonts/yoster_island_14.json';
import FontDefinition from './definition/FontDefinition';
import { FontColor } from './Font';

const list: Array<[FontDefinition, FontColor, string]> = [
    [definitionYosterIsland8, FontColor.Bright, tilesYosterIsland8Bright],
    [definitionYosterIsland8, FontColor.Dark, tilesYosterIsland8Dark],
    [definitionYosterIsland10, FontColor.Bright, tilesYosterIsland10Bright],
    [definitionYosterIsland10, FontColor.Dark, tilesYosterIsland10Dark],
    [definitionYosterIsland12, FontColor.Bright, tilesYosterIsland12Bright],
    [definitionYosterIsland12, FontColor.Dark, tilesYosterIsland12Dark],
    [definitionYosterIsland14, FontColor.Bright, tilesYosterIsland14Bright],
    [definitionYosterIsland14, FontColor.Dark, tilesYosterIsland14Dark]
];
export default list;
