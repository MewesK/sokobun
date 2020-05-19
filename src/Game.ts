import sprites from './images/sprites.png';
import tiles from './images/tiles.png';
import {ResourceLoader} from './ResourceLoader';
import {TileMap} from './TileMap';
import {Sprite} from './Sprite';
import {Action} from './Action';

export default class Game {
    resourceLoader: ResourceLoader;

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    spriteMap: TileMap;
    tileMap: TileMap;

    lastTime: number = 0;
    gameTime: number = 0;

    buunnie: Sprite;

    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        // Prepare canvas
        this.canvas = canvas;

        this.canvas.width = width;
        this.canvas.height = height;

        // Prepare context
        const context = this.canvas.getContext('2d');
        if (context === null) {ö
            throw new Error('2D context not supported');
        }
        this.context = context;
        this.context.imageSmoothingEnabled = false;

        // Prepare resources
        this.resourceLoader = new ResourceLoader();
        this.resourceLoader.load([sprites, tiles]).then(() => {
            // Start game loop
            this.lastTime = Date.now();
            this.loop();
        });

        // Prepare graphics
        this.spriteMap = new TileMap(this.resourceLoader.get(sprites), 4, 4);
        this.tileMap = new TileMap(this.resourceLoader.get(tiles), 14, 22);

        // Prepare sprites
        this.buunnie = new Sprite({
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
        this.buunnie.setAction('walk');
        this.buunnie.setDirection('left');
    }

    loop = () => {
        let now = Date.now();
        let dt = (now - this.lastTime) / 1000.0;
        this.gameTime += dt;

        // Clear
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw sprite
        const tile = this.buunnie.getTile();
        this.context.drawImage(
            tile.resource.image,
            tile.x,
            tile.y,
            tile.width,
            tile.height,
            this.buunnie.x,
            this.buunnie.y,
            tile.width * 2,
            tile.height * 2
        );

        // Move sprite
        if (this.buunnie.direction === 'right') {
            this.buunnie.x += 2;
            if (this.buunnie.x + tile.width * 2 >= this.canvas.width) {
                this.buunnie.setDirection('left');
            }
        } else {
            this.buunnie.x -= 2;
            if (this.buunnie.x <= 0) {
                this.buunnie.setDirection('right');
            }
        }
        this.buunnie.update(dt);

        this.lastTime = now;
        window.requestAnimationFrame(this.loop);
    }
}