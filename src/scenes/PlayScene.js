import * as Phaser from 'phaser';
import { Player } from '../classes/Player';
import WebCam from '../classes/WebCam';
import { BACKGROUND_COLOR } from '../constants';

let frontClouds;
let backClouds;
let controls;

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayScene' });
  }

  preload() {
    this.load.image('red-grape', 'assets/collectibles/red-grape.png');
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
    this.score = 0;
    this.scoreBoard = this.add.text(25, 25, `Score: ${this.score}`, {
      backgroundColor: BACKGROUND_COLOR,
      fontSize: 25,
    });
    this.scoreBoard.setScrollFactor(0);

    const map = this.make.tilemap({ key: 'tilemap' });
    const tileset = map.addTilesetImage('sheet', 'tiles', 70, 70, 0, 0);
    const ground = map.createLayer('track', tileset);

    this.redGrapes = this.physics.add.group();

    const generateGrape = (offset = 0) => {
      this.redGrapes.create(
        offset + Math.random() * width,
        height - 256,
        'red-grape'
      );
    };

    generateGrape();

    ground.setCollisionByProperty({ collides: true });
    // this.add.image(width * 0.5, height * 0.5, 'duck');
    this.player = new Player(this, 0, height - 140);
    this.physics.add.collider(this.player, ground);
    this.physics.add.overlap(this.player, this.redGrapes, (player, grape) => {
      this.score++;
      console.log('score', this.score);
      this.scoreBoard.setText(`Score: ${this.score}`);
      grape.destroy();
      generateGrape(player.x);
    });

    this.webcam = new WebCam(this.player, this, 0, 0, 'webcam');

    //visual representation of tiles with collision
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    ground.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });

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

    this.camError = this.add.text(
      0,
      height - 30,
      `Make sure your whole body is in the frame!`,
      {
        backgroundColor: 'black',
        color: 'white',
        align: 'center',
        fontSize: 25,
        fixedHeight: 30,
        fixedWidth: width,
      }
    );
    this.camError.setScrollFactor(0);
  }

  update(time, delta) {
    if (this.showCamError) {
      if (!this.camError.visible) {
        this.camError.setVisible(true);
      }
    } else {
      if (this.camError.visible) {
        this.camError.setVisible(false);
      }
    }
    frontClouds.tilePositionX += 0.5;
    backClouds.tilePositionX += 0.25;
    this.player.update(delta);
    //controls.update(delta); //uncomment to allow manual camera controls
  }
}
