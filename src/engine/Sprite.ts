import Tile from './Tile';
import Action from './Action';

export default class Sprite {
    actionList: Record<string, Action>;

    x: number;
    y: number;
    action: string;
    direction: string;
    timer: number;

    constructor(actionList: Record<string, Action>) {
        if (Object.keys(actionList).length === 0) {
            throw new Error('There must be at least one action.');
        }

        this.actionList = actionList;

        this.x = 0;
        this.y = 0;
        this.action = Object.keys(this.actionList)[0];
        this.direction = Object.keys(this.actionList[this.action].directionList)[0];
        this.timer = 0;
    }

    setAction = (name: string): void => {
        if (this.action === name) {
            return;
        }

        if (this.actionList[name] === undefined) {
            throw new Error('Invalid direction');
        }

        this.timer = 0;
        this.action = name;
    };

    setDirection = (name: string): void => {
        if (this.direction === name) {
            return;
        }

        if (this.actionList[this.action].directionList[name] === undefined) {
            throw new Error('Invalid direction');
        }

        this.timer = 0;
        this.direction = name;
    };

    update = (dt: number) => {
        this.timer += dt;
        if (this.timer >= this.actionList[this.action].duration) {
            this.timer = 0;
        }
    }

    getTile = (): Tile => {
        const action = this.actionList[this.action];
        const direction = action.directionList[this.direction];
        const index = Math.floor(this.timer / (action.duration / direction.length));
        return direction[index];
    }

    draw = (context: CanvasRenderingContext2D) => {
        const tile = this.getTile();

        context.drawImage(
            tile.resource.image,
            tile.x,
            tile.y,
            tile.width,
            tile.height,
            this.x,
            this.y,
            tile.width * 2,
            tile.height * 2
        );
    }

    move = (dt: number, context: CanvasRenderingContext2D) => {
        const speed = 150;
        const tile = this.getTile();

        if (this.action === 'walk') {
            let x, y;
            switch (this.direction) {
                case 'down':
                    y = this.y + Math.round(dt * speed)
                    if (y + tile.height * 2 <= context.canvas.height) {
                        this.y = y;
                    }
                    break;
                case 'up':
                    y = this.y - Math.round(dt * speed)
                    if (y >= 0) {
                        this.y = y;
                    }
                    break;
                case 'left':
                    x = this.x - Math.round(dt * speed)
                    if (x >= 0) {
                        this.x = x;
                    }
                    break;
                case 'right':
                    x = this.x + Math.round(dt * speed)
                    if (x + tile.width * 2 <= context.canvas.width) {
                        this.x = x;
                    }
                    break;
            }
        }
    }
}