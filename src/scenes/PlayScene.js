import * as Phaser from 'phaser';
import { Player } from '../classes/Player';
import { BACKGROUND_COLOR } from '../utils/constants';

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

  init({ webcam }) {
    this.webcam = webcam;
  }

  create() {
    const { width, height } = this.scale;

    this.backClouds = this.add.tileSprite(400, 75, 13500, 150, 'back-clouds');
    this.frontClouds = this.add.tileSprite(400, 75, 13500, 150, 'front-clouds');

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

    this.updateStatsBoard = () => {
      this.statsBoard.setText(
        `Jumps: ${this.player.jumps}, Ducks: ${this.player.ducks}`
      );
    };

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
    const ground = map.createLayer('track', tileset, 0, 0);

    this.redGrapes = this.physics.add.group({
      gravityY: 300,
    });

    this.physics.add.collider(this.redGrapes, ground);

    const generateGrape = (offset = 0) => {
      this.redGrapes.create(offset + 500, 0, 'red-grape');
    };

    ground.setCollisionByExclusion(-1, true);
    this.player = new Player(this, 30, 450);
    this.webcam.setPlayer(this.player);
    this.player.setVelocityX(200);
    this.player.setOffset(0, 55);
    this.physics.add.collider(this.player, ground, null, null, this);
    this.physics.add.overlap(this.player, this.redGrapes, (player, grape) => {
      this.grapes++;
      this.grapesBoard.setText(`Grapes: ${this.grapes}`);
      grape.destroy();
    });

    // GUIDING TEXT BOX:
    this.guideText = [
      'Jump in place (Or press the Up key) to jump!',
      'Squat (or press the Down key) to duck!',
      'Your point count will increase the longer you last',
      'Collect grapes to buy items (Coming soon)',
      "That's everything you need! Ready?",
    ];
    this.step = -1;
    this.guide = this.add.text(
      this.player.x - 200,
      this.player.y - 50,
      'Welcome to Duck Duck Jump!',
      {
        backgroundColor: 'black',
        color: 'white',
        align: 'center',
        fontSize: 25,
      }
    );

    // CLOCK FUNCTIONS:
    this.time.addEvent({
      delay: 6000,
      callback: () => {
        this.step++;
        if (this.guideText[this.step]) {
          this.guide.setText(`${this.guideText[this.step]}`);
        }
      },
      loop: true,
    });
    this.time.addEvent({
      delay: 24000,
      callback: () => {
        generateGrape(this.player.x);
      },
    });

    this.time.addEvent({
      delay: 10000,
      callback: () => {
        this.score++;
        this.scoreBoard.setText(`Score: ${this.score}`);
      },
      loop: true,
    });

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
      this.webcam.endDetection();
      this.scene.stop('PlayScene');
      this.scene.start('MainMenuScene', { webcam: this.webcam });
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
    this.frontClouds.tilePositionX += 0.5;
    this.backClouds.tilePositionX += 0.25;
    this.player.update(delta);
    this.guide.x = this.player.x - 200;
    this.guide.y = this.player.y - 50;
  }
}
