import './css/corner.css';
import './css/main.css';

import Game from './engine/Game';

const canvas = <HTMLCanvasElement>document.getElementById('game');

// Instantiate game
const game = new Game(canvas, 400, 304, 2);
game.initialize();
