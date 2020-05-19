import { ResourceLoader } from './ResourceLoader';
import { TileMap } from './TileMap';
import { Sprite } from './Sprite';
export default class Game {
    resourceLoader: ResourceLoader;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    spriteMap: TileMap;
    tileMap: TileMap;
    lastTime: number;
    gameTime: number;
    buunnie: Sprite;
    constructor(canvas: HTMLCanvasElement, width: number, height: number);
    loop: () => void;
}
