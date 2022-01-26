import * as Phaser from 'phaser';
import { GREY_BACKGROUND_COLOR } from '../constants';
import { totalCalsBurned } from '../utils/calculators';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
    this.state = {};
  }

  init({ score, grapes, jumps, ducks }) {
    this.score = score;
    this.grapes = grapes;
    this.jumps = jumps;
    this.ducks = ducks;
    console.log('FINAL SCORE!!!', this.score);
    console.log('GRAPES!!!!', this.grapes);
    console.log('JUMPS!!!!', this.jumps);
    console.log('DUCKS!!!!', this.ducks);
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

    // STATS:

    // Score:
    scene.add.text(width * 0.58, height * 0.378, `${this.score || 254840}`, {
      backgroundColor: GREY_BACKGROUND_COLOR,
      fontSize: 87,
      fontFamily: 'HortaRegular',
      color: '#ffde59',
    });

    // Grapes:
    scene.add.text(width * 0.58, height * 0.475, `${this.grapes || 55}`, {
      backgroundColor: GREY_BACKGROUND_COLOR,
      fontSize: 87,
      fontFamily: 'HortaRegular',
      color: '#ffde59',
    });

    // Calories Burned:

    // calculates the total calories burned per game
    const CalsBurned = totalCalsBurned(150, this.jumps, this.add.ducks);

    scene.add.text(width * 0.58, height * 0.57, `${CalsBurned || 450}`, {
      backgroundColor: GREY_BACKGROUND_COLOR,
      fontSize: 87,
      fontFamily: 'Horta',
      color: '#ffde59',
    });

    // loads main menu button
    const mainmenuButton = scene.add
      .image(width * 0.028, height * 0.935, 'mainmenuButton')
      .setOrigin(0, 1)
      .setDepth(1)
      .setInteractive({ userHandCursor: true });

    mainmenuButton.on('pointerdown', function () {
      scene.scene.stop('GameOverScene');
      scene.scene.start('MainMenuScene');
    });

    // loads play again button
    const playagainButton = scene.add
      .image(width * 0.99, height * 0.95, 'playagainButton')
      .setOrigin(1, 1)
      .setDepth(1)
      .setInteractive({ userHandCursor: true });

    playagainButton.on('pointerdown', function () {
      scene.scene.stop('GameOverScene');
      scene.scene.start('EndlessScene');
    });
  }

  update() {}
}
