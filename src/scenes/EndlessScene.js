import * as Phaser from 'phaser';
import { gameOptions } from '../constants';
import { Player } from '../classes/Player';
import Webcam from '../classes/Webcam';

let frontClouds;
let backClouds;

export default class EndlessScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndlessScene' });
  }

  preload() {
    this.load.image('front-clouds', 'assets/front-clouds.png');
    this.load.image('back-clouds', 'assets/back-clouds.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.atlas(
      'duck',
      'assets/characters/duck.png',
      'assets/characters/duck.json'
    );
  }
  create() {
    const { width, height } = this.scale;
    backClouds = this.add.tileSprite(400, 75, 800, 150, 'back-clouds');
    frontClouds = this.add.tileSprite(400, 75, 800, 150, 'front-clouds');
    this.player = new Player(this, gameOptions.playerStartPosition, height / 2);
  }
  update(time, delta) {
    frontClouds.tilePositionX += 0.5;
    backClouds.tilePositionX += 0.25;
  }
}
