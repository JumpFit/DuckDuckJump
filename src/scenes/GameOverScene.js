import * as Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
    this.state = {};
  }

  init(data) {
    console.log(data);
    this.webcam = data.webcam;
  }

  preload() {
    this.load.image(
      'gameoverBackground',
      'assets/gameover/gameoverBackground.png'
    );
    this.load.image('mainmenuButton', 'assets/gameover/mainmenubutton.png');
    this.load.image('playagainButton', 'assets/gameover/playagainbutton.png');
  }

  create() {
    const scene = this;
    const { width, height } = this.scale;

    scene.add
      .image(0, 0, 'gameoverBackground')
      .setOrigin(0)
      .setDepth(0)
      .setDisplaySize(width, height);

    const mainmenuButton = scene.add
      .image(width * 0.028, height * 0.935, 'mainmenuButton')
      .setOrigin(0, 1)
      .setDepth(1)
      .setInteractive({ userHandCursor: true });

    mainmenuButton.on('pointerdown', function () {
      scene.scene.stop('GameOverScene');
      scene.scene.stop('WebcamSetup');
      scene.scene.start('MainMenuScene', { webcam: scene.webcam });
    });

    const playagainButton = scene.add
      .image(width * 0.99, height * 0.95, 'playagainButton')
      .setOrigin(1, 1)
      .setDepth(1)
      .setInteractive({ userHandCursor: true });

    playagainButton.on('pointerdown', function () {
      scene.scene.stop('GameOverScene');
      scene.webcam.scene.playAgain();
    });
  }

  update() {}
}
