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

    // @ts-ignore
    private moves: number = 0;
    // @ts-ignore
    private pushes: number = 0;
    // @ts-ignore
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
                    this.player.moveTo(
                        this.level.playerPosition[0] * Game.TILE_WIDTH,
                        this.level.playerPosition[1] * Game.TILE_HEIGHT
                    );

                    const bunTileMap = new TileMap(
                        TileMap.createTileTable(this.resourceLoader.get(boxSprites), 1, 1, 0, 0, 16, 16)
                    );
                    this.boxList = this.level.boxPositionList.map((boxPosition) => {
                        let box = new Box(bunTileMap);
                        box.moveTo(boxPosition[0] * Game.TILE_WIDTH, boxPosition[1] * Game.TILE_HEIGHT);
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

        // Set player action
        if (this.player.actionType === ActionType.Stand) {
            Object.keys(this.pressedKeyList).forEach((pressedKey) => {
                if (this.pressedKeyList[pressedKey]) {
                    let actionSet = false;

                    switch (pressedKey) {
                        case 'KeyS':
                        case 'ArrowDown':
                            actionSet = actionSet || this.player.setAction(ActionType.Walk);
                            this.player.setDirection(DirectionType.Down);
                            break;
                        case 'KeyW':
                        case 'ArrowUp':
                            actionSet = actionSet || this.player.setAction(ActionType.Walk);
                            this.player.setDirection(DirectionType.Up);
                            break;
                        case 'KeyA':
                        case 'ArrowLeft':
                            actionSet = actionSet || this.player.setAction(ActionType.Walk);
                            this.player.setDirection(DirectionType.Left);
                            break;
                        case 'KeyD':
                        case 'ArrowRight':
                            actionSet = actionSet || this.player.setAction(ActionType.Walk);
                            this.player.setDirection(DirectionType.Right);
                            break;
                    }

                    if (actionSet) {
                        this.moves++;
                    }
                }
            });
        }

        // Move sprites
        //this.move(dt);

        // Update sprite
        this.player.update(dt);
        this.boxList.forEach((bun) => bun.update(dt));

        // Draw level and sprites
        this.draw();

        // Draw buffer canvas
        this.outputContext.imageSmoothingEnabled = Game.SMOOTHING;
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

        this.lastTime = now;
        window.requestAnimationFrame(this.loop);
    };

    /**
     * Draws the level with the given context.
     */
    private draw = (): void => {
        const rowMax = this.bufferCanvas.height / Game.TILE_HEIGHT;
        const columnMax = this.bufferCanvas.width / Game.TILE_WIDTH;
        const xOffset = ((columnMax - this.level.columns) / 2) * Game.TILE_WIDTH;
        const yOffset = ((rowMax - this.level.rows) / 2) * Game.TILE_HEIGHT;

        if (!this.levelDrawn) {
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
                                borderTileDefinitionList = pattern.match(/......0./) ? this.pillarTileMap.getTileListByPattern(pattern) : [];
                                tileDefinitionList.push(...borderTileDefinitionList);
                            }

                            break;
                        case TileType.Void:
                            pattern = this.level.getPatternAt(columnIndex, rowIndex, TileType.Floor);
                            borderTileDefinitionList = pattern !== '00000000' ? this.voidBorderTileMap.getTileListByPattern(pattern) : [];
                            tileDefinitionList.push(...borderTileDefinitionList);
                            break;
                        case TileType.Water:
                            pattern = this.level.getPatternAt(columnIndex, rowIndex, TileType.Floor);
                            borderTileDefinitionList = pattern !== '00000000' ? this.waterBorderTileMap.getTileListByPattern(pattern) : [];
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

            this.levelDrawn = true;
        }

        // Draw level buffer
        this.bufferContext.imageSmoothingEnabled = false;
        this.bufferContext.drawImage(this.levelCanvas, 0, 0);

        // Draw sprites
        [...this.boxList, this.player].forEach((sprite) => {
            this.shadowTileMap
                .get(0, 0)
                .draw(
                    xOffset + sprite.x + sprite.collisionOffset.left,
                    yOffset + sprite.y + sprite.collisionOffset.top + 3,
                    this.bufferContext
                );
            sprite.draw(xOffset, yOffset, this.bufferContext);
        });
    };

    /**
     * Checks if the given rectangle intersects with any blocking part of the level or the canvas boundaries.
     * @param collisionBox
     * @param context
     */
    /*public intersects = (collisionBox: CollisionBox, context: CanvasRenderingContext2D): boolean => {
        // Check canvas boundaries
        if (
            collisionBox.left < 0 ||
            collisionBox.right >= context.canvas.width ||
            collisionBox.top < 0 ||
            collisionBox.bottom >= context.canvas.height
        ) {
            return true;
        }

        // Check all none floor tiles
        let tile: Tile, tileCollisionBox: CollisionBox;
        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                tile = this.tileTable[rowIndex][columnIndex];
                if (tile.type !== TileType.Floor) {
                    tileCollisionBox = new CollisionBox(
                        columnIndex * tile.width,
                        columnIndex * tile.width + tile.width,
                        rowIndex * tile.height,
                        rowIndex * tile.height + tile.height
                    );

                    if (
                        collisionBox.left < tileCollisionBox.right &&
                        tileCollisionBox.left < collisionBox.right &&
                        collisionBox.top < tileCollisionBox.bottom &&
                        tileCollisionBox.top < collisionBox.bottom
                    ) {
                        return true;
                    }
                }
            }
        }

        return false;
    };*/

    /**
     * Updates the internal X and Y coordinates based on the current direction type.
     * @param dt
     * @param context
     * @param level
     */
    /*public move = (dt: number, context: CanvasRenderingContext2D, level: Level): void => {
        if (this.actionType !== ActionType.Stand) {
            const distance = 16 / (this.getDirection().duration / dt);

            let x, y;
            switch (this.directionType) {
                case DirectionType.Left:
                    x = this.x - distance;
                    if (!this.intersects(this.player.createCollisionBox(x, this.y), context)) {
                        this.x = x;
                    }
                    break;
                case DirectionType.Right:
                    x = this.x + distance;
                    if (!this.intersects(this.player.createCollisionBox(x, this.y), context)) {
                        this.x = x;
                    }
                    break;
                case DirectionType.Up:
                    y = this.y - distance;
                    if (!this.intersects(this.player.createCollisionBox(this.x, y), context)) {
                        this.y = y;
                    }
                    break;
                case DirectionType.Down:
                    y = this.y + distance;
                    if (!this.intersects(this.player.createCollisionBox(this.x, y), context)) {
                        this.y = y;
                    }
                    break;
            }
        }
    };*/
}
