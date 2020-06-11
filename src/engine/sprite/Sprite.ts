import PixelOffset from '../core/PixelOffset';
import PixelPosition from '../core/PixelPosition';
import TilePosition from '../core/TilePosition';
import Game from '../Game';
import Action from './Action';
import { ActionType } from './ActionType';
import Animation from './Animation';
import CollisionBox from './CollisionBox';
import { DirectionType } from './DirectionType';

export default class Sprite {
    public readonly actionList: Partial<Record<ActionType, Action>>;
    public readonly collisionOffset: CollisionBox;

    public actionType: ActionType;
    public directionType: DirectionType;

    public position: PixelPosition = new PixelPosition(0, 0);
    public endPosition: PixelPosition = new PixelPosition(0, 0);

    protected actionTimer = 0;
    protected animationIndex = 0;
    protected animationTimer = 0;

    public constructor(
        actionRecord: Partial<Record<ActionType, Action>>,
        collisionOffset: CollisionBox,
        actionType: ActionType = ActionType.Stand,
        directionType: DirectionType = DirectionType.Down
    ) {
        if (Object.keys(actionRecord).length === 0) {
            throw new Error('There must be at least one actionType.');
        }

        this.actionList = actionRecord;
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
        // Cannot set actionType while moving
        if (this.position.x !== this.endPosition.x || this.position.y !== this.endPosition.y) {
            return;
        }

        if (this.actionList[actionType] === undefined) {
            throw new Error('Invalid actionType type');
        }

        if (this.getAction().directionAnimationList[directionType] === undefined) {
            throw new Error('Invalid directionType type');
        }

        this.actionType = actionType;
        this.directionType = directionType;
        this.actionTimer = 0;
        this.animationIndex = 0;
        this.animationTimer = 0;

        // Set destination coordinates based on directionType
        if (this.actionType !== ActionType.Stand) {
            switch (directionType) {
                case DirectionType.Up:
                    this.endPosition.y -= Game.TILE_SIZE.height;
                    break;
                case DirectionType.Down:
                    this.endPosition.y += Game.TILE_SIZE.height;
                    break;
                case DirectionType.Left:
                    this.endPosition.x -= Game.TILE_SIZE.width;
                    break;
                case DirectionType.Right:
                    this.endPosition.x += Game.TILE_SIZE.width;
                    break;
            }
        }
    };

    /**
     * Updates the internal sprite timer and the internal X and Y coordinates based on the end coordinates.
     * @param dt
     */
    public update = (dt: number): void => {
        const action = this.getAction();
        const direction = this.getDirection();

        // Update coordinates
        const distance = 16 / (action.duration / dt);

        if (this.position.x > this.endPosition.x) {
            this.position.x -= distance;
        } else if (this.position.x < this.endPosition.x) {
            this.position.x += distance;
        }

        if (this.position.y > this.endPosition.y) {
            this.position.y -= distance;
        } else if (this.position.y < this.endPosition.y) {
            this.position.y += distance;
        }

        // Update animation
        this.actionTimer += dt;
        this.animationTimer += dt;

        // Check if animation index need update
        const tileCoordinates = direction.frameList[this.animationIndex];
        if (this.animationTimer > tileCoordinates.duration && tileCoordinates.duration > 0) {
            this.animationTimer = 0;
            this.animationIndex++;
            if (this.animationIndex >= direction.frameList.length) {
                this.animationIndex = 0;
            }
        }

        // Check if actionType is finished
        if (this.actionTimer >= action.duration) {
            this.setAction(ActionType.Stand, this.directionType);
            this.position.x = this.endPosition.x;
            this.position.y = this.endPosition.y;
        }
    };

    /**
     * Draws the sprite with the given context.
     * @param offset
     * @param context
     */
    public draw = (offset: PixelOffset, context: CanvasRenderingContext2D): void => {
        this.getDirection().frameList[this.animationIndex].tile.draw(
            new PixelPosition(
                offset.x + this.position.x - this.collisionOffset.left,
                offset.y + this.position.y - this.collisionOffset.top
            ),
            context
        );
    };

    /**
     * Converts the internal X and Y to coordinates.
     */
    public getLevelPosition = (): TilePosition => {
        return new TilePosition(
            Math.floor(this.position.x / Game.TILE_SIZE.width),
            Math.floor(this.position.y / Game.TILE_SIZE.height)
        );
    };

    /**
     * Moves the internal X and Y to the given coordinates.
     * @param levelPosition
     */
    public setLevelPosition = (levelPosition: TilePosition): void => {
        this.position.x = levelPosition.x * Game.TILE_SIZE.width;
        this.position.y = levelPosition.y * Game.TILE_SIZE.height;
        this.endPosition.x = this.position.x;
        this.endPosition.y = this.position.y;
    };

    /**
     * Return the current actionType.
     */
    protected getAction = (): Action => {
        return <Action>this.actionList[this.actionType];
    };

    /**
     * Return the current directionType.
     */
    protected getDirection = (): Animation => {
        return this.getAction().directionAnimationList[this.directionType];
    };
}
