import TileMap from '../tile/TileMap';
import CollisionBox from './CollisionBox';
import Sprite, { Action, ActionType, Direction, DirectionType } from './Sprite';

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
                            [2, 1, 0.15],
                            [2, 0, 0.1],
                            [2, 2, 0.15],
                            [2, 0, 0.1]
                        ],
                        0.5
                    ),
                    [DirectionType.Down]: new Direction(
                        [
                            [3, 1, 0.15],
                            [3, 0, 0.1],
                            [3, 2, 0.15],
                            [3, 0, 0.1]
                        ],
                        0.5
                    ),
                    [DirectionType.Left]: new Direction(
                        [
                            [0, 1, 0.15],
                            [0, 0, 0.1],
                            [0, 2, 0.15],
                            [0, 0, 0.1]
                        ],
                        0.5
                    ),
                    [DirectionType.Right]: new Direction(
                        [
                            [1, 1, 0.15],
                            [1, 0, 0.1],
                            [1, 2, 0.15],
                            [1, 0, 0.1]
                        ],
                        0.5
                    )
                }),
                [ActionType.Push]: new Action({
                    [DirectionType.Up]: new Direction(
                        [
                            [2, 4, 0.15],
                            [2, 3, 0.1],
                            [2, 5, 0.15],
                            [2, 3, 0.1]
                        ],
                        0.5
                    ),
                    [DirectionType.Down]: new Direction(
                        [
                            [3, 4, 0.15],
                            [3, 3, 0.1],
                            [3, 5, 0.15],
                            [3, 3, 0.1]
                        ],
                        0.5
                    ),
                    [DirectionType.Left]: new Direction(
                        [
                            [0, 4, 0.15],
                            [0, 3, 0.1],
                            [0, 5, 0.15],
                            [0, 3, 0.1]
                        ],
                        0.5
                    ),
                    [DirectionType.Right]: new Direction(
                        [
                            [1, 4, 0.15],
                            [1, 3, 0.1],
                            [1, 5, 0.15],
                            [1, 3, 0.1]
                        ],
                        0.5
                    )
                })
            },
            new CollisionBox(1, 18, 12, 24)
        );
    }
}
