import * as Phaser from 'phaser';
import { Player } from '../classes/Player';
import WebCam from '../classes/WebCam';

let frontClouds;
let backClouds;
let controls;

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

    //Moved webcam to top of create function so that it renders behind everything else
    this.webcam = new WebCam(
      this.player,
      this,
      width / 2,
      height / 2,
      'webcam'
    );

    backClouds = this.add.tileSprite(400, 75, 13500, 150, 'back-clouds');
    frontClouds = this.add.tileSprite(400, 75, 13500, 150, 'front-clouds');

    const map = this.make.tilemap({ key: 'tilemap' });
    const tileset = map.addTilesetImage('sheet', 'tiles', 70, 70, 0, 0);
    const ground = map.createLayer('track', tileset);

    // this.add.image(width * 0.5, height * 0.5, 'duck');
    this.player = new Player(this, 0, height);

    //sets the bounds of the world to the entire width of the provided tilemap from line 42
    this.physics.world.bounds.width = ground.width;

    //Makes it so that the camera can only move around within the tilemap's parameters and doesn't stretch outside
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    //manual camera control examples
    // const cursors = this.input.keyboard.createCursorKeys();
    // controls = new Phaser.Cameras.Controls.FixedKeyControl({
    //   camera: camera,
    //   left: cursors.left,
    //   right: cursors.right,
    //   up: cursors.up,
    //   down: cursors.down,
    //   speed: 0.5,
    // });

    //Focuses camera on player character so it moves when they move
    camera.startFollow(this.player);
  }

  update(time, delta) {
    frontClouds.tilePositionX += 0.5;
    backClouds.tilePositionX += 0.25;
    this.player.update(delta);
    //controls.update(delta); uncomment to allow manual camera controls
  }
}
