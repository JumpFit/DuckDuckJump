import * as Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import SignupScene from './scenes/SignupScene';
import LoginScene from './scenes/LoginScene';
import { BACKGROUND_COLOR } from './constants';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  backgroundColor: BACKGROUND_COLOR,
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
