import * as Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
    this.state = {};
  }

  preload() {
    this.load.image(
      'gameoverBackground',
      'assets/gameover/gameoverBackground.png'
    );
    this.load.image('mainmenuButton', 'assets/gameover/mainmenuButton.png');
    this.load.image('playagainButton', 'assets/gameover/playagainButton.png');
  }

  create() {
    const scene = this;

    scene.add.image(0, 0, 'gameoverBackground').setOrigin(0).setDepth(0);

    const mainmenuButton = scene.add
      .image(50, 790, 'mainmenuButton')
      .setOrigin(0)
      .setDepth(2)
      .setInteractive({ userHandCursor: true });
    mainmenuButton.on('pointerdown', function () {
      scene.scene.stop('GameOverScene');
      scene.scene.start('MainMenuScene');
    });

    const playagainButton = scene.add
      .image(1130, 730, 'playagainButton')
      .setOrigin(0)
      .setDepth(1)
      .setInteractive({ userHandCursor: true });
    playagainButton.on('pointerdown', function () {
      scene.scene.stop('GameOverScene');
      scene.scene.start('EndlessScene');
    });
  }

  update() {}
}
