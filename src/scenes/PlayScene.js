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

    // SCORING:

    // GRAPES BOARD:
    this.grapes = 0;
    this.grapesBoard = this.add
      .text(25, 25, `Grapes: ${this.grapes}`, {
        backgroundColor: BACKGROUND_COLOR,
        fontSize: 25,
      })
      .setScrollFactor(0);

    // STATS BOARD:
    this.statsBoard = this.add
      .text(width - 25, 25, 'Jumps 0, Ducks: 0', {
        backgroundColor: BACKGROUND_COLOR,
        fontSize: 25,
        align: 'right',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0);

    // SCORE BOARD:
    this.scoreBoard = this.add
      .text(25, 50, 'Score: 0', {
        backgroundColor: BACKGROUND_COLOR,
        fontSize: 25,
      })
      .setScrollFactor(0);
    this.score = 0;

    const map = this.make.tilemap({ key: 'tilemap' });
    const tileset = map.addTilesetImage('sheet', 'tiles', 70, 70, 0, 0);
    const ground = map.createLayer('track', tileset);

    this.redGrapes = this.physics.add.group({
      gravityY: 300,
    });

    this.physics.add.collider(this.redGrapes, ground);

    const generateGrape = (offset = 0) => {
      this.redGrapes.create(offset + Math.random() * width, 0, 'red-grape');
    };

    ground.setCollisionByProperty({ collides: true });
    // this.add.image(width * 0.5, height * 0.5, 'duck');
    this.player = new Player(this, 0, 450);
    this.player.setVelocityX(300);
    this.physics.add.collider(this.player, ground, null, null, this);
    this.physics.add.overlap(this.player, this.redGrapes, (player, grape) => {
      this.grapes++;
      this.grapesBoard.setText(`Grapes: ${this.grapes}`);
      grape.destroy();
    });

    // CLOCK FUNCTIONS:
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.score++;
        this.scoreBoard.setText(`Score: ${this.score}`);
      },
      loop: true,
    });
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        generateGrape(this.player.x);
      },
      loop: true,
    });

    this.updateStatsBoard = () => {
      this.statsBoard.setText(
        `Jumps: ${this.player.jumps}, Ducks: ${this.player.ducks}`
      );
    };

    this.webcam = new WebCam(this.player, this, 0, 0, 'webcam');

    //sets the bounds of the world to the entire width of the provided tilemap
    this.physics.world.bounds.width = ground.width;

    //the camera can only move around within the tilemap's parameters and doesn't stretch outside
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

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
    if (this.player.x > 7000) {
      this.scene.stop('PlayScene');
      this.scene.start('MainMenuScene');
    }

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
  }
}
