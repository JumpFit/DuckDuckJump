import * as Phaser from 'phaser';

let frontClouds;
let backClouds;

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayScene' });
  }

  preload() {
    this.load.image('front-clouds', 'assets/front-clouds.png');
    this.load.image('back-clouds', 'assets/back-clouds.png');
    this.load.image('tiles', 'assets/sheet.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/DuckTrack.json');
    this.load.atlas(
      'duck',
      'assets/characters/duck.png',
      'assets/characters/duck.json'
    );
  }

  create() {
    const { width, height } = this.scale;
    
    backClouds = this.add.tileSprite(400, 75, 13500, 150, 'back-clouds');
    frontClouds = this.add.tileSprite(400, 75, 13500, 150, 'front-clouds');
    
    const map = this.make.tilemap({ key: 'tilemap' });
    const tileset = map.addTilesetImage('sheet', 'tiles');
    const ground = map.createLayer('track', tileset);
    
    this.add.image(width * 0.5, height * 0.5, 'duck');
  }

  update() {
    frontClouds.tilePositionX += 0.5;
    backClouds.tilePositionX += 0.25;
  }
}
