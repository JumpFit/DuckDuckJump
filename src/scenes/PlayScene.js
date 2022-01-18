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
    this.load.image('tiles', '../../public/assets/sheet.png');
    this.load.tilemapTiledJSON('tilemap', '../../public/assets/DuckTrack.json');
  }

  create() {
    backClouds = this.add.tileSprite(400, 75, 13500, 150, 'back-clouds');
    frontClouds = this.add.tileSprite(400, 75, 13500, 150, 'front-clouds');
    const map = this.make.tilemap({ key: 'tilemap' });

    const tileset = map.addTilesetImage('sheet', 'tiles');
    const ground = map.createLayer('track', tileset);
  }

  update() {
    frontClouds.tilePositionX += 0.5;
    backClouds.tilePositionX += 0.25;
  }
}
