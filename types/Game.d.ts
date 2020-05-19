import ResourceLoader from './ResourceLoader';
export default class Game {
    resourceLoader: ResourceLoader;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    lastTime: number;
    gameTime: number;
    constructor(canvas: HTMLCanvasElement, width: number, height: number);
    loop(): void;
}
