import * as Phaser from 'phaser';
import axios from 'axios';
import { gameOptions, BACKGROUND_COLOR } from '../utils/constants';
import { totalCalsBurned } from '../utils/calculators';
import { Player } from '../classes/Player';

export default class EndlessScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndlessScene' });
  }

  preload() {
    this.load.image('red-grape', 'assets/collectibles/red-grape.png');
    this.load.image('front-clouds', 'assets/front-clouds.png');
    this.load.image('back-clouds', 'assets/back-clouds.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.atlas(
      'duck',
      'assets/characters/duck.png',
      'assets/characters/duck.json'
    );
  }

  init(webcam) {
    this.webcam = webcam;
  }

  create() {
    const { width, height } = this.scale;
    this.backClouds = this.add.tileSprite(
      width / 2,
      75,
      width,
      150,
      'back-clouds'
    );
    this.frontClouds = this.add.tileSprite(
      width / 2,
      75,
      width,
      150,
      'front-clouds'
    );
    this.addedPlatforms = 0;

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
    this.webcam.setPlayer(this.player);

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

    // group with all active grapes.
    this.grapeGroup = this.add.group({
      removeCallback: function (grape) {
        grape.scene.grapePool.add(grape);
      },
    });

    // grape pool
    this.grapePool = this.add.group({
      removeCallback: function (grape) {
        grape.scene.grapeGroup.add(grape);
      },
    });

    //generate starting platform
    this.addPlatform(
      width,
      width / 2,
      height * gameOptions.platformVerticalLimit[1]
    );

    //create collision between platforms and player
    this.physics.add.collider(this.player, this.platformGroup);

    this.physics.add.overlap(
      this.player,
      this.grapeGroup,
      function (player, grape) {
        this.grapes++;
        this.grapesBoard.setText(`Grapes: ${this.grapes}`);
        this.grapeGroup.killAndHide(grape);
        this.grapeGroup.remove(grape);
      },
      null,
      this
    );

    // CLOCK FUNCTIONS:
    this.time.addEvent({
      delay: 10,
      callback: () => {
        this.score++;
        this.scoreBoard.setText(`Score: ${this.score}`);
      },
      loop: true,
    });

    this.updateStatsBoard = () => {
      this.statsBoard.setText(
        `Jumps: ${this.player.jumps}, Ducks: ${this.player.ducks}`
      );
    };
  }

  async update(time, delta) {
    const { width, height } = this.scale;

    this.frontClouds.tilePositionX += 0.5;
    this.backClouds.tilePositionX += 0.25;

    // GAME OVER
    if (this.player.y > height) {
      this.webcam.endDetection();

      // calculates the total calories burned per game
      const calsBurned = totalCalsBurned(
        150,
        this.player.jumps,
        this.player.ducks
      );

      this.scene.stop('EndlessScene');

      // creates game instance in database
      const newGame = await axios.post('/api/games', {
        score: this.score,
        jumps: this.player.jumps,
        ducks: this.player.ducks,
        caloriesBurned: calsBurned,
      });

      // starts Game Over Scene with stats passed through
      this.scene.start('GameOverScene', {
        score: this.score,
        jumps: this.player.jumps,
        ducks: this.player.ducks,
        grapes: this.grapes,
        caloriesBurned: calsBurned,
        webcam: this.webcam,
      });
    }

    this.generatePlatform();
    this.player.x = gameOptions.playerStartPosition[0];

    // recycling grapes
    this.grapeGroup.getChildren().forEach(function (grape) {
      if (grape.x < -grape.displayWidth / 2) {
        this.grapeGroup.killAndHide(grape);
        this.grapeGroup.remove(grape);
      }
    }, this);

    this.player.update(delta);
  }

  //main logic to handle platforms
  addPlatform = (platformWidth, posX, posY) => {
    const { width, height } = this.scale;
    this.addedPlatforms++;
    let platform;
    //use a platform from the platform pool if there is one
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
      //create a platform and add it to the pool using these values if none are available
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
    //distance between platform spawns
    platform.displayWidth = platformWidth;
    this.nextPlatformDistance = Phaser.Math.Between(
      gameOptions.spawnRange[0],
      gameOptions.spawnRange[1]
    );

    this.generateGrape(posX, posY, platform);
  };

  //function that handles platform updates
  generatePlatform = () => {
    const { width, height } = this.scale;

    // recycling platforms
    let minDistance = width;
    let rightmostPlatformHeight = 0;
    this.platformGroup.getChildren().forEach(function (platform) {
      //platform position on screen
      let platformDistance = width - platform.x - platform.displayWidth / 2;
      //when platform appears on screen
      if (platformDistance < minDistance) {
        //track its progress
        minDistance = platformDistance;
        //record its height
        rightmostPlatformHeight = platform.y;
      }
      //if platform goes off screen
      if (platform.x < -platform.displayWidth / 2) {
        //get rid of the platform
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    // adding new platforms
    //if latest platform is spawnRange pixels away from right side
    if (minDistance > this.nextPlatformDistance) {
      //create a platform of a random width between the size ranges
      let nextPlatformWidth = Phaser.Math.Between(
        gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]
      );
      //give it a height scaled by a value between the height range ratios
      let platformRandomHeight =
        gameOptions.platformHeightScale *
        Phaser.Math.Between(
          gameOptions.platformHeightRange[0],
          gameOptions.platformHeightRange[1]
        );
      //Keep track of possible gap between latest and next platform
      let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      let minPlatformHeight = height * gameOptions.platformVerticalLimit[0];
      let maxPlatformHeight = height * gameOptions.platformVerticalLimit[1];
      //Force next platform's height gap to be between the two given values to keep it fair
      let nextPlatformHeight = Phaser.Math.Clamp(
        nextPlatformGap,
        minPlatformHeight,
        maxPlatformHeight
      );
      //add the new platform to the screen
      this.addPlatform(
        nextPlatformWidth,
        width + nextPlatformWidth / 2,
        nextPlatformHeight
      );
    }
  };

  generateGrape = (posX, posY, platform) => {
    // is there a grape over the platform?
    if (this.addedPlatforms > 1) {
      if (Phaser.Math.Between(1, 100) <= gameOptions.grapePercent) {
        if (this.grapePool.getLength()) {
          let grape = this.grapePool.getFirst();
          grape.x = posX;
          grape.y = posY - 40;
          grape.alpha = 1;
          grape.active = true;
          grape.visible = true;
          this.grapePool.remove(grape);
        } else {
          let grape = this.physics.add.sprite(posX, posY - 40, 'red-grape');
          grape.setImmovable(true);
          grape.setVelocityX(platform.body.velocity.x);
          this.grapeGroup.add(grape);
        }
      }
    }
  };
}
