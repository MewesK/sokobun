import sprites from '../images/sprites.png';
import tiles from '../images/tiles.png';
import level1 from '../levels/1.txt';
import ResourceLoader from './resource/ResourceLoader';
import TileMap from './tile/TileMap';
import Bunnie from './Bunnie';
import Level from './level/Level';
import {Direction} from './Sprite';
import LevelLoader from './level/LevelLoader';

export default class Game {
    resourceLoader: ResourceLoader = new ResourceLoader();
    levelLoader: LevelLoader = new LevelLoader();

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    levelCanvas: HTMLCanvasElement;
    levelContext!: CanvasRenderingContext2D;

    zoom = 2;

    spriteMap!: TileMap;
    tileMap!: TileMap;
    bunnie!: Bunnie;
    level!: Level;

    lastTime: number = 0;
    gameTime: number = 0;

    pressedKeyList: Record<string, boolean> = {};

    constructor(canvas: HTMLCanvasElement, width: number = 256, height: number = 224, zoom: number = 1) {
        console.log('Initializing game...');

        this.zoom = zoom;

        // Prepare canvas
        this.canvas = canvas;
        this.levelCanvas = document.createElement('canvas');

        this.setCanvasSize(width, height);

        // Prepare context
        const context = this.canvas.getContext('2d');
        if (context === null) {
            throw new Error('2D context not supported');
        }
        this.context = context;

        const levelContext = this.levelCanvas.getContext('2d');
        if (levelContext === null) {
            throw new Error('2D context not supported');
        }
        this.levelContext = levelContext;

        // Register event listener
        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);

        // Prepare resources
        this.resourceLoader.load([sprites, tiles, level1]).then(() => {
            // Prepare graphics
            this.spriteMap = new TileMap(this.resourceLoader.get(sprites), 4, 6);
            this.tileMap = new TileMap(this.resourceLoader.get(tiles), 14, 22);

            // Prepare sprites
            this.bunnie = new Bunnie(this.spriteMap);

            // Prepare levels
            this.levelLoader.load([this.resourceLoader.get(level1)], this.tileMap).then(() => {
                this.level = this.levelLoader.get(level1);

                this.setCanvasSize(
                    this.level.levelMap[0].length * this.level.getTile(0, 0).width,
                    this.level.levelMap.length * this.level.getTile(0, 0).height
                );

                this.bunnie.x = this.level.playerPosition[0] * this.level.getTile(0, 0).width;
                this.bunnie.y = this.level.playerPosition[1] * this.level.getTile(0, 0).height;

                console.log(`Setting canvas size to [${this.canvas.width}x${this.canvas.height}] for level ${this.level.src}...`);

                // Draw level to buffer
                this.level.draw(this.levelContext, this.zoom);

                // Start game loop
                console.log('Starting game loop...');
                this.lastTime = Date.now();
                this.loop();
            });
        });
    }

    setCanvasSize = (width: number, height: number): void => {
        this.canvas.width = this.levelCanvas.width = width * this.zoom;
        this.canvas.height = this.levelCanvas.height = height * this.zoom;
    };

    keyDown = (event: KeyboardEvent): void => {
        switch (event.code) {
            case 'KeyS':
            case 'ArrowDown':
                this.pressedKeyList[event.code] = true;
                this.bunnie.setAction('walk');
                this.bunnie.setDirection(Direction.Down);
                break;
            case 'KeyW':
            case 'ArrowUp':
                this.pressedKeyList[event.code] = true;
                this.bunnie.setAction('walk');
                this.bunnie.setDirection(Direction.Up);
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.pressedKeyList[event.code] = true;
                this.bunnie.setAction('walk');
                this.bunnie.setDirection(Direction.Left);
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.pressedKeyList[event.code] = true;
                this.bunnie.setAction('walk');
                this.bunnie.setDirection(Direction.Right);
                break;
        }
    }

    keyUp = (event: KeyboardEvent): void => {
        this.pressedKeyList[event.code] = false;

        // Set action to stand if no key is pressed anymore
        if (Object.values(this.pressedKeyList).every((value) => value === false)) {
            this.bunnie.setAction('stand');
        }
    }

    loop = (): void => {
        let now = Date.now();
        let dt = (now - this.lastTime) / 1000.0;
        this.gameTime += dt;

        // Move sprite
        this.bunnie.move(dt, this.context);

        // Draw level
        this.context.imageSmoothingEnabled = false;
        this.context.drawImage(this.levelCanvas, 0, 0);

        // Draw sprite
        this.bunnie.draw(this.context, this.zoom);

        // Update sprite
        this.bunnie.update(dt);

        this.lastTime = now;
        window.requestAnimationFrame(this.loop);
    }
}
