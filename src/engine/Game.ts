import PixelPosition from './core/PixelPosition';
import PixelSize from './core/PixelSize';
import fontList from './font/FontList';
import FontLoader from './font/FontLoader';
import Level from './level/Level';
import levelList from './level/LevelList';
import LevelLoader from './level/LevelLoader';
import resourceList from './resource/ResourceList';
import ResourceLoader from './resource/ResourceLoader';
import Scene from './Scene';
import tileMapList from './tile/TileMapList';
import TileMapLoader from './tile/TileMapLoader';

export default class Game {
    public static readonly BACKGROUND_COLOR = '#252230';
    public static readonly MOON_POSITION = new PixelPosition(32, 32);
    public static readonly RENDER_PONDS = true;
    public static readonly RENDER_PILLARS = true;
    public static readonly RENDER_SHADOWS = true;
    public static readonly SMOOTHING = false;
    public static readonly TILE_SIZE = new PixelSize(16, 16);

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
    private pressedKeyList: Record<string, { pressed: boolean; startTime: number }> = {};

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
            if (this.pressedKeyList[event.code]) {
                this.pressedKeyList[event.code].pressed = true;
            } else {
                this.pressedKeyList[event.code] = { pressed: true, startTime: 0 };
            }
        });
        document.addEventListener('keyup', (event: KeyboardEvent): void => {
            this.pressedKeyList[event.code] = { pressed: false, startTime: 0 };
        });
        window.addEventListener('blur', (): void => {
            this.pressedKeyList = {};
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
            new PixelSize(this.bufferCanvas.width, this.bufferCanvas.height)
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
        const currentTime = Date.now();
        const dt = (currentTime - this.lastTime) / 1000.0;

        this.control(currentTime);
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

        this.lastTime = currentTime;
        window.requestAnimationFrame(this.loop);
    };

    /**
     * Controls the player based on the user input.
     * @param currentTime
     */
    private control = (currentTime: number): void => {
        // Check pressed keys
        let pressedKeyData: { pressed: boolean; startTime: number };
        Object.keys(this.pressedKeyList).forEach((pressedKey) => {
            pressedKeyData = this.pressedKeyList[pressedKey];
            if (pressedKeyData.pressed) {
                this.scene.control(pressedKey, currentTime - pressedKeyData.startTime);
                this.pressedKeyList[pressedKey].startTime = currentTime;
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
