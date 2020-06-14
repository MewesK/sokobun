import boxSprites from '../../images/bun.png';
import tilesMoon from '../../images/moon.png';
import destinationSprites from '../../images/pillow.png';
import playerSprites from '../../images/player_base.png';
import tilesShadow from '../../images/shadow.png';
import tilesFloor from '../../images/tiles_floor.png';
import tilesPanel from '../../images/tiles_panel.png';
import tilesPillar from '../../images/tiles_pillar.png';
import tilesVoidBorder from '../../images/tiles_void_border.png';
import tilesVoid from '../../images/tiles_void.png';
import tilesWaterBorder from '../../images/tiles_water_border.png';
import tilesWater from '../../images/tiles_water.png';
import PixelOffset from '../core/PixelOffset';
import PixelPosition from '../core/PixelPosition';
import PixelSize from '../core/PixelSize';
import TileOffset from '../core/TileOffset';
import TilePosition from '../core/TilePosition';
import TileSize from '../core/TileSize';
import { FontColor } from '../font/Font';
import FontLoader from '../font/FontLoader';
import Game from '../Game';
import Panel from '../menu/Panel';
import Text from '../menu/Text';
import ResourceLoader from '../resource/ResourceLoader';
import Scene from '../Scene';
import { ActionType } from '../sprite/ActionType';
import Box from '../sprite/Box';
import Destination from '../sprite/Destination';
import { DirectionType } from '../sprite/DirectionType';
import Player from '../sprite/Player';
import { OffsetTile } from '../tile/OffsetTile';
import { TileType } from '../tile/Tile';
import TileMapLoader from '../tile/TileMapLoader';

export default class Level extends Scene {
    public readonly name: string;
    public readonly tileTypeMap: Array<Array<TileType>> = [[]];
    public readonly playerPosition: TilePosition;
    public readonly boxPositionList: Array<TilePosition>;
    public readonly destinationPositionList: Array<TilePosition>;

    public readonly size: TileSize;

    public fontLoader!: FontLoader;
    public tileMapLoader!: TileMapLoader;

    public levelCanvas!: HTMLCanvasElement;
    public levelContext!: CanvasRenderingContext2D;

    private pausePanel!: Panel;
    private winPanel!: Panel;

    private player!: Player;
    private boxList!: Array<Box>;
    private destinationList!: Array<Destination>;

    private moves = 0;
    private pushes = 0;
    private time = 0;
    private paused = false;
    private won = false;

    private levelBuffered = false;

    constructor(
        name: string,
        tileTypeMap: Array<Array<TileType>>,
        playerCoordinates: TilePosition,
        boxCoordinatesList: Array<TilePosition>,
        destinationCoordinatesList: Array<TilePosition>
    ) {
        super();

        this.name = name;
        this.tileTypeMap = tileTypeMap;
        this.playerPosition = playerCoordinates;
        this.boxPositionList = boxCoordinatesList;
        this.destinationPositionList = destinationCoordinatesList;

        this.size = new TileSize(tileTypeMap[0].length, tileTypeMap.length);
    }

    /**
     * Loads the level.
     * @param _resourceLoader
     * @param tileMapLoader
     * @param fontLoader
     * @param size
     */
    public load = (
        _resourceLoader: ResourceLoader,
        tileMapLoader: TileMapLoader,
        fontLoader: FontLoader,
        size: PixelSize
    ): void => {
        this.fontLoader = fontLoader;
        this.tileMapLoader = tileMapLoader;

        // Panels
        const bigFont = this.fontLoader.get('Yoster Island', 14, FontColor.Bright);
        const smallFont = this.fontLoader.get('Yoster Island', 10, FontColor.Dark);
        this.pausePanel = new Panel(
            this,
            new PixelPosition(0, 0),
            new PixelSize(200, 50),
            true,
            'Pause',
            bigFont,
            this.tileMapLoader.get(tilesPanel)
        );
        this.pausePanel.componentList.push(
            new Text(
                this.pausePanel,
                new PixelPosition(0, 0),
                new PixelSize(smallFont.measure('Press space to unpause').width, smallFont.height),
                true,
                'Press space to unpause',
                smallFont
            )
        );
        this.winPanel = new Panel(
            this,
            new PixelPosition(0, 0),
            new PixelSize(200, 50),
            true,
            'You win!',
            bigFont,
            this.tileMapLoader.get(tilesPanel)
        );
        this.winPanel.componentList.push(
            new Text(
                this.winPanel,
                new PixelPosition(0, 0),
                new PixelSize(smallFont.measure('Press space for the next level').width, smallFont.height),
                true,
                'Press space for the next level',
                smallFont
            )
        );

        // Level canvas
        this.levelCanvas = document.createElement('canvas');
        this.levelCanvas.width = size.width;
        this.levelCanvas.height = size.height;

        // Create level context
        const levelContext = this.levelCanvas.getContext('2d');
        if (levelContext === null) {
            throw new Error('2D context not supported');
        }
        this.levelContext = levelContext;

        // Create sprites and set initial position
        this.player = new Player(this.tileMapLoader.get(playerSprites));
        this.player.setLevelPosition(this.playerPosition);

        this.boxList = this.boxPositionList.map((boxCoordinates) => {
            const box = new Box(this.tileMapLoader.get(boxSprites));
            box.setLevelPosition(boxCoordinates);
            return box;
        });

        this.destinationList = this.destinationPositionList.map((destinationCoordinates) => {
            const destination = new Destination(this.tileMapLoader.get(destinationSprites));
            destination.setLevelPosition(destinationCoordinates);
            return destination;
        });

        // Reset level state
        this.moves = 0;
        this.pushes = 0;
        this.time = 0;
        this.paused = false;
        this.won = false;

        this.levelBuffered = false;
    };

    /**
     * Controls the player based on the user input.
     * @param pressedKey
     * @param lastTime
     */
    public control = (pressedKey: string, lastTime: number): void => {
        let actionType;
        let isMoving = false;
        let isPushing = false;

        switch (pressedKey) {
            case 'KeyW':
            case 'ArrowUp':
                if (this.player.actionType === ActionType.Stand && !this.won && !this.paused) {
                    // Check up
                    actionType = this.controlDirection(DirectionType.Up, new TileOffset(0, -1));
                    isPushing = actionType === ActionType.Push;
                    isMoving = actionType === ActionType.Walk || actionType === ActionType.Push;
                }
                break;
            case 'KeyS':
            case 'ArrowDown':
                if (this.player.actionType === ActionType.Stand && !this.won && !this.paused) {
                    // Check down
                    actionType = this.controlDirection(DirectionType.Down, new TileOffset(0, 1));
                    isPushing = actionType === ActionType.Push;
                    isMoving = actionType === ActionType.Walk || actionType === ActionType.Push;
                }
                break;
            case 'KeyA':
            case 'ArrowLeft':
                if (this.player.actionType === ActionType.Stand && !this.won && !this.paused) {
                    // Check left
                    actionType = this.controlDirection(DirectionType.Left, new TileOffset(-1, 0));
                    isPushing = actionType === ActionType.Push;
                    isMoving = actionType === ActionType.Walk || actionType === ActionType.Push;
                }
                break;
            case 'KeyD':
            case 'ArrowRight':
                if (this.player.actionType === ActionType.Stand && !this.won && !this.paused) {
                    // Check right
                    actionType = this.controlDirection(DirectionType.Right, new TileOffset(1, 0));
                    isPushing = actionType === ActionType.Push;
                    isMoving = actionType === ActionType.Walk || actionType === ActionType.Push;
                }
                break;
            case 'Space':
            case 'Enter':
            case 'Escape':
                // Debounce
                if (lastTime >= 200) {
                    if (this.won) {
                        this.finished = true;
                    } else {
                        this.paused = !this.paused;
                    }
                }

                break;
        }

        if (isMoving) {
            this.moves++;
        }

        if (isPushing) {
            this.pushes++;
        }
    };

    /**
     * Updates the level.
     * @param dt
     */
    public update = (dt: number): void => {
        if (!this.won && !this.paused) {
            this.time += dt;

            // Check win condition
            let boxPosition: TilePosition;
            let destinationPosition: TilePosition;
            this.won = this.boxList
                .map((box) => {
                    boxPosition = box.getLevelPosition();
                    for (let destinationIndex = 0; destinationIndex < this.destinationList.length; destinationIndex++) {
                        destinationPosition = this.destinationList[destinationIndex].getLevelPosition();
                        if (boxPosition.x === destinationPosition.x && boxPosition.y === destinationPosition.y) {
                            return true;
                        }
                    }
                    return false;
                })
                .reduce((won: boolean, isAtDestination) => won && isAtDestination, true);
        }

        // Update sprites
        this.player.update(dt);
        this.boxList.forEach((box) => {
            box.update(dt);
        });
    };

    /**
     * Draws the level buffer and all sprites.
     * @param bufferCanvas
     * @param bufferContext
     */
    public draw = (bufferCanvas: HTMLCanvasElement, bufferContext: CanvasRenderingContext2D): void => {
        const levelSize = new TileSize(
            bufferCanvas.width / Game.TILE_SIZE.width,
            bufferCanvas.height / Game.TILE_SIZE.height
        );
        const screenOffset = new PixelOffset(
            ((levelSize.width - this.size.width) / 2) * Game.TILE_SIZE.width,
            ((levelSize.height - this.size.height + 2) / 2) * Game.TILE_SIZE.height
        );
        const spriteList = [...this.destinationList, ...this.boxList, this.player];

        if (!this.levelBuffered) {
            this.drawLevelToBuffer(levelSize, screenOffset);
            this.levelBuffered = true;
        }

        // Draw level buffer
        bufferContext.imageSmoothingEnabled = false;
        bufferContext.drawImage(this.levelCanvas, 0, 0);

        // Draw shadows
        if (Game.RENDER_SHADOWS) {
            const shadowTileMap = this.tileMapLoader.get(tilesShadow);
            spriteList.forEach((sprite) => {
                shadowTileMap
                    .get(new TilePosition(0, 0))
                    .draw(
                        new PixelPosition(screenOffset.x + sprite.position.x, screenOffset.y + sprite.position.y),
                        bufferContext
                    );
            });
        }

        // Draw sprites
        spriteList.forEach((sprite) => {
            sprite.draw(screenOffset, bufferContext);
        });

        // Draw status
        this.fontLoader
            .get('Yoster Island', 10, FontColor.Bright)
            .draw('Moves', new PixelPosition(10, 256), bufferContext)
            .draw(String(this.moves), new PixelPosition(64, 256), bufferContext)
            .draw('Pushes', new PixelPosition(10, 270), bufferContext)
            .draw(String(this.pushes), new PixelPosition(64, 270), bufferContext)
            .draw('Time', new PixelPosition(10, 284), bufferContext)
            .draw(String(Math.floor(this.time)), new PixelPosition(64, 284), bufferContext);

        if (this.won) {
            // Draw panel
            this.winPanel.draw(bufferContext);
        } else if (this.paused) {
            // Draw panel
            this.pausePanel.draw(bufferContext);
        }
    };

    /**
     * Controls the player for the given directionType.
     * @param directionType
     * @param offset
     */
    private controlDirection = (directionType: DirectionType, offset: TileOffset): ActionType => {
        let actionType: ActionType | undefined = undefined;

        const playerPosition = this.player.getLevelPosition();
        const neighborPosition = new TilePosition(playerPosition.x + offset.x, playerPosition.y + offset.y);

        // Check if neighboring tile of player is floor
        if (this.isTileTypeAt(neighborPosition, TileType.Floor)) {
            // Check if neighboring tile contains a box
            const box = this.isBoxAt(neighborPosition);
            if (box !== undefined) {
                const nextNeighborPosition = new TilePosition(
                    neighborPosition.x + offset.x,
                    neighborPosition.y + offset.y
                );

                // Check if next neighboring tile is floor or contains another box
                if (
                    this.isTileTypeAt(nextNeighborPosition, TileType.Floor) &&
                    this.isBoxAt(nextNeighborPosition) === undefined
                ) {
                    // Can push
                    actionType = ActionType.Push;
                    box.setAction(ActionType.Walk, directionType);
                } else {
                    // Cannot push
                    actionType = ActionType.Stand;
                }
            } else {
                // Can walk
                actionType = ActionType.Walk;
            }
        } else {
            // Cannot walk
            actionType = ActionType.Stand;
        }

        this.player.setAction(actionType, directionType);

        return actionType;
    };

    /**
     * Draws the level to the level buffer.
     * @param size
     * @param offset
     */
    private drawLevelToBuffer = (size: TileSize, offset: PixelOffset): void => {
        // Clear with background color
        this.levelContext.imageSmoothingEnabled = false;
        this.levelContext.fillStyle = Game.BACKGROUND_COLOR;
        this.levelContext.fillRect(0, 0, this.levelContext.canvas.width, this.levelContext.canvas.height);

        // Draw background
        const voidTileMap = this.tileMapLoader.get(tilesVoid);
        for (let rowIndex = 0; rowIndex < size.height; rowIndex++) {
            for (let columnIndex = 0; columnIndex < size.width; columnIndex++) {
                const tile = voidTileMap.getRandomTile();
                tile.draw(
                    new PixelPosition(columnIndex * tile.size.width, rowIndex * tile.size.height),
                    this.levelContext
                );
            }
        }

        // Draw moon
        const moonTile = this.tileMapLoader.get(tilesMoon).get(new TilePosition(0, 0));
        moonTile.draw(Game.MOON_POSITION, this.levelContext);

        // Draw level
        const floorTileMap = this.tileMapLoader.get(tilesFloor);
        const waterTileMap = this.tileMapLoader.get(tilesWater);
        const pillarTileMap = this.tileMapLoader.get(tilesPillar);
        const voidBorderTileMap = this.tileMapLoader.get(tilesVoidBorder);
        const waterBorderTileMap = this.tileMapLoader.get(tilesWaterBorder);

        let pattern: string;
        let offsetTileList: Array<OffsetTile>;
        for (let y = 0; y < this.size.height; y++) {
            for (let x = 0; x < this.size.width; x++) {
                offsetTileList = [];

                switch (this.tileTypeMap[y][x]) {
                    case TileType.Floor:
                        // Add random floor tile
                        offsetTileList.push(<OffsetTile>floorTileMap.getRandomTile());

                        // Add pillar
                        if (Game.RENDER_PILLARS) {
                            // Create pattern
                            pattern = this.getPatternAt(new TilePosition(x, y), TileType.Floor);

                            // Add pillar tiles
                            offsetTileList.push(
                                ...(pattern.match(/......0./) ? pillarTileMap.getOffsetTileListByPattern(pattern) : [])
                            );
                        }

                        break;
                    case TileType.Void:
                        // Create pattern
                        pattern = this.getPatternAt(new TilePosition(x, y), TileType.Floor);

                        // Add border tiles
                        offsetTileList.push(
                            ...(pattern !== '00000000' ? voidBorderTileMap.getOffsetTileListByPattern(pattern) : [])
                        );
                        break;
                    case TileType.Water:
                        // Create pattern
                        pattern = this.getPatternAt(new TilePosition(x, y), TileType.Floor);

                        // Add tiles
                        offsetTileList.push(
                            // Add random water tile if no border tiles exists or default tile otherwise
                            <OffsetTile>(
                                (pattern === '00000000'
                                    ? waterTileMap.getRandomTile()
                                    : waterTileMap.get(new TilePosition(0, 0)))
                            ),
                            // Add border tiles
                            ...(pattern !== '00000000' ? waterBorderTileMap.getOffsetTileListByPattern(pattern) : [])
                        );
                        break;
                }

                // Draw tiles
                offsetTileList.forEach((offsetTile) => {
                    if (!offsetTile.offset) {
                        offsetTile.offset = new PixelOffset(0, 0);
                    }
                    offsetTile.draw(
                        new PixelPosition(
                            offsetTile.offset.x + offset.x + x * Game.TILE_SIZE.width,
                            offsetTile.offset.y + offset.y + y * Game.TILE_SIZE.height
                        ),
                        this.levelContext
                    );
                });
            }
        }
    };

    /**
     * Returns a pattern describing the surroundings of the given coordinates.
     * @param position
     * @param tileType
     */
    public getPatternAt = (position: TilePosition, tileType: TileType): string => {
        // Check all 8 neighboring cells and create pattern describing if they have the given tile type
        return [
            new TilePosition(position.x - 1, position.y - 1),
            new TilePosition(position.x, position.y - 1),
            new TilePosition(position.x + 1, position.y - 1),
            new TilePosition(position.x - 1, position.y),
            new TilePosition(position.x + 1, position.y),
            new TilePosition(position.x - 1, position.y + 1),
            new TilePosition(position.x, position.y + 1),
            new TilePosition(position.x + 1, position.y + 1)
        ]
            .map((neighborPosition) => this.isTileTypeAt(neighborPosition, tileType))
            .reduce((pattern: string, isGivenTileType: boolean) => pattern.concat(isGivenTileType ? '1' : '0'), '');
    };

    /**
     * Checks if a box is at the given coordinates.
     * @param position
     */
    private isBoxAt = (position: TilePosition): Box | undefined => {
        let boxPosition: TilePosition;
        for (let boxIndex = 0; boxIndex < this.boxList.length; boxIndex++) {
            boxPosition = this.boxList[boxIndex].getLevelPosition();
            if (boxPosition.x === position.x && boxPosition.y === position.y) {
                return this.boxList[boxIndex];
            }
        }
        return undefined;
    };

    /**
     * Checks if the given tile type is at the given coordinates.
     * @param position
     * @param tileType
     */
    public isTileTypeAt = (position: TilePosition, tileType: TileType): boolean => {
        // Check if coordinates are valid
        if (
            position.x < 0 ||
            position.x >= this.tileTypeMap[0].length ||
            position.y < 0 ||
            position.y >= this.tileTypeMap.length
        ) {
            return false;
        }

        // Check if cell has the given tile type
        return this.tileTypeMap[position.y][position.x] === tileType;
    };
}
