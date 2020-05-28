import Tile from '../tile/Tile';
import Level from '../level/Level';
import TileMap from '../tile/TileMap';
import CollisionBox from '../CollisionBox';

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
    protected static readonly SPEED = 40;

    protected readonly tileMap: TileMap;
    protected readonly actionRecord: Record<ActionType, Action>;
    protected readonly collisionOffset: CollisionBox;

    public actionType: ActionType;
    public directionType: DirectionType;

    protected x: number = 0;
    protected y: number = 0;

    protected actionTimer: number = 0;
    protected animationIndex: number = 0;
    protected animationTimer: number = 0;

    public constructor(
        tileMap: TileMap,
        actionRecord: Record<ActionType, Action>,
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
     */
    public setAction = (actionType: ActionType): void => {
        if (this.actionType === actionType) {
            return;
        }

        if (this.actionRecord[actionType] === undefined) {
            throw new Error('Invalid action type');
        }

        this.actionType = actionType;
        this.actionTimer = 0;
        this.animationIndex = 0;
        this.animationTimer = 0;
    };

    /**
     * Sets the directionType.
     * @param directionType
     */
    public setDirection = (directionType: DirectionType): void => {
        if (this.directionType === directionType) {
            return;
        }

        if (this.getAction().directionRecord[directionType] === undefined) {
            throw new Error('Invalid direction type');
        }

        this.directionType = directionType;
        this.actionTimer = 0;
        this.animationIndex = 0;
        this.animationTimer = 0;
    };

    /**
     * Updates the internal sprite timer.
     * @param dt
     */
    public update = (dt: number): void => {
        this.actionTimer += dt;
        this.animationTimer += dt;

        // Check if animation index need update
        const direction = this.getDirection();
        const tileCoordinates = direction.tileCoordinatesList[this.animationIndex];
        if (this.animationTimer > tileCoordinates[2]) {
            this.animationTimer = 0;
            this.animationIndex++;
            if (this.animationIndex >= direction.tileCoordinatesList.length) {
                this.animationIndex = 0;
            }
        }

        // Check if action is finished
        if (this.actionTimer >= direction.duration) {
            this.actionTimer = 0;
            this.animationTimer = 0;
            this.animationIndex = 0;
            this.actionType = ActionType.Stand;
            this.x = Math.round((this.x - this.collisionOffset.left) / 16) * 16 + this.collisionOffset.left;
            this.y = Math.round((this.y - this.collisionOffset.top) / 16) * 16 + this.collisionOffset.top;
        }
    };

    /**
     * Draws the sprite with the given context.
     * @param xOffset
     * @param yOffset
     * @param context
     */
    public draw = (xOffset: number, yOffset: number, context: CanvasRenderingContext2D): void => {
        const tile = this.getTile();
        context.imageSmoothingEnabled = false;
        context.drawImage(
            tile.resource.data,
            tile.x,
            tile.y,
            tile.width,
            tile.height,
            xOffset + this.x,
            yOffset + this.y,
            tile.width,
            tile.height
        );
    };

    /**
     * Updates the internal X and Y coordinates based on the current direction type.
     * @param dt
     * @param context
     * @param level
     */
    public move = (dt: number, context: CanvasRenderingContext2D, level: Level): void => {
        if (this.actionType !== ActionType.Stand) {
            const distance = 16 / (this.getDirection().duration / dt);

            let x, y;
            switch (this.directionType) {
                case DirectionType.Left:
                    x = this.x - distance;
                    if (!level.intersects(this.createCollisionBox(x, this.y), context)) {
                        this.x = x;
                    }
                    break;
                case DirectionType.Right:
                    x = this.x + distance;
                    if (!level.intersects(this.createCollisionBox(x, this.y), context)) {
                        this.x = x;
                    }
                    break;
                case DirectionType.Up:
                    y = this.y - distance;
                    if (!level.intersects(this.createCollisionBox(this.x, y), context)) {
                        this.y = y;
                    }
                    break;
                case DirectionType.Down:
                    y = this.y + distance;
                    if (!level.intersects(this.createCollisionBox(this.x, y), context)) {
                        this.y = y;
                    }
                    break;
            }
        }
    };

    /**
     * Moves the internal X and Y to the given coordinates.
     * @param x
     * @param y
     */
    public moveTo = (x: number, y: number): void => {
        this.x = x - this.collisionOffset.left;
        this.y = y - this.collisionOffset.top;
    };

    /**
     * Calculates the collision box based on the given coordinates.
     * @param x
     * @param y
     */
    protected createCollisionBox = (x: number, y: number): CollisionBox => {
        return new CollisionBox(
            x + this.collisionOffset.left,
            x + this.collisionOffset.right,
            y + this.collisionOffset.top,
            y + this.collisionOffset.bottom
        );
    };

    /**
     * Return the current action.
     */
    protected getAction = (): Action => {
        return this.actionRecord[this.actionType];
    };

    /**
     * Return the current direction.
     */
    protected getDirection = (): Direction => {
        return this.getAction().directionRecord[this.directionType];
    };

    /**
     * Returns the current tile to draw.
     */
    protected getTile = (): Tile => {
        const tileCoordinates = this.getDirection().tileCoordinatesList[this.animationIndex];
        return this.tileMap.get(tileCoordinates[0], tileCoordinates[1]);
    };
}
