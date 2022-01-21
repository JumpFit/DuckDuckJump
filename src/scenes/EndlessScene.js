import * as Phaser from 'phaser';
import { gameOptions, addPlatform } from '../constants';
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
    this.player = new Player(
      this,
      gameOptions.playerStartPosition[0],
      gameOptions.playerStartPosition[1],
      'duck'
    );
    //this.player.setGravityY(gameOptions.playerGravity);

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
    this.addPlatform = (platformWidth, posX) => {
      let platform;
      if (this.platformPool.getLength()) {
        platform = this.platformPool.getFirst();
        platform.x = posX;
        platform.active = true;
        platform.visible = true;
        this.platformPool.remove(platform);
      } else {
        platform = this.physics.add.sprite(
          posX,
          game.config.height * 0.8,
          'platform'
        );
        platform.setImmovable(true);
        platform.setVelocityX(gameOptions.platformStartSpeed * -1);
        this.platformGroup.add(platform);
      }
      platform.displayWidth = platformWidth;
      this.nextPlatformDistance = Phaser.Math.Between(
        gameOptions.spawnRange[0],
        gameOptions.spawnRange[1]
      );
    };

    //generate starting platforms
    this.addPlatform(width, width / 2);

    //create collision between platforms and player
    this.physics.add.collider(this.player, this.platformGroup);
  }
  update(time, delta) {
    console.log(this.player.y);
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
    this.platformGroup.getChildren().forEach(function (platform) {
      let platformDistance = width - platform.x - platform.displayWidth / 2;
      minDistance = Math.min(minDistance, platformDistance);
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      var nextPlatformWidth = Phaser.Math.Between(
        gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]
      );
      this.addPlatform(
        nextPlatformWidth,
        game.config.width + nextPlatformWidth / 2
      );
    }
    this.player.update(delta);
  }
}
