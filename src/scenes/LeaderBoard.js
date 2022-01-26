import axios from 'axios';
import * as Phaser from 'phaser';
import { ACCENT_COLOR } from '../utils/constants';

export default class LeaderBoardScene extends Phaser.Scene {
  constructor() {
    super('LeaderBoardScene');
  }

  init(data) {
    if (data) this.webcam = data.webcam;
  }

  async fetchHighScores() {
    const { data: games } = await axios.get('/api/games');
    this.scoreList.setText(
      games
        .slice(0, 10)
        .map(
          (game) =>
            `${(game.user && game.user.username) || 'Guest'}:\t\t\t${
              game.score
            }`
        )
    );
  }

  preload() {
    this.load.image(
      'backgroundImage',
      'assets/backgrounds/backgroundImage.png'
    );
    this.load.image('leaderboard', 'assets/mainmenu/leaderboard.png');
    this.load.image('mainmenuButton', 'assets/gameover/mainmenubutton.png');
  }

  create() {
    const scene = this;
    const { width, height } = this.scale;

    this.fetchHighScores();

    scene.add
      .image(0, 0, 'backgroundImage')
      .setOrigin(0)
      .setDepth(0)
      .setDisplaySize(width, height);

    scene.add
      .image(width * 0.5, height * 0.01, 'leaderboard')
      .setOrigin(0.5, 0);

    scene.scoreList = scene.add
      .text(width * 0.5, height * 0.5, 'Loading...', {
        fontFamily: 'HortaRegular',
        fontSize: '3rem',
      })
      .setOrigin(0.5)
      .setShadow(2, 2, ACCENT_COLOR);

    const mainmenuButton = scene.add
      .image(width * 0.028, height * 0.935, 'mainmenuButton')
      .setOrigin(0, 1)
      .setDepth(1)
      .setInteractive({ userHandCursor: true });

    mainmenuButton.on('pointerdown', function () {
      scene.scene.stop('LeaderBoardScene');
      scene.scene.start('MainMenuScene', { webcam: scene.webcam });
    });
  }
}
