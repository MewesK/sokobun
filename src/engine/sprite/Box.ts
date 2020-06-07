import TileMap from '../tile/TileMap';
import CollisionBox from './CollisionBox';
import Sprite, { Action, ActionType, Direction, DirectionType } from './Sprite';

export default class Box extends Sprite {
    public constructor(tileMap: TileMap) {
        super(
            tileMap,
            {
                [ActionType.Stand]: new Action({
                    [DirectionType.Up]: new Direction([[0, 0, 0.0]], 0.0),
                    [DirectionType.Down]: new Direction([[0, 0, 0.0]], 0.0),
                    [DirectionType.Left]: new Direction([[0, 0, 0.0]], 0.0),
                    [DirectionType.Right]: new Direction([[0, 0, 0.0]], 0.0)
                }),
                [ActionType.Walk]: new Action({
                    [DirectionType.Up]: new Direction([[0, 0, 0.0]], 0.5),
                    [DirectionType.Down]: new Direction([[0, 0, 0.0]], 0.5),
                    [DirectionType.Left]: new Direction([[0, 0, 0.0]], 0.5),
                    [DirectionType.Right]: new Direction([[0, 0, 0.0]], 0.5)
                })
            },
            new CollisionBox(0, 16, 4, 16)
        );
    }
}
