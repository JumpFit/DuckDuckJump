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

  create() {
    const scene = this;

    scene.add.image(0, 0, 'backgroundImage').setOrigin(0).setDepth(0);
    scene.add.image(0, 0, 'title').setOrigin(0).setDepth(1);
    scene.add.image(0, 0, 'ducks').setOrigin(0).setDepth(1);

    const loginButton = scene.add
      .image(28, 55, 'login')
      .setOrigin(0)
      .setDepth(2)
      .setInteractive({ userHandCursor: true });
    loginButton.on('pointerdown', function () {
      scene.scene.stop('MainMenuScene');
      scene.scene.start('LoginScene');
    });

    const signupButton = scene.add
      .image(1393, 60, 'signup')
      .setOrigin(0)
      .setDepth(2)
      .setInteractive({ userHandCursor: true });
    signupButton.on('pointerdown', function () {
      scene.scene.stop('MainMenuScene');
      scene.scene.start('SignupScene');
    });

    const howToPlayButton = scene.add
      .image(40, 780, 'howtoplay')
      .setOrigin(0)
      .setDepth(2)
      .setInteractive({ userHandCursor: true });
    howToPlayButton.on('pointerdown', function () {
      scene.scene.stop('MainMenuScene');
      scene.scene.start('PlayScene');
    });

    const leaderboardButton = scene.add
      .image(1257, 785, 'leaderboard')
      .setOrigin(0)
      .setDepth(2)
      .setInteractive({ userHandCursor: true });
    leaderboardButton.on('pointerdown', function () {});

    const startGameButton = scene.add
      .image(538, 720, 'startgame')
      .setOrigin(0)
      .setDepth(2)
      .setInteractive({ userHandCursor: true });
    startGameButton.on('pointerdown', function () {
      scene.scene.stop('MainMenuScene');
      scene.scene.start('EndlessScene');
    });
  }

  update() {}
}
