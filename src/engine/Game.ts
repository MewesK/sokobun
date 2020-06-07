import FontLoader from './font/FontLoader';
import LevelLoader from './level/LevelLoader';
import ResourceLoader from './resource/ResourceLoader';
import Scene from './Scene';
import TileMapLoader from './tile/TileMapLoader';
import YosterIsland8 from './font/YosterIsland8';
import YosterIsland10 from './font/YosterIsland10';
import YosterIsland12 from './font/YosterIsland12';
import YosterIsland14 from './font/YosterIsland14';

import boxSprites from '../images/bun.png';
import destinationSprites from '../images/pillow.png';
import playerSprites from '../images/player_base.png';
import tilesFloor from '../images/tiles_floor.png';
import tilesMoon from '../images/moon.png';
import tilesPillar from '../images/tiles_pillar.png';
import tilesShadow from '../images/shadow.png';
import tilesVoid from '../images/tiles_void.png';
import tilesVoidBorder from '../images/tiles_void_border.png';
import tilesWater from '../images/tiles_water.png';
import tilesWaterBorder from '../images/tiles_water_border.png';
import tilesYosterIsland8 from '../images/yoster_island_8_white.png';
import tilesYosterIsland10 from '../images/yoster_island_10_white.png';
import tilesYosterIsland12 from '../images/yoster_island_12_white.png';
import tilesYosterIsland14 from '../images/yoster_island_14_white.png';

import level from '../levels/3.txt';
import TileMap from './tile/TileMap';
import RandomTileMap from './tile/RandomTileMap';
import PatternTileMap from './tile/PatternTileMap';

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
    private readonly tileMapLoader: TileMapLoader = new TileMapLoader();
    private readonly fontLoader: FontLoader = new FontLoader();
    private readonly levelLoader: LevelLoader = new LevelLoader();

    private readonly bufferCanvas: HTMLCanvasElement;
    private readonly bufferContext: CanvasRenderingContext2D;
    private readonly outputCanvas: HTMLCanvasElement;
    private readonly outputContext: CanvasRenderingContext2D;

    private scene!: Scene;

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

        // Load resources
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
                tilesYosterIsland8,
                tilesYosterIsland10,
                tilesYosterIsland12,
                tilesYosterIsland14,
                level
            ])
            .then(() => {
                Promise.all([
                    this.tileMapLoader.load([
                        // Sprite tiles
                        new TileMap(
                            TileMap.createTileTable(this.resourceLoader.get(playerSprites), 4, 6, 0, 0, 18, 24, 1),
                            this.resourceLoader.get(playerSprites)
                        ),
                        new TileMap(
                            TileMap.createTileTable(this.resourceLoader.get(boxSprites), 1, 1, 0, 0, 16, 16),
                            this.resourceLoader.get(boxSprites)
                        ),
                        new TileMap(
                            TileMap.createTileTable(this.resourceLoader.get(destinationSprites), 1, 1, 0, 0, 16, 16),
                            this.resourceLoader.get(destinationSprites)
                        ),
                        // Level tiles
                        new RandomTileMap(
                            TileMap.createTileTable(this.resourceLoader.get(tilesFloor), 2, 2, 0, 0, 16, 16),
                            this.resourceLoader.get(tilesFloor),
                            RandomTileMap.FLOOR_WEIGHTED_TILE_LIST
                        ),
                        new TileMap(
                            TileMap.createTileTable(this.resourceLoader.get(tilesMoon), 1, 1, 0, 0, 32, 32),
                            this.resourceLoader.get(tilesMoon)
                        ),
                        new TileMap(
                            TileMap.createTileTable(this.resourceLoader.get(tilesShadow), 1, 1, 0, 0, 16, 16),
                            this.resourceLoader.get(tilesShadow)
                        ),
                        new PatternTileMap(
                            TileMap.createTileTable(this.resourceLoader.get(tilesPillar), 3, 4, 0, 0, 16, 16),
                            this.resourceLoader.get(tilesPillar),
                            PatternTileMap.PILLAR_PATTERN_TILE_DEFINITION_LIST
                        ),
                        new RandomTileMap(
                            TileMap.createTileTable(this.resourceLoader.get(tilesVoid), 3, 2, 0, 0, 16, 16),
                            this.resourceLoader.get(tilesVoid),
                            RandomTileMap.VOID_WEIGHTED_TILE_LIST
                        ),
                        new PatternTileMap(
                            TileMap.createTileTable(this.resourceLoader.get(tilesVoidBorder), 4, 4, 0, 0, 8, 8),
                            this.resourceLoader.get(tilesVoidBorder),
                            PatternTileMap.BORDER_PATTERN_TILE_DEFINITION_LIST
                        ),
                        new RandomTileMap(
                            TileMap.createTileTable(this.resourceLoader.get(tilesWater), 2, 2, 0, 0, 16, 16),
                            this.resourceLoader.get(tilesWater),
                            RandomTileMap.WATER_WEIGHTED_TILE_LIST
                        ),
                        new PatternTileMap(
                            TileMap.createTileTable(this.resourceLoader.get(tilesWaterBorder), 4, 4, 0, 0, 8, 8),
                            this.resourceLoader.get(tilesWaterBorder),
                            PatternTileMap.BORDER_PATTERN_TILE_DEFINITION_LIST
                        )
                    ]),
                    this.fontLoader.load([
                        new YosterIsland8(this.resourceLoader.get(tilesYosterIsland8)),
                        new YosterIsland10(this.resourceLoader.get(tilesYosterIsland10)),
                        new YosterIsland12(this.resourceLoader.get(tilesYosterIsland12)),
                        new YosterIsland14(this.resourceLoader.get(tilesYosterIsland14))
                    ]),
                    this.levelLoader.load([
                        this.resourceLoader.get(level)
                    ])
                ]).then(() => {
                    this.load(this.levelLoader.get(level));
                });
            });
    };

    /**
     * Load level.
     * @param scene
     */
    private load = (scene: Scene): void => {
        this.scene = scene;
        this.scene.load(
            this.resourceLoader,
            this.tileMapLoader,
            this.fontLoader,
            this.bufferCanvas.width,
            this.bufferCanvas.height
        );

        this.lastTime = 0;
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

        this.control();
        this.scene.update(dt);
        this.draw();

        this.lastTime = now;
        window.requestAnimationFrame(this.loop);
    };

    /**
     * Controls the player based on the user input.
     */
    private control = (): void => {
        // Check pressed keys
        Object.keys(this.pressedKeyList).forEach((pressedKey) => {
            if (this.pressedKeyList[pressedKey]) {
                this.scene.control(pressedKey);
            }
        });
    };

    /**
     *
     */
    private draw = (): void => {
        // Draw level
        this.scene.draw(this.bufferCanvas, this.bufferContext);

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
}
