import Tile from './Tile';

export enum Direction {
    Up ,
    Down,
    Left,
    Right,
}

export class Action {
    directionList: Record<Direction, Array<Tile>>;
    duration: number;

    constructor(directionList: Record<Direction, Array<Tile>>, duration: number) {
        if (Object.keys(directionList).length === 0) {
            throw new Error('There must be at least one direction.');
        }

        this.directionList = directionList;
        this.duration = duration;
    }
}

export default class Sprite {
    actionList: Record<string, Action>;

    x: number;
    y: number;
    action: string;
    direction: Direction;
    timer: number;

    constructor(actionList: Record<string, Action>, action: string, direction: Direction) {
        if (Object.keys(actionList).length === 0) {
            throw new Error('There must be at least one action.');
        }

        this.actionList = actionList;
        this.action = action;
        this.direction = direction;

        this.x = 0;
        this.y = 0;
        this.timer = 0;
    }

    setAction = (name: string): void => {
        if (this.action === name) {
            return;
        }

        if (this.actionList[name] === undefined) {
            throw new Error('Invalid action');
        }

        this.timer = 0;
        this.action = name;
    };

    setDirection = (direction: Direction): void => {
        if (this.direction === direction) {
            return;
        }

        this.timer = 0;
        this.direction = direction;
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
            tile.resource.resource,
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
                case Direction.Down:
                    y = this.y + Math.round(dt * speed)
                    if (y + tile.height * 2 <= context.canvas.height) {
                        this.y = y;
                    }
                    break;
                case Direction.Up:
                    y = this.y - Math.round(dt * speed)
                    if (y >= 0) {
                        this.y = y;
                    }
                    break;
                case Direction.Left:
                    x = this.x - Math.round(dt * speed)
                    if (x >= 0) {
                        this.x = x;
                    }
                    break;
                case Direction.Right:
                    x = this.x + Math.round(dt * speed)
                    if (x + tile.width * 2 <= context.canvas.width) {
                        this.x = x;
                    }
                    break;
            }
        }
    }
}