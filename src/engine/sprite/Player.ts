import Sprite, { Action, ActionType, Direction, DirectionType } from './Sprite';
import TileMap from '../tile/TileMap';
import CollisionBox from './CollisionBox';

export default class Player extends Sprite {
    public constructor(tileMap: TileMap) {
        super(
            tileMap,
            {
                [ActionType.Stand]: new Action({
                    [DirectionType.Up]: new Direction([[2, 0, 0.0]], 0.0),
                    [DirectionType.Down]: new Direction([[3, 0, 0.0]], 0.0),
                    [DirectionType.Left]: new Direction([[0, 0, 0.0]], 0.0),
                    [DirectionType.Right]: new Direction([[1, 0, 0.0]], 0.0)
                }),
                [ActionType.Walk]: new Action({
                    [DirectionType.Up]: new Direction(
                        [
                            [2, 1, 0.1],
                            [2, 0, 0.1],
                            [2, 2, 0.1],
                            [2, 0, 0.1]
                        ],
                        0.4
                    ),
                    [DirectionType.Down]: new Direction(
                        [
                            [3, 1, 0.1],
                            [3, 0, 0.1],
                            [3, 2, 0.1],
                            [3, 0, 0.1]
                        ],
                        0.4
                    ),
                    [DirectionType.Left]: new Direction(
                        [
                            [0, 1, 0.1],
                            [0, 0, 0.1],
                            [0, 2, 0.1],
                            [0, 0, 0.1]
                        ],
                        0.4
                    ),
                    [DirectionType.Right]: new Direction(
                        [
                            [1, 1, 0.1],
                            [1, 0, 0.1],
                            [1, 2, 0.1],
                            [1, 0, 0.1]
                        ],
                        0.4
                    )
                }),
                [ActionType.Push]: new Action({
                    [DirectionType.Up]: new Direction(
                        [
                            [2, 3, 0.1],
                            [2, 2, 0.1],
                            [2, 4, 0.1],
                            [2, 2, 0.1]
                        ],
                        0.4
                    ),
                    [DirectionType.Down]: new Direction(
                        [
                            [3, 3, 0.1],
                            [3, 2, 0.1],
                            [3, 4, 0.1],
                            [3, 2, 0.1]
                        ],
                        0.4
                    ),
                    [DirectionType.Left]: new Direction(
                        [
                            [0, 3, 0.1],
                            [0, 2, 0.1],
                            [0, 4, 0.1],
                            [0, 2, 0.1]
                        ],
                        0.4
                    ),
                    [DirectionType.Right]: new Direction(
                        [
                            [1, 3, 0.1],
                            [1, 2, 0.1],
                            [1, 4, 0.1],
                            [1, 2, 0.1]
                        ],
                        0.4
                    )
                })
            },
            new CollisionBox(0, 16, 20, 32)
        );
    }
}
