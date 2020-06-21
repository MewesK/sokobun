import TilePosition from '../core/TilePosition';
import TileMap from '../tile/TileMap';
import Action from './Action';
import { ActionType } from './ActionType';
import Animation from './Animation';
import CollisionBox from './CollisionBox';
import { DirectionType } from './DirectionType';
import Frame from './Frame';
import Sprite from './Sprite';

export default class Box extends Sprite {
    public constructor(tileMap: TileMap) {
        super(
            {
                [ActionType.Stand]: new Action(
                    {
                        [DirectionType.Up]: new Animation([new Frame(tileMap.get(new TilePosition(0, 0)), 0.0)]),
                        [DirectionType.Down]: new Animation([new Frame(tileMap.get(new TilePosition(0, 0)), 0.0)]),
                        [DirectionType.Left]: new Animation([new Frame(tileMap.get(new TilePosition(0, 0)), 0.0)]),
                        [DirectionType.Right]: new Animation([new Frame(tileMap.get(new TilePosition(0, 0)), 0.0)])
                    },
                    0.0
                ),
                [ActionType.Walk]: new Action(
                    {
                        [DirectionType.Up]: new Animation([new Frame(tileMap.get(new TilePosition(0, 0)), 0.0)]),
                        [DirectionType.Down]: new Animation([new Frame(tileMap.get(new TilePosition(0, 0)), 0.0)]),
                        [DirectionType.Left]: new Animation([new Frame(tileMap.get(new TilePosition(0, 0)), 0.0)]),
                        [DirectionType.Right]: new Animation([new Frame(tileMap.get(new TilePosition(0, 0)), 0.0)])
                    },
                    0.4
                )
            },
            new CollisionBox(0, 16, 4, 16)
        );
    }
}
