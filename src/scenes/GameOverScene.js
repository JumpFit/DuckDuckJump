import * as Phaser from 'phaser';
import { STATS_COLOR, ACCENT_COLOR } from '../utils/constants';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
    this.state = {};
  }

  init({ webcam, score, grapes, jumps, ducks, caloriesBurned }) {
    this.webcam = webcam;
    this.score = score;
    this.grapes = grapes;
    this.jumps = jumps;
    this.ducks = ducks;
    this.caloriesBurned = caloriesBurned;
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

    // background with score, grape, calories burned
    scene.add
      .image(0, 0, 'gameoverBackground')
      .setOrigin(0)
      .setDepth(0)
      .setDisplaySize(width, height);

    // STATS

    // Score:
    const score = scene.add
      .text(width * 0.58, height * 0.378, `${this.score || 0}`, {
        fontSize: 85,
        fontFamily: 'HortaRegular',
        color: STATS_COLOR,
      })
      .setDepth(1)
      .setShadow(3.5, 3.5, ACCENT_COLOR);

    // Grapes:
    const grapes = scene.add
      .text(width * 0.58, height * 0.475, `${this.grapes || 0}`, {
        fontSize: 85,
        fontFamily: 'HortaRegular',
        color: STATS_COLOR,
      })
      .setDepth(1)
      .setShadow(3.5, 3.5, ACCENT_COLOR);

    // Calories Burned:

    const caloriesBurned = scene.add
      .text(width * 0.58, height * 0.57, `${this.caloriesBurned || 0}`, {
        fontSize: 85,
        fontFamily: 'HortaRegular',
        color: STATS_COLOR,
      })
      .setDepth(1)
      .setShadow(3.5, 3.5, ACCENT_COLOR);

    // loads main menu button
    const mainmenuButton = scene.add
      .image(width * 0.028, height * 0.935, 'mainmenuButton')
      .setOrigin(0, 1)
      .setDepth(1)
      .setInteractive({ useHandCursor: true });

    mainmenuButton.on('pointerdown', function () {
      scene.scene.stop('GameOverScene');
      scene.scene.start('MainMenuScene', { webcam: scene.webcam });
    });

    // loads play again button
    const playagainButton = scene.add
      .image(width * 0.99, height * 0.95, 'playagainButton')
      .setOrigin(1, 1)
      .setDepth(1)
      .setInteractive({ useHandCursor: true });

    playagainButton.on('pointerdown', function () {
      scene.scene.stop('GameOverScene');
      scene.webcam.scene.playAgain();
    });
  }

  update() {}
}
