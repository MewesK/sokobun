import tilesYosterIsland10Bright from '../../fonts/yoster_island_10_bright.png';
import tilesYosterIsland10Dark from '../../fonts/yoster_island_10_dark.png';
import definitionYosterIsland10 from '../../fonts/yoster_island_10.json';
import tilesYosterIsland14Bright from '../../fonts/yoster_island_14_bright.png';
import tilesYosterIsland14Dark from '../../fonts/yoster_island_14_dark.png';
import definitionYosterIsland14 from '../../fonts/yoster_island_14.json';
import FontDefinition from './definition/FontDefinition';
import { FontColor } from './Font';

const list: Array<[FontDefinition, FontColor, string]> = [
    [definitionYosterIsland10, FontColor.Bright, tilesYosterIsland10Bright],
    [definitionYosterIsland10, FontColor.Dark, tilesYosterIsland10Dark],
    [definitionYosterIsland14, FontColor.Bright, tilesYosterIsland14Bright],
    [definitionYosterIsland14, FontColor.Dark, tilesYosterIsland14Dark]
];
export default list;
