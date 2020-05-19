import sprites from '../images/sprites.png';
import tiles from '../images/tiles.png';
import {ResourceLoader} from './ResourceLoader';
import {TileMap} from './TileMap';
import {Sprite} from './Sprite';
import {Action} from './Action';

export default class Game {
    resourceLoader: ResourceLoader;

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    spriteMap!: TileMap;
    tileMap!: TileMap;

    lastTime: number = 0;
    gameTime: number = 0;

    bunnie!: Sprite;

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

        // Prepare resources
        this.resourceLoader = new ResourceLoader();
        this.resourceLoader.load([sprites, tiles]).then(() => {
            // Prepare graphics
            this.spriteMap = new TileMap(this.resourceLoader.get(sprites), 4, 4);
            this.tileMap = new TileMap(this.resourceLoader.get(tiles), 14, 22);

            // Prepare sprites
            this.bunnie = new Sprite({
                stand: new Action({
                    up: [this.spriteMap.get(2, 0)],
                    down: [this.spriteMap.get(3, 0)],
                    left: [this.spriteMap.get(0, 0)],
                    right: [this.spriteMap.get(1, 0)]
                }, 1),
                walk: new Action({
                    up: [this.spriteMap.get(2, 1), this.spriteMap.get(2, 0)],
                    down: [this.spriteMap.get(3, 1), this.spriteMap.get(3, 0)],
                    left: [this.spriteMap.get(0, 1), this.spriteMap.get(0, 0)],
                    right: [this.spriteMap.get(1, 1), this.spriteMap.get(1, 0)],
                }, 0.5),
                push: new Action({
                    up: [this.spriteMap.get(2, 3), this.spriteMap.get(2, 2)],
                    down: [this.spriteMap.get(3, 3), this.spriteMap.get(3, 2)],
                    left: [this.spriteMap.get(0, 3), this.spriteMap.get(0, 2)],
                    right: [this.spriteMap.get(1, 3), this.spriteMap.get(1, 2)],
                }, 0.5)
            });
            this.bunnie.setAction('stand');
            this.bunnie.setDirection('down');

            // Start game loop
            console.log('Starting game loop...');
            this.lastTime = Date.now();
            this.loop();
        });

        let pressedKeyList: Record<string, boolean> = {};
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyS':
                case 'ArrowDown':
                    pressedKeyList[event.code] = true;
                    this.bunnie.setAction('walk');
                    this.bunnie.setDirection('down');
                    break;
                case 'KeyW':
                case 'ArrowUp':
                    pressedKeyList[event.code] = true;
                    this.bunnie.setAction('walk');
                    this.bunnie.setDirection('up');
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    pressedKeyList[event.code] = true;
                    this.bunnie.setAction('walk');
                    this.bunnie.setDirection('left');
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    pressedKeyList[event.code] = true;
                    this.bunnie.setAction('walk');
                    this.bunnie.setDirection('right');
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            pressedKeyList[event.code] = false;

            // Set action to stand if no key is pressed anymore
            if (Object.values(pressedKeyList).every((value) => value === false)) {
                this.bunnie.setAction('stand');
            }
        });
    }

    loop = () => {
        let now = Date.now();
        let dt = (now - this.lastTime) / 1000.0;
        this.gameTime += dt;

        const tile = this.bunnie.getTile();

        // Move sprite
        const speed = 150;
        if (this.bunnie.action === 'walk') {
            let x, y;
            switch (this.bunnie.direction) {
                case 'down':
                    y = this.bunnie.y + Math.round(dt * speed)
                    if (y + tile.height * 2 <= this.canvas.height) {
                        this.bunnie.y = y;
                    }
                    break;
                case 'up':
                    y = this.bunnie.y - Math.round(dt * speed)
                    if (y >= 0) {
                        this.bunnie.y = y;
                    }
                    break;
                case 'left':
                    x = this.bunnie.x - Math.round(dt * speed)
                    if (x >= 0) {
                        this.bunnie.x = x;
                    }
                    break;
                case 'right':
                    x = this.bunnie.x + Math.round(dt * speed)
                    if (x + tile.width * 2 <= this.canvas.width) {
                        this.bunnie.x = x;
                    }
                    break;
            }
        }

        // Clear
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw sprite
        this.context.drawImage(
            tile.resource.image,
            tile.x,
            tile.y,
            tile.width,
            tile.height,
            this.bunnie.x,
            this.bunnie.y,
            tile.width * 2,
            tile.height * 2
        );

        // Update sprite
        this.bunnie.update(dt);

        this.lastTime = now;
        window.requestAnimationFrame(this.loop);
    }
}