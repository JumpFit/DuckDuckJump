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
  }

  create() {
    const scene = this;

    scene.add.image(0, 0, 'backgroundImage').setOrigin(0);
    scene.add.image(-200, 0, 'title').setOrigin(0);
    scene.add.image(-200, 0, 'ducks').setOrigin(0);
  }

  update() {}
}
