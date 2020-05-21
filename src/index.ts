import Game from './engine/Game';

import './css/main.css';

const canvas = <HTMLCanvasElement>document.getElementById('game');

// Instantiate game
new Game(
    canvas,
    512,
    448
);
