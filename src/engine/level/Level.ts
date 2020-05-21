import TileMap from '../TileMap';

export enum LevelTile {
    Wall = -1,
    Void,
    Floor,
    Right,
    Left,
    Up,
    Down,
    OuterUpperRightCorner,
    OuterUpperLeftCorner,
    OuterLowerRightCorner,
    OuterLowerLeftCorner,
    InnerUpperRightCorner,
    InnerUpperLeftCorner,
    InnerLowerRightCorner,
    InnerLowerLeftCorner,
    Destination
}

export default class Level {
    src: string;
    tileMap: TileMap;

    levelMap: Array<Array<LevelTile>> = [[]];
    playerPosition: Array<number> = [];
    boxPositionList: Array<Array<number>> = [];
    destinationPositionList: Array<Array<number>> = [];

    constructor(src: string, tileMap: TileMap) {
        this.src = src;
        this.tileMap = tileMap;
    }

    // @ts-ignore
    draw = (context: CanvasRenderingContext2D) => {
        // TODO
    }
}
