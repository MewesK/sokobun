import { ActionType, DirectionType } from './sprite/Sprite';
import Box from './sprite/Box';
import Destination from './sprite/Destination';
import Level from './level/Level';
import LevelLoader from './level/LevelLoader';
import Player from './sprite/Player';
import PatternTileMap from './tile/PatternTileMap';
import RandomTileMap from './tile/RandomTileMap';
import ResourceLoader from './resource/ResourceLoader';
import Tile, { TileType } from './tile/Tile';
import TileMap from './tile/TileMap';

import boxSprites from '../images/bun.png';
import destinationSprites from '../images/pillow.png';
import playerSprites from '../images/bunnie.png';
import tilesFloor from '../images/tiles_floor.png';
import tilesMoon from '../images/moon.png';
import tilesPillar from '../images/tiles_pillar.png';
import tilesShadow from '../images/shadow.png';
import tilesVoid from '../images/tiles_void.png';
import tilesVoidBorder from '../images/tiles_void_border.png';
import tilesWater from '../images/tiles_water.png';
import tilesWaterBorder from '../images/tiles_water_border.png';
import level from '../levels/2.txt';

export default class Game {
    public static readonly BACKGROUND_COLOR = '#252230';
    public static readonly MOON_OFFSET = 32;
    public static readonly RENDER_PONDS = true;
    public static readonly RENDER_PILLARS = true;
    public static readonly RENDER_SHADOWS = true;
    public static readonly SMOOTHING = false;
    public static readonly TILE_WIDTH = 16;
    public static readonly TILE_HEIGHT = 16;

    // Game state
    private readonly resourceLoader: ResourceLoader = new ResourceLoader();
    private readonly levelLoader: LevelLoader = new LevelLoader();

    private readonly bufferCanvas: HTMLCanvasElement;
    private readonly bufferContext: CanvasRenderingContext2D;
    private readonly levelCanvas: HTMLCanvasElement;
    private readonly levelContext: CanvasRenderingContext2D;
    private readonly outputCanvas: HTMLCanvasElement;
    private readonly outputContext: CanvasRenderingContext2D;

    private floorTileMap!: RandomTileMap;
    private moonTileMap!: TileMap;
    private pillarTileMap!: PatternTileMap;
    private shadowTileMap!: TileMap;
    private voidTileMap!: RandomTileMap;
    private voidBorderTileMap!: PatternTileMap;
    private waterTileMap!: RandomTileMap;
    private waterBorderTileMap!: PatternTileMap;

    // Level state
    private level!: Level;
    private player!: Player;
    private boxList!: Array<Box>;
    private destinationList!: Array<Destination>;

    private moves: number = 0;
    private pushes: number = 0;
    private time: number = 0;
    private won: boolean = false;
    private lost: boolean = false;

    private lastTime: number = 0;
    private levelBuffered: boolean = false;
    private pressedKeyList: Record<string, boolean> = {};

    public constructor(canvas: HTMLCanvasElement, width: number = 400, height: number = 304, zoom: number = 1) {
        // Buffer canvas
        this.bufferCanvas = document.createElement('canvas');
        this.bufferCanvas.width = width;
        this.bufferCanvas.height = height;

        // Level canvas
        this.levelCanvas = document.createElement('canvas');
        this.levelCanvas.width = width;
        this.levelCanvas.height = height;

        // Output canvas
        this.outputCanvas = canvas;
        this.outputCanvas.width = width * zoom;
        this.outputCanvas.height = height * zoom;

        // Create buffer context
        const bufferContext = this.bufferCanvas.getContext('2d');
        if (bufferContext === null) {
            throw new Error('2D context not supported');
        }
        this.bufferContext = bufferContext;

        // Create level context
        const levelContext = this.levelCanvas.getContext('2d');
        if (levelContext === null) {
            throw new Error('2D context not supported');
        }
        this.levelContext = levelContext;

        // Create output context
        const outputContext = this.outputCanvas.getContext('2d');
        if (outputContext === null) {
            throw new Error('2D context not supported');
        }
        this.outputContext = outputContext;

        // Register event listener
        document.addEventListener('keydown', (event: KeyboardEvent): void => {
            this.pressedKeyList[event.code] = true;
        });
        document.addEventListener('keyup', (event: KeyboardEvent): void => {
            this.pressedKeyList[event.code] = false;
        });
    }

    public initialize = () => {
        console.log('Initializing game...');

        // Prepare resources
        this.resourceLoader
            .load([
                playerSprites,
                boxSprites,
                destinationSprites,
                tilesFloor,
                tilesMoon,
                tilesPillar,
                tilesShadow,
                tilesVoid,
                tilesVoidBorder,
                tilesWater,
                tilesWaterBorder,
                level
            ])
            .then(() => {
                // Define tile maps
                this.floorTileMap = new RandomTileMap(
                    TileMap.createTileTable(this.resourceLoader.get(tilesFloor), 2, 2, 0, 0, 16, 16),
                    RandomTileMap.FLOOR_WEIGHTED_TILE_LIST
                );
                this.moonTileMap = new TileMap(
                    TileMap.createTileTable(this.resourceLoader.get(tilesMoon), 1, 1, 0, 0, 32, 32)
                );
                this.shadowTileMap = new TileMap(
                    TileMap.createTileTable(this.resourceLoader.get(tilesShadow), 1, 1, 0, 0, 16, 16)
                );
                this.pillarTileMap = new PatternTileMap(
                    TileMap.createTileTable(this.resourceLoader.get(tilesPillar), 3, 4, 0, 0, 16, 16),
                    PatternTileMap.PILLAR_PATTERN_TILE_DEFINITION_LIST
                );
                this.voidTileMap = new RandomTileMap(
                    TileMap.createTileTable(this.resourceLoader.get(tilesVoid), 3, 2, 0, 0, 16, 16),
                    RandomTileMap.VOID_WEIGHTED_TILE_LIST
                );
                this.voidBorderTileMap = new PatternTileMap(
                    TileMap.createTileTable(this.resourceLoader.get(tilesVoidBorder), 4, 4, 0, 0, 8, 8),
                    PatternTileMap.BORDER_PATTERN_TILE_DEFINITION_LIST
                );
                this.waterTileMap = new RandomTileMap(
                    TileMap.createTileTable(this.resourceLoader.get(tilesWater), 2, 2, 0, 0, 16, 16),
                    RandomTileMap.WATER_WEIGHTED_TILE_LIST
                );
                this.waterBorderTileMap = new PatternTileMap(
                    TileMap.createTileTable(this.resourceLoader.get(tilesWaterBorder), 4, 4, 0, 0, 8, 8),
                    PatternTileMap.BORDER_PATTERN_TILE_DEFINITION_LIST
                );

                // Prepare levels
                this.levelLoader.load([this.resourceLoader.get(level)]).then(() => {
                    this.load(this.levelLoader.get(level));
                });
            });
    };

    /**
     * Load level.
     * @param level
     */
    private load = (level: Level): void => {
        this.level = level;

        // Create sprites and set initial position
        const playerTileMap = new TileMap(
            TileMap.createTileTable(this.resourceLoader.get(playerSprites), 4, 6, 0, 0, 16, 32)
        );
        this.player = new Player(playerTileMap);
        this.player.setCoordinates(this.level.playerPosition[0], this.level.playerPosition[1]);

        const boxTileMap = new TileMap(
            TileMap.createTileTable(this.resourceLoader.get(boxSprites), 1, 1, 0, 0, 16, 16)
        );
        this.boxList = this.level.boxPositionList.map((boxPosition) => {
            let box = new Box(boxTileMap);
            box.setCoordinates(boxPosition[0], boxPosition[1]);
            return box;
        });

        const destinationTileMap = new TileMap(
            TileMap.createTileTable(this.resourceLoader.get(destinationSprites), 1, 1, 0, 0, 16, 16)
        );
        this.destinationList = this.level.destinationPositionList.map((destinationPosition) => {
            let destination = new Destination(destinationTileMap);
            destination.setCoordinates(destinationPosition[0], destinationPosition[1]);
            return destination;
        });

        // Reset level state
        this.moves = 0;
        this.pushes = 0;
        this.time = 0;
        this.won = false;
        this.lost = false;

        this.lastTime = 0;
        this.levelBuffered = false;
        this.pressedKeyList = {};

        // Start game loop
        console.log('Starting game loop...');
        this.lastTime = Date.now();
        this.loop();
    };

    /**
     * The game loop.
     */
    private loop = (): void => {
        let now = Date.now();
        let dt = (now - this.lastTime) / 1000.0;

        if (!this.won && !this.lost) {
            this.time += dt;

            // Set sprite actions
            if (this.player.actionType === ActionType.Stand) {
                this.control();
            }

            // Check win condition
            let destination: Destination;
            this.won = this.boxList
                .map((box) => {
                    for (let destinationIndex = 0; destinationIndex < this.destinationList.length; destinationIndex++) {
                        destination = this.destinationList[destinationIndex];
                        if (box.x === destination.x && box.y === destination.y) {
                            return true;
                        }
                    }
                    return false;
                })
                .reduce((won: boolean, isAtDestination) => won && isAtDestination, true);

            // Check lose condition
            let coordinates: [number, number];
            this.lost = this.boxList
                .map((box) => {
                    coordinates = box.getCoordinates();
                    return (
                        (
                            this.level.isTileTypeAt(coordinates[0] + 1, coordinates[1], TileType.Floor) &&
                            this.isBoxAt(coordinates[0] + 1, coordinates[1]) === undefined &&
                            this.level.isTileTypeAt(coordinates[0] - 1, coordinates[1], TileType.Floor) &&
                            this.isBoxAt(coordinates[0] - 1, coordinates[1]) === undefined
                        ) || (
                            this.level.isTileTypeAt(coordinates[0], coordinates[1] + 1, TileType.Floor) &&
                            this.isBoxAt(coordinates[0], coordinates[1] + 1) === undefined &&
                            this.level.isTileTypeAt(coordinates[0], coordinates[1] - 1, TileType.Floor) &&
                            this.isBoxAt(coordinates[0], coordinates[1] - 1) === undefined
                        )
                    );
                })
                .reduce((lost: boolean, canBePushed) => lost && !canBePushed, true);
        }

        // Update sprites
        this.player.update(dt);
        this.boxList.forEach((box) => {
            box.update(dt);
        });

        // Draw level and sprites
        this.draw();

        this.lastTime = now;
        window.requestAnimationFrame(this.loop);
    };

    /**
     * Controls the player based on the user input.
     */
    private control = () => {
        // Check pressed keys
        Object.keys(this.pressedKeyList).forEach((pressedKey) => {
            if (this.pressedKeyList[pressedKey]) {
                let actionType;
                let isMoving = false;
                let isPushing = false;

                switch (pressedKey) {
                    case 'KeyW':
                    case 'ArrowUp':
                        // Check up
                        actionType = this.controlDirection(DirectionType.Up, 0, -1);
                        isPushing = actionType === ActionType.Push;
                        isMoving = actionType === ActionType.Walk;
                        break;
                    case 'KeyS':
                    case 'ArrowDown':
                        // Check down
                        actionType = this.controlDirection(DirectionType.Down, 0, 1);
                        isPushing = actionType === ActionType.Push;
                        isMoving = actionType === ActionType.Walk;
                        break;
                    case 'KeyA':
                    case 'ArrowLeft':
                        // Check left
                        actionType = this.controlDirection(DirectionType.Left, -1, 0);
                        isPushing = actionType === ActionType.Push;
                        isMoving = actionType === ActionType.Walk;
                        break;
                    case 'KeyD':
                    case 'ArrowRight':
                        // Check right
                        actionType = this.controlDirection(DirectionType.Right, 1, 0);
                        isPushing = actionType === ActionType.Push;
                        isMoving = actionType === ActionType.Walk;
                        break;
                }

                if (isMoving) {
                    this.moves++;
                }
                if (isPushing) {
                    this.pushes++;
                }
            }
        });
    };

    /**
     * Controls the player for the given direction.
     * @param directionType
     * @param columnOffset
     * @param rowOffset
     */
    private controlDirection = (directionType: DirectionType, columnOffset: number, rowOffset: number): ActionType => {
        let actionType: ActionType | undefined = undefined;

        const playerCoordinates = this.player.getCoordinates();
        const neighborColumnIndex = playerCoordinates[0] + columnOffset;
        const neighborRowIndex = playerCoordinates[1] + rowOffset;

        // Check if neighboring tile of player is floor
        if (this.level.isTileTypeAt(neighborColumnIndex, neighborRowIndex, TileType.Floor)) {
            // Check if neighboring tile contains a box
            const box = this.isBoxAt(neighborColumnIndex, neighborRowIndex);
            if (box !== undefined) {
                const nextNeighborColumnIndex = neighborColumnIndex + columnOffset;
                const nextNeighborRowIndex = neighborRowIndex + rowOffset;

                // Check if next neighboring tile is floor or contains another box
                if (
                    this.level.isTileTypeAt(nextNeighborColumnIndex, nextNeighborRowIndex, TileType.Floor) &&
                    this.isBoxAt(nextNeighborColumnIndex, nextNeighborRowIndex) === undefined
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
     * Checks if a box is at the given coordinates.
     * @param columnIndex
     * @param rowIndex
     */
    private isBoxAt = (columnIndex: number, rowIndex: number): Box | undefined => {
        let boxCoordinates: [number, number];
        for (let boxIndex = 0; boxIndex < this.boxList.length; boxIndex++) {
            boxCoordinates = this.boxList[boxIndex].getCoordinates();
            if (boxCoordinates[0] === columnIndex && boxCoordinates[1] === rowIndex) {
                return this.boxList[boxIndex];
            }
        }
        return undefined;
    };

    /**
     * Draws the level buffer and all sprites.
     */
    private draw = (): void => {
        const rowMax = this.bufferCanvas.height / Game.TILE_HEIGHT;
        const columnMax = this.bufferCanvas.width / Game.TILE_WIDTH;
        const xOffset = ((columnMax - this.level.columns) / 2) * Game.TILE_WIDTH;
        const yOffset = ((rowMax - this.level.rows) / 2) * Game.TILE_HEIGHT;
        const spriteList = [...this.destinationList, ...this.boxList, this.player];

        if (!this.levelBuffered) {
            this.drawLevelToBuffer();
            this.levelBuffered = true;
        }

        // Draw level buffer
        this.bufferContext.imageSmoothingEnabled = false;
        this.bufferContext.drawImage(this.levelCanvas, 0, 0);

        // Draw shadows
        if (Game.RENDER_SHADOWS) {
            spriteList.forEach((sprite) => {
                this.shadowTileMap.get(0, 0).draw(xOffset + sprite.x, yOffset + sprite.y, this.bufferContext);
            });
        }

        // Draw sprites
        spriteList.forEach((sprite) => {
            sprite.draw(xOffset, yOffset, this.bufferContext);
        });

        // Draw status
        // TODO: use bitmap fonts
        this.bufferContext.font = '11px serif';
        this.bufferContext.fillStyle = 'white';
        this.bufferContext.textAlign = 'left';
        this.bufferContext.textBaseline = 'middle';
        this.bufferContext.fillText('Moves:', 16, 256);
        this.bufferContext.fillText(String(this.moves), 60, 256);
        this.bufferContext.fillText('Pushes:', 16, 270);
        this.bufferContext.fillText(String(this.pushes), 60, 270);
        this.bufferContext.fillText('Time:', 16, 284);
        this.bufferContext.fillText(String(Math.floor(this.time)), 60, 284);
        if (this.won) {
            this.bufferContext.textAlign = 'center';
            this.bufferContext.fillText(
                'You win!',
                this.bufferContext.canvas.width / 2,
                this.bufferContext.canvas.height / 2
            );
        }
        if (this.lost) {
            this.bufferContext.textAlign = 'center';
            this.bufferContext.fillText(
                'You lose!',
                this.bufferContext.canvas.width / 2,
                this.bufferContext.canvas.height / 2
            );
        }

        // Draw buffer canvas
        this.outputContext.imageSmoothingEnabled = Game.SMOOTHING;
        if (Game.SMOOTHING) {
            this.outputContext.imageSmoothingQuality = 'high';
        }
        this.outputContext.drawImage(
            this.bufferCanvas,
            0,
            0,
            this.bufferCanvas.width,
            this.bufferCanvas.height,
            0,
            0,
            this.outputCanvas.width,
            this.outputCanvas.height
        );
    };

    /**
     * Draws the level to the level buffer.
     */
    private drawLevelToBuffer = (): void => {
        const rowMax = this.bufferCanvas.height / Game.TILE_HEIGHT;
        const columnMax = this.bufferCanvas.width / Game.TILE_WIDTH;
        const xOffset = ((columnMax - this.level.columns) / 2) * Game.TILE_WIDTH;
        const yOffset = ((rowMax - this.level.rows) / 2) * Game.TILE_HEIGHT;

        // Clear with background color
        this.levelContext.imageSmoothingEnabled = false;
        this.levelContext.fillStyle = Game.BACKGROUND_COLOR;
        this.levelContext.fillRect(0, 0, this.levelContext.canvas.width, this.levelContext.canvas.height);

        // Draw background
        for (let rowIndex = 0; rowIndex < rowMax; rowIndex++) {
            for (let columnIndex = 0; columnIndex < columnMax; columnIndex++) {
                const tile = this.voidTileMap.getRandomTile();
                tile.draw(columnIndex * tile.width, rowIndex * tile.height, this.levelContext);
            }
        }

        // Draw moon
        const moonTile = this.moonTileMap.get(0, 0);
        moonTile.draw(Game.MOON_OFFSET, Game.MOON_OFFSET, this.levelContext);

        // Draw level
        let pattern: string;
        let tileDefinitionList: Array<[Tile, [number, number]]>;
        let borderTileDefinitionList: Array<[Tile, [number, number]]>;
        for (let rowIndex = 0; rowIndex < this.level.rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.level.columns; columnIndex++) {
                tileDefinitionList = [];

                switch (this.level.tileTypeMap[rowIndex][columnIndex]) {
                    case TileType.Floor:
                        // Add random floor tile
                        tileDefinitionList.push([this.floorTileMap.getRandomTile(), [0, 0]]);

                        // Add pillar
                        if (Game.RENDER_PILLARS) {
                            // Get pillar tiles
                            pattern = this.level.getPatternAt(columnIndex, rowIndex, TileType.Floor);
                            borderTileDefinitionList = pattern.match(/......0./)
                                ? this.pillarTileMap.getTileListByPattern(pattern)
                                : [];

                            // Add pillar tiles
                            tileDefinitionList.push(...borderTileDefinitionList);
                        }

                        break;
                    case TileType.Void:
                        // Get border tiles
                        pattern = this.level.getPatternAt(columnIndex, rowIndex, TileType.Floor);
                        borderTileDefinitionList =
                            pattern !== '00000000' ? this.voidBorderTileMap.getTileListByPattern(pattern) : [];

                        // Add border tiles
                        tileDefinitionList.push(...borderTileDefinitionList);
                        break;
                    case TileType.Water:
                        // Get border tiles
                        pattern = this.level.getPatternAt(columnIndex, rowIndex, TileType.Floor);
                        borderTileDefinitionList =
                            pattern !== '00000000' ? this.waterBorderTileMap.getTileListByPattern(pattern) : [];

                        // Add tiles
                        tileDefinitionList.push(
                            // Add random water tile if no border tiles exists or default tile otherwise
                            [
                                borderTileDefinitionList.length === 0
                                    ? this.waterTileMap.getRandomTile()
                                    : this.waterTileMap.get(0, 0),
                                [0, 0]
                            ],
                            // Add border tiles
                            ...borderTileDefinitionList
                        );
                        break;
                }

                // Draw tiles
                tileDefinitionList.forEach((tileDefinition) =>
                    tileDefinition[0].draw(
                        tileDefinition[1][0] + xOffset + columnIndex * Game.TILE_WIDTH,
                        tileDefinition[1][1] + yOffset + rowIndex * Game.TILE_HEIGHT,
                        this.levelContext
                    )
                );
            }
        }
    };
}
