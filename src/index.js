import * as Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import SignupScene from './scenes/SignupScene';
import LoginScene from './scenes/LoginScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  backgroundColor: '#5DACD8',
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [LoginScene, SignupScene, PlayScene],
};

window.game = new Phaser.Game(config);
