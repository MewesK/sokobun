import LevelLoader from './level/LevelLoader';
import ResourceLoader from './resource/ResourceLoader';

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
import level from '../levels/2.txt';
import Scene from './Scene';

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
                // Prepare levels
                this.levelLoader.load([this.resourceLoader.get(level)]).then(() => {
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
        this.scene.load(this.resourceLoader, this.bufferCanvas.width, this.bufferCanvas.height);

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
