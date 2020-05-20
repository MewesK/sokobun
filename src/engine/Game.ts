import sprites from '../images/sprites.png';
import tiles from '../images/tiles.png';
import ResourceLoader from './ResourceLoader';
import TileMap from './TileMap';
import Bunnie from './Bunnie';

export default class Game {
    resourceLoader: ResourceLoader;

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    spriteMap!: TileMap;
    tileMap!: TileMap;
    bunnie!: Bunnie;

    lastTime: number = 0;
    gameTime: number = 0;

    pressedKeyList: Record<string, boolean> = {};

    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        console.log('Initializing game...');

        // Prepare canvas
        this.canvas = canvas;

        this.canvas.width = width;
        this.canvas.height = height;

        // Prepare context
        const context = this.canvas.getContext('2d');
        if (context === null) {
            throw new Error('2D context not supported');
        }
        this.context = context;
        this.context.imageSmoothingEnabled = false;

        // Register event listener
        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);

        // Prepare resources
        this.resourceLoader = new ResourceLoader();
        this.resourceLoader.load([sprites, tiles]).then(() => {
            // Prepare graphics
            this.spriteMap = new TileMap(this.resourceLoader.get(sprites), 4, 6);
            this.tileMap = new TileMap(this.resourceLoader.get(tiles), 14, 22);

            // Prepare sprites
            this.bunnie = new Bunnie(this.spriteMap);

            // Start game loop
            console.log('Starting game loop...');
            this.lastTime = Date.now();
            this.loop();
        });
    }

    keyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'KeyS':
            case 'ArrowDown':
                this.pressedKeyList[event.code] = true;
                this.bunnie.setAction('walk');
                this.bunnie.setDirection('down');
                break;
            case 'KeyW':
            case 'ArrowUp':
                this.pressedKeyList[event.code] = true;
                this.bunnie.setAction('walk');
                this.bunnie.setDirection('up');
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.pressedKeyList[event.code] = true;
                this.bunnie.setAction('walk');
                this.bunnie.setDirection('left');
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.pressedKeyList[event.code] = true;
                this.bunnie.setAction('walk');
                this.bunnie.setDirection('right');
                break;
        }
    }

    keyUp = (event: KeyboardEvent) => {
        this.pressedKeyList[event.code] = false;

        // Set action to stand if no key is pressed anymore
        if (Object.values(this.pressedKeyList).every((value) => value === false)) {
            this.bunnie.setAction('stand');
        }
    }

    loop = () => {
        let now = Date.now();
        let dt = (now - this.lastTime) / 1000.0;
        this.gameTime += dt;

        // Move sprite
        this.bunnie.move(dt, this.context);

        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw sprite
        this.bunnie.draw(this.context);

        // Update sprite
        this.bunnie.update(dt);

        this.lastTime = now;
        window.requestAnimationFrame(this.loop);
    }
}