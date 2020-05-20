import Resource from './Resource';
import TileMap from './TileMap';

// @ts-ignore
enum LevelTile {
    OuterUpperRightCorner,
    OuterUpperLeftCorner,
    OuterLowerRightCorner,
    OuterLowerLeftCorner,
    InnerUpperRightCorner,
    InnerUpperLeftCorner,
    InnerLowerRightCorner,
    InnerLowerLeftCorner
}

export default class Level {
    // @ts-ignore
    levelMap: Array<Array<Array<number>>>;

    // @ts-ignore
    constructor(resource: Resource, tileMap: TileMap) {
        console.log(resource, tileMap);
    }

    // @ts-ignore
    draw = (context: CanvasRenderingContext2D) => {
        // TODO
    }
}