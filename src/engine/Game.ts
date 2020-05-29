import { ActionType, DirectionType } from './sprite/Sprite';
import { TileType } from './tile/Tile';
import Box from './sprite/Box';
import Level from './level/Level';
import LevelLoader from './level/LevelLoader';
import LevelTileMap from './tile/LevelTileMap';
import Player from './sprite/Player';
import ResourceLoader from './resource/ResourceLoader';
import TileMap from './tile/TileMap';

import boxSprites from '../images/bun.png';
import playerSprites from '../images/bunnie.png';
import tiles from '../images/tiles.png';
import level from '../levels/1.txt';

export default class Game {
    private static readonly SMOOTHING = false;

    private readonly resourceLoader: ResourceLoader = new ResourceLoader();

    private readonly bufferCanvas: HTMLCanvasElement;
    private readonly bufferContext: CanvasRenderingContext2D;
    private readonly outputCanvas: HTMLCanvasElement;
    private readonly outputContext: CanvasRenderingContext2D;

    private floorTileMap!: LevelTileMap;
    private waterTileMap!: LevelTileMap;
    private voidTileMap!: LevelTileMap;
    private moonTileMap!: LevelTileMap;
    private levelLoader!: LevelLoader;
    private player!: Player;
    private boxList!: Array<Box>;
    private level!: Level;

    // @ts-ignore
    private moves: number = 0;
    // @ts-ignore
    private pushes: number = 0;
    // @ts-ignore
    private time: number = 0;

    private lastTime: number = 0;
    private pressedKeyList: Record<string, boolean> = {};

    public constructor(canvas: HTMLCanvasElement, width: number = 400, height: number = 304, zoom: number = 1) {
        // Buffer canvas
        this.bufferCanvas = document.createElement('canvas');
        this.bufferCanvas.width = width;
        this.bufferCanvas.height = height;

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
        this.resourceLoader.load([playerSprites, boxSprites, tiles, level]).then(() => {
            // Prepare tiles
            const tilesResource = this.resourceLoader.get(tiles);
            this.floorTileMap = new LevelTileMap(
                TileMap.createTileTable(tilesResource, 6, 8, 0, 0, 16, 16, TileType.Floor),
                [],
                LevelTileMap.FLOOR_PATTERN_TILE_LIST
            );
            this.waterTileMap = new LevelTileMap(
                TileMap.createTileTable(tilesResource, 6, 8, 6, 0, 16, 16, TileType.Water),
                [],
                LevelTileMap.FLOOR_PATTERN_TILE_LIST
            );
            this.voidTileMap = new LevelTileMap(
                TileMap.createTileTable(tilesResource, 3, 8, 6, 8, 16, 16, TileType.Void),
                LevelTileMap.VOID_WEIGHTED_TILE_LIST,
                LevelTileMap.PILLAR_PATTERN_TILE_LIST
            );
            this.moonTileMap = new LevelTileMap(
                TileMap.createTileTable(tilesResource, 2, 2, 9, 13, 16, 16, TileType.Void),
                [],
                []
            );

            // Prepare levels
            this.levelLoader = new LevelLoader(this.floorTileMap, this.waterTileMap, this.voidTileMap);
            this.levelLoader.load([this.resourceLoader.get(level)]).then(() => {
                this.level = this.levelLoader.get(level);

                // Prepare sprites
                const playerResource = this.resourceLoader.get(playerSprites);
                this.player = new Player(
                    new TileMap(TileMap.createTileTable(playerResource, 4, 6, 0, 0, 16, 32, TileType.Sprite))
                );
                this.player.moveTo(
                    this.level.playerPosition[0] * this.level.tileWidth,
                    this.level.playerPosition[1] * this.level.tileHeight
                );

                const bunTileMap = new TileMap(
                    TileMap.createTileTable(this.resourceLoader.get(boxSprites), 1, 1, 0, 0, 16, 16, TileType.Sprite)
                );
                this.boxList = this.level.boxPositionList.map((boxPosition) => {
                    let box = new Box(bunTileMap);
                    box.moveTo(boxPosition[0] * this.level.tileWidth, boxPosition[1] * this.level.tileHeight);
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

        // Move sprite
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
        this.player.move(dt, this.bufferContext, this.level);

        // Update sprite
        this.player.update(dt);
        this.boxList.forEach((bun) => bun.update(dt));

        // Draw level and sprites
        this.level.draw([this.player, ...this.boxList], this.voidTileMap, this.moonTileMap, this.bufferContext);

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
}
