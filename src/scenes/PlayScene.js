import * as Phaser from 'phaser';

let frontClouds;
let backClouds;

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayScene' });
  }

  preload() {
    this.load.image('front-clouds', '../../public/assets/front-clouds.png');
    this.load.image('back-clouds', '../../public/assets/back-clouds.png');
  }

  create() {
    backClouds = this.add.tileSprite(400, 75, 800, 150, 'back-clouds');
    frontClouds = this.add.tileSprite(400, 75, 800, 150, 'front-clouds');
  }

  update() {
    frontClouds.tilePositionX += 0.5;
    backClouds.tilePositionX += 0.25;
  }
}
