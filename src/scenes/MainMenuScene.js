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
    this.load.image('welcomeback', 'assets/mainmenu/welcomeback.png');
    this.load.image('signout', 'assets/mainmenu/signout.png');
  }

  init(data) {
    if (data) {
      this.webcam = data.webcam;
      this.loggedinUser = data.loggedinUser;
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

    // if not loggedin, login and signup button should show
    if (!window.localStorage.token) {
      const loginButton = scene.add
        .image(width * 0.025, height * 0.05, 'login')
        .setOrigin(0)
        .setDepth(2)
        .setInteractive({ useHandCursor: true });

      loginButton.on('pointerdown', function () {
        scene.scene.stop('MainMenuScene');
        scene.scene.start('LoginScene', { webcam: scene.webcam });
      });

      const signupButton = scene.add
        .image(width * 0.971, height * 0.055, 'signup')
        .setOrigin(1, 0)
        .setDepth(2)
        .setInteractive({ useHandCursor: true });

      signupButton.on('pointerdown', function () {
        scene.scene.stop('MainMenuScene');
        scene.scene.start('SignupScene', { webcam: scene.webcam });
      });
    } else {
      //if loggedin, welcome and signout button should show

      const welcomeBack = scene.add
        .image(width * 0.025, height * 0.05, 'welcomeback')
        .setOrigin(0)
        .setDepth(1);

      const signoutButton = scene.add
        .image(width * 0.971, height * 0.055, 'signout')
        .setOrigin(1, 0)
        .setDepth(2)
        .setInteractive({ useHandCursor: true });

      signoutButton.on('pointerdown', function () {
        window.localStorage.removeItem('token');
        scene.scene.start('MainMenuScene', { webcam: scene.webcam });
      });
    }

    const howToPlayButton = scene.add
      .image(width * 0.025, height * 0.945, 'howtoplay')
      .setOrigin(0, 1)
      .setDepth(2)
      .setInteractive({ useHandCursor: true });

    howToPlayButton.on('pointerdown', function () {
      scene.scene.stop('MainMenuScene');
      if (scene.webcam) {
        scene.webcam.mode = 'PlayScene';
        scene.webcam.scene.playAgain();
      } else {
        scene.scene.start('WebcamSetup', { mode: 'PlayScene' });
      }
    });

    const leaderboardButton = scene.add
      .image(width * 0.98, height * 0.94, 'leaderboard')
      .setOrigin(1, 1)
      .setDepth(2)
      .setInteractive({ useHandCursor: true });

    leaderboardButton.on('pointerdown', function () {
      scene.scene.stop('MainMenuScene');
      scene.scene.start('LeaderBoardScene', { webcam: scene.webcam });
    });

    const startGameButton = scene.add
      .image(width * 0.48, height * 0.875, 'startgame')
      .setDepth(2)
      .setInteractive({ useHandCursor: true });

    startGameButton.on('pointerdown', function () {
      scene.scene.stop('MainMenuScene');
      if (scene.webcam) {
        scene.webcam.mode = 'EndlessScene';
        scene.webcam.scene.playAgain();
      } else {
        scene.scene.start('WebcamSetup', { mode: 'EndlessScene' });
      }
    });
  }

  update() {}
}
