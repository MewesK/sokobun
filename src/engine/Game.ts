import { ActionType, DirectionType } from './sprite/Sprite';
import Box from './sprite/Box';
import Level from './level/Level';
import LevelLoader from './level/LevelLoader';
import Player from './sprite/Player';
import PatternTileMap from './tile/PatternTileMap';
import RandomTileMap from './tile/RandomTileMap';
import ResourceLoader from './resource/ResourceLoader';
import Tile, { TileType } from './tile/Tile';
import TileMap from './tile/TileMap';

import boxSprites from '../images/bun.png';
import playerSprites from '../images/bunnie.png';
import tilesFloor from '../images/tiles_floor.png';
import tilesMoon from '../images/moon.png';
import tilesPillar from '../images/tiles_pillar.png';
import tilesShadow from '../images/shadow.png';
import tilesVoid from '../images/tiles_void.png';
import tilesVoidBorder from '../images/tiles_void_border.png';
import tilesWater from '../images/tiles_water.png';
import tilesWaterBorder from '../images/tiles_water_border.png';
import level from '../levels/1.txt';

export default class Game {
    public static readonly BACKGROUND_COLOR = '#252230';
    public static readonly MOON_OFFSET = 32;
    public static readonly RENDER_PONDS = true;
    public static readonly RENDER_PILLARS = true;
    public static readonly RENDER_SHADOWS = true;
    public static readonly SMOOTHING = false;
    public static readonly TILE_WIDTH = 16;
    public static readonly TILE_HEIGHT = 16;

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

    private player!: Player;
    private boxList!: Array<Box>;
    private level!: Level;

    private moves: number = 0;
    private pushes: number = 0;
    private time: number = 0;

    private levelDrawn: boolean = false;
    private lastTime: number = 0;
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
        const context = this.outputCanvas.getContext('2d');
        if (context === null) {
            throw new Error('2D context not supported');
        }
        this.outputContext = context;

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
                    this.level = this.levelLoader.get(level);

                    // Create sprites and set initial position
                    const playerResource = this.resourceLoader.get(playerSprites);
                    this.player = new Player(new TileMap(TileMap.createTileTable(playerResource, 4, 6, 0, 0, 16, 32)));
                    this.player.setCoordinates(this.level.playerPosition[0], this.level.playerPosition[1]);

                    const bunTileMap = new TileMap(
                        TileMap.createTileTable(this.resourceLoader.get(boxSprites), 1, 1, 0, 0, 16, 16)
                    );
                    this.boxList = this.level.boxPositionList.map((boxPosition) => {
                        let box = new Box(bunTileMap);
                        box.setCoordinates(boxPosition[0], boxPosition[1]);
                        return box;
                    });

                    // Start game loop
                    console.log('Starting game loop...');
                    this.lastTime = Date.now();
                    this.loop();
                });
            });
    };

    /**
     * The game loop.
     */
    private loop = (): void => {
        let now = Date.now();
        let dt = (now - this.lastTime) / 1000.0;
        this.time += dt;

        // Set sprite actions
        if (this.player.actionType === ActionType.Stand) {
            this.control();
        }

        // Move and update sprites
        this.player.move(dt);
        this.player.update(dt);
        this.boxList.forEach((box) => {
            box.move(dt);
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
        Object.keys(this.pressedKeyList).forEach((pressedKey) => {
            if (this.pressedKeyList[pressedKey]) {
                let actionType;
                let isMoving = false;
                let isPushing = false;

                switch (pressedKey) {
                    case 'KeyW':
                    case 'ArrowUp':
                        actionType = this.controlDirection(DirectionType.Up, 0, -1);
                        isPushing = actionType === ActionType.Push;
                        isMoving = actionType === ActionType.Walk;
                        break;
                    case 'KeyS':
                    case 'ArrowDown':
                        actionType = this.controlDirection(DirectionType.Down, 0, 1);
                        isPushing = actionType === ActionType.Push;
                        isMoving = actionType === ActionType.Walk;
                        break;
                    case 'KeyA':
                    case 'ArrowLeft':
                        actionType = this.controlDirection(DirectionType.Left, -1, 0);
                        isPushing = actionType === ActionType.Push;
                        isMoving = actionType === ActionType.Walk;
                        break;
                    case 'KeyD':
                    case 'ArrowRight':
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
        if (
            this.level.isTileTypeAt(
                playerCoordinates[0] + columnOffset,
                playerCoordinates[1] + rowOffset,
                TileType.Floor
            )
        ) {
            for (let boxIndex = 0; boxIndex < this.boxList.length; boxIndex++) {
                const boxCoordinates = this.boxList[boxIndex].getCoordinates();
                if (
                    boxCoordinates[0] === playerCoordinates[0] + columnOffset &&
                    boxCoordinates[1] === playerCoordinates[1] + rowOffset
                ) {
                    if (
                        this.level.isTileTypeAt(
                            playerCoordinates[0] + 2 * columnOffset,
                            playerCoordinates[1] + 2 * rowOffset,
                            TileType.Floor
                        )
                    ) {
                        actionType = ActionType.Push;
                        this.boxList[boxIndex].setAction(ActionType.Walk, directionType);
                    } else {
                        actionType = ActionType.Stand;
                    }

                    break;
                }
            }

            if (actionType === undefined) {
                actionType = ActionType.Walk;
            }
        } else {
            actionType = ActionType.Stand;
        }

        this.player.setAction(actionType, directionType);

        return actionType;
    };

    /**
     * Draws the level buffer and all sprites.
     */
    private draw = (): void => {
        const rowMax = this.bufferCanvas.height / Game.TILE_HEIGHT;
        const columnMax = this.bufferCanvas.width / Game.TILE_WIDTH;
        const xOffset = ((columnMax - this.level.columns) / 2) * Game.TILE_WIDTH;
        const yOffset = ((rowMax - this.level.rows) / 2) * Game.TILE_HEIGHT;

        if (!this.levelDrawn) {
            this.drawLevelToBuffer();
            this.levelDrawn = true;
        }

        // Draw level buffer
        this.bufferContext.imageSmoothingEnabled = false;
        this.bufferContext.drawImage(this.levelCanvas, 0, 0);

        // Draw shadows
        if (Game.RENDER_SHADOWS) {
            [...this.boxList, this.player].forEach((sprite) => {
                this.shadowTileMap.get(0, 0).draw(xOffset + sprite.x, yOffset + sprite.y, this.bufferContext);
            });
        }

        // Draw sprites
        [...this.boxList, this.player].forEach((sprite) => {
            sprite.draw(xOffset, yOffset, this.bufferContext);
        });

        // Draw status
        this.bufferContext.font = '11px serif';
        this.bufferContext.fillStyle = 'white';
        this.bufferContext.fillText('Moves:', 16, 256);
        this.bufferContext.fillText(String(this.moves), 60, 256);
        this.bufferContext.fillText('Pushes:', 16, 272);
        this.bufferContext.fillText(String(this.pushes), 60, 272);
        this.bufferContext.fillText('Time:', 16, 288);
        this.bufferContext.fillText(String(Math.floor(this.time)), 60, 288);

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
                        tileDefinitionList.push([this.floorTileMap.getRandomTile(), [0, 0]]);

                        if (Game.RENDER_PILLARS) {
                            pattern = this.level.getPatternAt(columnIndex, rowIndex, TileType.Floor);
                            borderTileDefinitionList = pattern.match(/......0./)
                                ? this.pillarTileMap.getTileListByPattern(pattern)
                                : [];
                            tileDefinitionList.push(...borderTileDefinitionList);
                        }

                        break;
                    case TileType.Void:
                        pattern = this.level.getPatternAt(columnIndex, rowIndex, TileType.Floor);
                        borderTileDefinitionList =
                            pattern !== '00000000' ? this.voidBorderTileMap.getTileListByPattern(pattern) : [];
                        tileDefinitionList.push(...borderTileDefinitionList);
                        break;
                    case TileType.Water:
                        pattern = this.level.getPatternAt(columnIndex, rowIndex, TileType.Floor);
                        borderTileDefinitionList =
                            pattern !== '00000000' ? this.waterBorderTileMap.getTileListByPattern(pattern) : [];
                        tileDefinitionList.push(
                            [
                                borderTileDefinitionList.length === 0
                                    ? this.waterTileMap.getRandomTile()
                                    : this.waterTileMap.get(0, 0),
                                [0, 0]
                            ],
                            ...borderTileDefinitionList
                        );
                        break;
                }

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
