import Game from '../Game';
import TileMap from '../tile/TileMap';
import CollisionBox from './CollisionBox';

export enum ActionType {
    Walk,
    Push,
    Stand
}

export class Action {
    public readonly directionRecord: Record<DirectionType, Direction>;

    public constructor(directionList: Record<DirectionType, Direction>) {
        if (Object.keys(directionList).length === 0) {
            throw new Error('There must be at least one direction.');
        }

        this.directionRecord = directionList;
    }
}

export enum DirectionType {
    Up,
    Down,
    Left,
    Right
}

export class Direction {
    public readonly tileCoordinatesList: Array<[number, number, number]>;
    public readonly duration: number;

    public constructor(tileCoordinatesList: Array<[number, number, number]>, duration: number) {
        if (tileCoordinatesList.length === 0) {
            throw new Error('There must be at least one pair of tile coordinates.');
        }

        this.tileCoordinatesList = tileCoordinatesList;
        this.duration = duration;
    }
}

export default class Sprite {
    public readonly tileMap: TileMap;
    public readonly actionRecord: Partial<Record<ActionType, Action>>;
    public readonly collisionOffset: CollisionBox;

    public actionType: ActionType;
    public directionType: DirectionType;

    public x = 0;
    public y = 0;
    public endX = 0;
    public endY = 0;

    protected actionTimer = 0;
    protected animationIndex = 0;
    protected animationTimer = 0;

    public constructor(
        tileMap: TileMap,
        actionRecord: Partial<Record<ActionType, Action>>,
        collisionOffset: CollisionBox,
        actionType: ActionType = ActionType.Stand,
        directionType: DirectionType = DirectionType.Down
    ) {
        if (Object.keys(actionRecord).length === 0) {
            throw new Error('There must be at least one action.');
        }

        this.tileMap = tileMap;
        this.actionRecord = actionRecord;
        this.collisionOffset = collisionOffset;
        this.actionType = actionType;
        this.directionType = directionType;
    }

    /**
     * Sets the current actionType.
     * @param actionType
     * @param directionType
     */
    public setAction = (actionType: ActionType, directionType: DirectionType): void => {
        // Cannot set action while moving
        if (this.x !== this.endX || this.y !== this.endY) {
            return;
        }

        if (this.actionRecord[actionType] === undefined) {
            throw new Error('Invalid action type');
        }

        if (this.getAction().directionRecord[directionType] === undefined) {
            throw new Error('Invalid direction type');
        }

        this.actionType = actionType;
        this.directionType = directionType;
        this.actionTimer = 0;
        this.animationIndex = 0;
        this.animationTimer = 0;

        // Set destination coordinates based on direction
        if (this.actionType !== ActionType.Stand) {
            switch (directionType) {
                case DirectionType.Up:
                    this.endY -= Game.TILE_HEIGHT;
                    break;
                case DirectionType.Down:
                    this.endY += Game.TILE_HEIGHT;
                    break;
                case DirectionType.Left:
                    this.endX -= Game.TILE_WIDTH;
                    break;
                case DirectionType.Right:
                    this.endX += Game.TILE_WIDTH;
                    break;
            }
        }
    };

    /**
     * Updates the internal sprite timer and the internal X and Y coordinates based on the end coordinates.
     * @param dt
     */
    public update = (dt: number): void => {
        // Update coordinates
        const distance = 16 / (this.getDirection().duration / dt);

        if (this.x > this.endX) {
            this.x -= distance;
        } else if (this.x < this.endX) {
            this.x += distance;
        }

        if (this.y > this.endY) {
            this.y -= distance;
        } else if (this.y < this.endY) {
            this.y += distance;
        }

        // Update animation
        this.actionTimer += dt;
        this.animationTimer += dt;

        // Check if animation index need update
        const direction = this.getDirection();
        const tileCoordinates = direction.tileCoordinatesList[this.animationIndex];
        if (this.animationTimer > tileCoordinates[2] && tileCoordinates[2] > 0) {
            this.animationTimer = 0;
            this.animationIndex++;
            if (this.animationIndex >= direction.tileCoordinatesList.length) {
                this.animationIndex = 0;
            }
        }

        // Check if action is finished
        if (this.actionTimer >= direction.duration) {
            this.setAction(ActionType.Stand, this.directionType);
            this.x = this.endX;
            this.y = this.endY;
        }
    };

    /**
     * Draws the sprite with the given context.
     * @param xOffset
     * @param yOffset
     * @param context
     */
    public draw = (xOffset: number, yOffset: number, context: CanvasRenderingContext2D): void => {
        const tileCoordinates = this.getDirection().tileCoordinatesList[this.animationIndex];
        const tile = this.tileMap.get(tileCoordinates[0], tileCoordinates[1]);
        tile.draw(xOffset + this.x - this.collisionOffset.left, yOffset + this.y - this.collisionOffset.top, context);
    };

    /**
     * Converts the internal X and Y to coordinates.
     */
    public getCoordinates = (): [number, number] => {
        return [Math.floor(this.x / Game.TILE_WIDTH), Math.floor(this.y / Game.TILE_HEIGHT)];
    };

    /**
     * Moves the internal X and Y to the given coordinates.
     * @param columnIndex
     * @param rowIndex
     */
    public setCoordinates = (columnIndex: number, rowIndex: number): void => {
        this.x = columnIndex * Game.TILE_WIDTH;
        this.y = rowIndex * Game.TILE_HEIGHT;
        this.endX = this.x;
        this.endY = this.y;
    };

    /**
     * Return the current action.
     */
    protected getAction = (): Action => {
        return <Action>this.actionRecord[this.actionType];
    };

    /**
     * Return the current direction.
     */
    protected getDirection = (): Direction => {
        return this.getAction().directionRecord[this.directionType];
    };
}
