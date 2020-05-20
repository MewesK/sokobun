import Action from './Action';
import Sprite from './Sprite';
import TileMap from './TileMap';

export default class Bunnie extends Sprite{
    constructor(spriteMap: TileMap) {
        super({
            stand: new Action({
                up: [spriteMap.get(2, 0)],
                down: [spriteMap.get(3, 0)],
                left: [spriteMap.get(0, 0)],
                right: [spriteMap.get(1, 0)]
            }, 1),
            walk: new Action({
                up: [
                    spriteMap.get(2, 1),
                    spriteMap.get(2, 0),
                    spriteMap.get(2, 2),
                    spriteMap.get(2, 0)
                ],
                down: [
                    spriteMap.get(3, 1),
                    spriteMap.get(3, 0),
                    spriteMap.get(3, 2),
                    spriteMap.get(3, 0)
                ],
                left: [
                    spriteMap.get(0, 1),
                    spriteMap.get(0, 0),
                    spriteMap.get(0, 2),
                    spriteMap.get(0, 0)
                ],
                right: [
                    spriteMap.get(1, 1),
                    spriteMap.get(1, 0),
                    spriteMap.get(1, 2),
                    spriteMap.get(1, 0)
                ],
            }, 0.6),
            push: new Action({
                up: [
                    spriteMap.get(2, 3),
                    spriteMap.get(2, 2),
                    spriteMap.get(2, 4),
                    spriteMap.get(2, 2)],
                down: [
                    spriteMap.get(3, 3),
                    spriteMap.get(3, 2),
                    spriteMap.get(3, 4),
                    spriteMap.get(3, 2)],
                left: [
                    spriteMap.get(0, 3),
                    spriteMap.get(0, 2),
                    spriteMap.get(0, 4),
                    spriteMap.get(0, 2)],
                right: [
                    spriteMap.get(1, 3),
                    spriteMap.get(1, 2),
                    spriteMap.get(1, 4),
                    spriteMap.get(1, 2)
                ],
            }, 0.6)
        });
        this.setAction('stand');
        this.setDirection('down');
    }
}