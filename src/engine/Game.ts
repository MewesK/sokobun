import FontLoader from './font/FontLoader';
import Level from './level/Level';
import LevelLoader from './level/LevelLoader';
import ResourceLoader from './resource/ResourceLoader';
import Scene from './Scene';
import TileMapLoader from './tile/TileMapLoader';

import { fontList } from './font/FontList';
import { levelList } from './level/LevelList';
import { resourceList } from './resource/ResourceList';
import { tileMapList } from './tile/TileMapList';

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
    private readonly tileMapLoader: TileMapLoader = new TileMapLoader(this.resourceLoader);
    private readonly fontLoader: FontLoader = new FontLoader(this.resourceLoader);
    private readonly levelLoader: LevelLoader = new LevelLoader(this.resourceLoader);

    private readonly bufferCanvas: HTMLCanvasElement;
    private readonly bufferContext: CanvasRenderingContext2D;
    private readonly outputCanvas: HTMLCanvasElement;
    private readonly outputContext: CanvasRenderingContext2D;

    private scene!: Scene;

    private lastTime = 0;
    private pressedKeyList: Record<string, boolean> = {};

    public constructor(canvas: HTMLCanvasElement, width = 400, height = 304, zoom = 1) {
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

    public initialize = (): void => {
        console.log('Initializing game...');

        // Load resources
        this.resourceLoader.load(resourceList).then(() => {
            Promise.all([
                this.tileMapLoader.load(tileMapList),
                this.fontLoader.load(fontList),
                this.levelLoader.load(levelList)
            ]).then(() => {
                this.load(this.levelLoader.first());
            });
        });
    };

    /**
     * Load scene.
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
        const now = Date.now();
        const dt = (now - this.lastTime) / 1000.0;

        this.control();
        this.scene.update(dt);
        this.draw();

        if (this.scene.finished) {
            if (this.scene instanceof Level) {
                const nextLevel = this.levelLoader.next(this.scene);
                if (nextLevel) {
                    this.load(nextLevel);
                }
            }
        }

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
