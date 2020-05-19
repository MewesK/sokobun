import Game from './engine/Game';

import './css/main.css';

const canvas = <HTMLCanvasElement>document.createElement('canvas');

// Instantiate game
new Game(
    canvas,
    512,
    448
);

document.body.appendChild(canvas);