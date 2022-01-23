import * as Phaser from 'phaser';
import config from './config';
import PlayScene from './scenes/PlayScene';
import SignupScene from './scenes/SignupScene';
import LoginScene from './scenes/LoginScene';
import MainMenuScene from './scenes/MainMenuScene';

class Game extends Phaser.Game {
  constructor() {
    // adds config file into the game
    super(config);

    // adds scenes into the game
    this.scene.add('MainMenuScene', MainMenuScene);
    this.scene.add('LoginScene', LoginScene);
    this.scene.add('SignupScene', SignupScene);
    this.scene.add('PlayScene', PlayScene);

    // initially loads in scene, will set as Login for now
    this.scene.start('MainMenuScene');
  }
}

window.onload = function () {
  window.game = new Game();
};
