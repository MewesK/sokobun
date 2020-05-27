import sprites from '../images/sprites.png';
import tiles from '../images/tiles2.png';
import level1 from '../levels/1.txt';
import ResourceLoader from './resource/ResourceLoader';
import TileMap from './tile/TileMap';
import Bunnie from './sprite/Bunnie';
import Level from './level/Level';
import { ActionType, DirectionType } from './sprite/Sprite';
import LevelLoader from './level/LevelLoader';
import { TileType } from './tile/Tile';
import LevelTileMap from './tile/LevelTileMap';

export default class Game {
    private readonly resourceLoader: ResourceLoader = new ResourceLoader();

    private readonly zoom: number;
    private readonly bufferCanvas: HTMLCanvasElement;
    private readonly bufferContext: CanvasRenderingContext2D;
    private readonly outputCanvas: HTMLCanvasElement;
    private readonly outputContext: CanvasRenderingContext2D;

    private levelLoader!: LevelLoader;
    private bunnie!: Bunnie;
    private level!: Level;

    // @ts-ignore
    private moves: number = 0;
    // @ts-ignore
    private pushes: number = 0;
    // @ts-ignore
    private time: number = 0;

    private lastTime: number = 0;
    private pressedKeyList: Record<string, boolean> = {};

    public constructor(canvas: HTMLCanvasElement, width: number = 256, height: number = 224, zoom: number = 1) {
        this.zoom = zoom;

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
        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);
    }

    public initialize = () => {
        console.log('Initializing game...');

        // Prepare resources
        this.resourceLoader.load([sprites, tiles, level1]).then(() => {
            // Prepare sprites
            this.bunnie = new Bunnie(
                new TileMap(
                    TileMap.createTileTable(this.resourceLoader.get(sprites), 4, 6, 0, 0, 16, 32, TileType.Sprite)
                )
            );

            // Prepare tiles
            const tilesResource = this.resourceLoader.get(tiles);
            this.levelLoader = new LevelLoader(
                new LevelTileMap(
                    TileMap.createTileTable(tilesResource, 6, 8, 0, 0, 16, 16, TileType.Floor),
                    LevelTileMap.FLOOR_PATTERN_TILE_LIST
                ),
                new LevelTileMap(
                    TileMap.createTileTable(tilesResource, 6, 8, 8, 0, 16, 16, TileType.Water),
                    LevelTileMap.FLOOR_PATTERN_TILE_LIST
                ),
                new LevelTileMap(
                    TileMap.createTileTable(tilesResource, 3, 6, 8, 8, 16, 16, TileType.Void),
                    LevelTileMap.PILLAR_PATTERN_TILE_LIST
                )
            );

            // Prepare levels
            this.levelLoader.load([this.resourceLoader.get(level1)]).then(() => {
                this.level = this.levelLoader.get(level1);

                // Resize canvas (for now)
                this.bufferCanvas.width = this.level.columns * this.level.tileWidth;
                this.bufferCanvas.height = this.level.rows * this.level.tileHeight;
                this.outputCanvas.width = this.level.columns * this.level.tileWidth * this.zoom;
                this.outputCanvas.height = this.level.rows * this.level.tileHeight * this.zoom;
                console.log(
                    `Setting canvas size to [${this.outputCanvas.width}x${this.outputCanvas.height}] for level ${this.level.src}...`
                );

                // Set player position
                this.bunnie.moveTo(
                    this.level.playerPosition[0] * this.level.tileWidth,
                    this.level.playerPosition[1] * this.level.tileHeight
                );

                // Start game loop
                console.log('Starting game loop...');
                this.lastTime = Date.now();
                this.loop();
            });
        });
    };

    /**
     * Handles the 'keydown' event.
     * @param event
     */
    private keyDown = (event: KeyboardEvent): void => {
        switch (event.code) {
            case 'KeyS':
            case 'ArrowDown':
                this.pressedKeyList[event.code] = true;
                this.bunnie.setAction(ActionType.Walk);
                this.bunnie.setDirection(DirectionType.Down);
                break;
            case 'KeyW':
            case 'ArrowUp':
                this.pressedKeyList[event.code] = true;
                this.bunnie.setAction(ActionType.Walk);
                this.bunnie.setDirection(DirectionType.Up);
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.pressedKeyList[event.code] = true;
                this.bunnie.setAction(ActionType.Walk);
                this.bunnie.setDirection(DirectionType.Left);
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.pressedKeyList[event.code] = true;
                this.bunnie.setAction(ActionType.Walk);
                this.bunnie.setDirection(DirectionType.Right);
                break;
        }
    };

    /**
     * Handles the 'keyup' event.
     * @param event
     */
    private keyUp = (event: KeyboardEvent): void => {
        this.pressedKeyList[event.code] = false;

        // Set action to stand if no key is pressed anymore
        if (Object.values(this.pressedKeyList).every((value) => value === false)) {
            this.bunnie.setAction(ActionType.Stand);
        }
    };

    /**
     * The game loop.
     */
    private loop = (): void => {
        let now = Date.now();
        let dt = (now - this.lastTime) / 1000.0;

        // Draw level
        this.level.draw(this.bufferContext);

        // Draw sprite
        this.bunnie.draw(this.bufferContext);

        // Move sprite
        this.bunnie.move(dt, this.bufferContext, this.level);

        // Update sprite
        this.bunnie.update(dt);

        // Draw buffer canvas
        this.outputContext.imageSmoothingEnabled = false;
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
