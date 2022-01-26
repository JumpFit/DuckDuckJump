import * as Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
    this.state = {};
  }

  preload() {
    this.load.image(
      'backgroundImage',
      'assets/backgrounds/backgroundImage.png'
    );
    this.load.image('title', 'assets/mainmenu/title.png');
    this.load.image('ducks', 'assets/mainmenu/ducksinthemiddle.png');
    this.load.image('login', 'assets/mainmenu/login.png');
    this.load.image('signup', 'assets/mainmenu/signup.png');
    this.load.image('howtoplay', 'assets/mainmenu/howtoplay.png');
    this.load.image('leaderboard', 'assets/mainmenu/leaderboard.png');
    this.load.image('startgame', 'assets/mainmenu/startgame.png');
  }

  init(data) {
    if (data) {
      this.webcam = data.webcam;
    }
  }

  create() {
    const scene = this;
    const { width, height } = this.scale;

    scene.add
      .image(0, 0, 'backgroundImage')
      .setOrigin(0)
      .setDepth(0)
      .setDisplaySize(width, height);
    scene.add
      .image(0, 0, 'title')
      .setOrigin(0)
      .setDepth(1)
      .setDisplaySize(width, height);
    scene.add
      .image(0, 0, 'ducks')
      .setOrigin(0)
      .setDepth(1)
      .setDisplaySize(width, height);

    const loginButton = scene.add
      .image(0, 55, 'login')
      .setOrigin(0)
      .setDepth(2)
      .setInteractive({ userHandCursor: true });
    loginButton.on('pointerdown', function () {
      scene.scene.stop('MainMenuScene');
      scene.scene.start('LoginScene');
    });

    const signupButton = scene.add
      .image(width, 60, 'signup')
      .setOrigin(1, 0)
      .setDepth(2)
      .setInteractive({ userHandCursor: true });
    signupButton.on('pointerdown', function () {
      scene.scene.stop('MainMenuScene');
      scene.scene.start('SignupScene');
    });

    const howToPlayButton = scene.add
      .image(0, height * 0.95, 'howtoplay')
      .setOrigin(0, 1)
      .setDepth(2)
      .setInteractive({ userHandCursor: true });
    howToPlayButton.on('pointerdown', function () {
      scene.scene.stop('MainMenuScene');
      if (scene.webcam) {
        scene.webcam.mode = 'PlayScene';
        scene.webcam.scene.playAgain();
      }
      scene.scene.start('WebcamSetup', { mode: 'PlayScene' });
    });

    const leaderboardButton = scene.add
      .image(width, height * 0.95, 'leaderboard')
      .setOrigin(1, 1)
      .setDepth(2)
      .setInteractive({ userHandCursor: true });
    leaderboardButton.on('pointerdown', function () {
      scene.scene.stop('MainMenuScene');
      // links to GameOverScene for testing, will change to leaderboardsceen later
      scene.scene.start('GameOverScene');
    });

    const startGameButton = scene.add
      .image(width / 2, height * 0.89, 'startgame')
      // .setOrigin()
      .setDepth(2)
      .setInteractive({ userHandCursor: true });
    startGameButton.on('pointerdown', function () {
      scene.scene.stop('MainMenuScene');
      if (scene.webcam) {
        scene.webcam.mode = 'EndlessScene';
        scene.webcam.scene.playAgain();
      }
      scene.scene.start('WebcamSetup', { mode: 'EndlessScene' });
    });
  }

  update() {}
}
