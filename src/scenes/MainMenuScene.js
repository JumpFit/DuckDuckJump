import * as Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
    this.state = {};
  }

  preload() {
    this.load.image(
      'backgroundImage',
      'assets/backgrounds/backgroundImage1.png'
    );
    this.load.image(
      'backgroundImage2',
      'assets/backgrounds/backgroundImage2.gif'
    );
  }

  create() {
    const scene = this;

    scene.add.image(0, 0, 'backgroundImage1').setOrigin(0);
  }

  update() {}
}
