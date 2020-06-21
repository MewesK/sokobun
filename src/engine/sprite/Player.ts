import TilePosition from '../core/TilePosition';
import TileMap from '../tile/TileMap';
import Action from './Action';
import { ActionType } from './ActionType';
import Animation from './Animation';
import CollisionBox from './CollisionBox';
import { DirectionType } from './DirectionType';
import Frame from './Frame';
import Sprite from './Sprite';
import Game from "../Game";

export default class Player extends Sprite {
    public constructor(tileMap: TileMap) {
        super(
            {
                [ActionType.Stand]: new Action(
                    {
                        [DirectionType.Up]: new Animation([new Frame(tileMap.get(new TilePosition(0, 2)), 0.0)]),
                        [DirectionType.Down]: new Animation([new Frame(tileMap.get(new TilePosition(0, 3)), 0.0)]),
                        [DirectionType.Left]: new Animation([new Frame(tileMap.get(new TilePosition(0, 0)), 0.0)]),
                        [DirectionType.Right]: new Animation([new Frame(tileMap.get(new TilePosition(0, 1)), 0.0)])
                    },
                    0.0
                ),
                [ActionType.Walk]: new Action(
                    {
                        [DirectionType.Up]: new Animation([
                            new Frame(tileMap.get(new TilePosition(1, 2)), 0.1 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(0, 2)), 0.05 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(2, 2)), 0.1 * Game.PLAYER_SPEED)
                        ]),
                        [DirectionType.Down]: new Animation([
                            new Frame(tileMap.get(new TilePosition(1, 3)), 0.1 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(0, 3)), 0.05 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(2, 3)), 0.1 * Game.PLAYER_SPEED)
                        ]),
                        [DirectionType.Left]: new Animation([
                            new Frame(tileMap.get(new TilePosition(1, 0)), 0.1 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(0, 0)), 0.05 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(2, 0)), 0.1 * Game.PLAYER_SPEED)
                        ]),
                        [DirectionType.Right]: new Animation([
                            new Frame(tileMap.get(new TilePosition(1, 1)), 0.1 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(0, 1)), 0.05 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(2, 1)), 0.1 * Game.PLAYER_SPEED)
                        ])
                    },
                    0.25 * Game.PLAYER_SPEED
                ),
                [ActionType.Push]: new Action(
                    {
                        [DirectionType.Up]: new Animation([
                            new Frame(tileMap.get(new TilePosition(4, 2)), 0.15 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(3, 2)), 0.1 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(5, 2)), 0.15 * Game.PLAYER_SPEED)
                        ]),
                        [DirectionType.Down]: new Animation([
                            new Frame(tileMap.get(new TilePosition(4, 3)), 0.15 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(3, 3)), 0.1 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(5, 3)), 0.15 * Game.PLAYER_SPEED)
                        ]),
                        [DirectionType.Left]: new Animation([
                            new Frame(tileMap.get(new TilePosition(4, 0)), 0.15 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(3, 0)), 0.1 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(5, 0)), 0.15 * Game.PLAYER_SPEED)
                        ]),
                        [DirectionType.Right]: new Animation([
                            new Frame(tileMap.get(new TilePosition(4, 1)), 0.15 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(3, 1)), 0.1 * Game.PLAYER_SPEED),
                            new Frame(tileMap.get(new TilePosition(5, 1)), 0.15 * Game.PLAYER_SPEED)
                        ])
                    },
                    0.4 * Game.PLAYER_SPEED
                )
            },
            new CollisionBox(1, 18, 12, 24)
        );
    }
}
