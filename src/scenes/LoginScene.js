import * as Phaser from 'phaser';
import axios from 'axios';

export default class LoginScene extends Phaser.Scene {
  constructor() {
    super('LoginScene');
    this.state = {};
  }

  init(data) {
    if (data) {
      this.webcam = data.webcam;
    }
  }

  preload() {
    this.load.image(
      'backgroundImage',
      'assets/backgrounds/backgroundImage.png'
    );
    this.load.image('login', 'assets/mainmenu/login.png');
    this.load.image('mainmenuButton', 'assets/gameover/mainmenubutton.png');
    this.load.html('loginform', 'assets/text/loginform.html');
  }

  create() {
    // login form
    const scene = this;
    const { width, height } = this.scale;

    // loads background
    scene.add
      .image(0, 0, 'backgroundImage')
      .setOrigin(0)
      .setDepth(0)
      .setDisplaySize(width, height);

    // loads login title
    scene.add
      .image(width * 0.45, height * 0.21, 'login')
      .setOrigin(0)
      .setDepth(1);

    // loads main menu button
    const mainmenuButton = scene.add
      .image(width * 0.028, height * 0.935, 'mainmenuButton')
      .setOrigin(0, 1)
      .setDepth(1)
      .setInteractive({ useHandCursor: true });

    // gives main menu button funcitionality
    mainmenuButton.on('pointerdown', function () {
      scene.scene.stop('LoginScene');
      scene.scene.start('MainMenuScene', { webcam: scene.webcam });
    });

    // loads login html form
    scene.inputElement = scene.add
      .dom(width * 0.597, height * 0.415)
      .createFromCache('loginform')
      .setDepth(1);

    scene.inputElement.addListener('click');

    scene.inputElement.on('click', async function (event) {
      if (event.target.name === 'loginButton') {
        const username = scene.inputElement.getChildByName('username').value;
        const password = scene.inputElement.getChildByName('password').value;

        const loggedUser = await axios.post('/auth/login', {
          username,
          password,
        });

        // stores generated token into window local storage
        window.localStorage.setItem('token', loggedUser.data.token);
        const token = window.localStorage.getItem('token');

        // once token is generated, find user
        const { data: loggedinUser } = await axios.get('/auth/me', {
          headers: {
            authorization: token,
          },
        });

        // once user is found, pass it through to Main Menu
        if (loggedinUser !== null) {
          scene.scene.stop('LoginScene');
          scene.scene.launch('MainMenuScene', {
            loggedinUser: loggedinUser,
            webcam: scene.webcam,
          });
        }
      }

      if (event.target.name === 'redirectSignupButton') {
        scene.scene.stop('LoginScene');
        scene.scene.launch('SignupScene', { webcam: scene.webcam });
      }
    });
  }

  update() {}
}
