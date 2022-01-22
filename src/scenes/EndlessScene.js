import * as Phaser from 'phaser';
import { gameOptions, BACKGROUND_COLOR } from '../constants';
import { Player } from '../classes/Player';
import WebCam from '../classes/Webcam';

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
    backClouds = this.add.tileSprite(400, 75, 1600, 150, 'back-clouds');
    frontClouds = this.add.tileSprite(400, 75, 1600, 150, 'front-clouds');

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

    this.player = new Player(
      this,
      gameOptions.playerStartPosition[0],
      gameOptions.playerStartPosition[1],
      'duck'
    );
    this.player.setGravityY(gameOptions.playerGravity);

    // group with all active platforms.
    this.platformGroup = this.add.group({
      // once a platform is removed, it's added to the pool
      removeCallback: function (platform) {
        platform.scene.platformPool.add(platform);
      },
    });

    // pool
    this.platformPool = this.add.group({
      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback: function (platform) {
        platform.scene.platformGroup.add(platform);
      },
    });

    //main logic for generating platforms
    this.addPlatform = (platformWidth, posX, posY) => {
      let platform;
      if (this.platformPool.getLength()) {
        platform = this.platformPool.getFirst();
        platform.x = posX;
        platform.active = true;
        platform.visible = true;
        this.platformPool.remove(platform);
      } else {
        platform = this.physics.add.sprite(posX, posY, 'platform');
        platform.setImmovable(true);
        platform.setVelocityX(
          Phaser.Math.Between(
            gameOptions.platformSpeedRange[0],
            gameOptions.platformSpeedRange[1]
          ) * -1
        );
        this.platformGroup.add(platform);
      }
      platform.displayWidth = platformWidth;
      this.nextPlatformDistance = Phaser.Math.Between(
        gameOptions.spawnRange[0],
        gameOptions.spawnRange[1]
      );
    };

    //generate starting platforms
    this.addPlatform(
      width,
      width / 2,
      height * gameOptions.platformVerticalLimit[1]
    );

    //create collision between platforms and player
    this.physics.add.collider(this.player, this.platformGroup);

    // CLOCK FUNCTIONS:
    this.time.addEvent({
      delay: 10,
      callback: () => {
        this.score++;
        this.scoreBoard.setText(`Score: ${this.score}`);
      },
      loop: true,
    });
    // this.time.addEvent({
    //   delay: 5000,
    //   callback: () => {
    //     generateGrape(this.player.x);
    //   },
    //   loop: true,
    // });

    this.updateStatsBoard = () => {
      this.statsBoard.setText(
        `Jumps: ${this.player.jumps}, Ducks: ${this.player.ducks}`
      );
    };

    //Motion controls
    //this.webcam = new WebCam(this.player, this, 0, 0, 'webcam');
  }

  update(time, delta) {
    const { width, height } = this.scale;

    frontClouds.tilePositionX += 0.5;
    backClouds.tilePositionX += 0.25;

    // game over
    if (this.player.y > height) {
      this.scene.start('EndlessScene');
    }
    this.player.x = gameOptions.playerStartPosition[0];

    // recycling platforms
    let minDistance = width;
    let rightmostPlatformHeight = 0;
    this.platformGroup.getChildren().forEach(function (platform) {
      let platformDistance = width - platform.x - platform.displayWidth / 2;
      if (platformDistance < minDistance) {
        minDistance = platformDistance;
        rightmostPlatformHeight = platform.y;
      }
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      let nextPlatformWidth = Phaser.Math.Between(
        gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]
      );
      let platformRandomHeight =
        gameOptions.platformHeightScale *
        Phaser.Math.Between(
          gameOptions.platformHeightRange[0],
          gameOptions.platformHeightRange[1]
        );
      console.log(rightmostPlatformHeight);
      let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      let minPlatformHeight = height * gameOptions.platformVerticalLimit[0];
      let maxPlatformHeight = height * gameOptions.platformVerticalLimit[1];
      let nextPlatformHeight = Phaser.Math.Clamp(
        nextPlatformGap,
        minPlatformHeight,
        maxPlatformHeight
      );
      this.addPlatform(
        nextPlatformWidth,
        width + nextPlatformWidth / 2,
        nextPlatformHeight
      );
    }
    this.player.update(delta);
  }
}
