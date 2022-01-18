import * as Phaser from 'phaser';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayScene' });
  }

  preload() {
    this.load.image('star', 'assets/star.png');
    this.load.atlas(
      'duck',
      'assets/characters/duck.png',
      'assets/characters/duck.json'
    );
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, 'star');
    this.add.image(width * 0.5, height * 0.5, 'duck');
  }
}
