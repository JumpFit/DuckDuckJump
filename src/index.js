import * as Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  backgroundColor: '#5DACD8',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [PlayScene],
};

window.game = new Phaser.Game(config);
