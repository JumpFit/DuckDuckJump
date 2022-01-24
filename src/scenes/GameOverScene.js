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
  }

  update() {}
}
