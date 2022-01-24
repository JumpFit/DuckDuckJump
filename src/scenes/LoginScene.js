import * as Phaser from 'phaser';
import axios from 'axios';

export default class LoginScene extends Phaser.Scene {
  constructor() {
    super('LoginScene');
    this.state = {};
  }

  init(data) {}

  preload() {
    this.load.image(
      'backgroundImage',
      'assets/backgrounds/backgroundImage.png'
    );
    this.load.html('loginform', 'assets/text/loginform.html');
  }

  create() {
    // login form
    const scene = this;
    const { width, height } = this.scale;

    scene.add
      .image(0, 0, 'backgroundImage')
      .setOrigin(0)
      .setDepth(0)
      .setDisplaySize(width, height);

    scene.inputElement = scene.add
      .dom(width / 2, height / 2)
      .createFromCache('loginform')
      .setDepth(1);

    scene.inputElement.addListener('click');
    scene.inputElement.on('click', async function (event) {
      if (event.target.name === 'loginButton') {
        const username = scene.inputElement.getChildByName('username').value;
        const password = scene.inputElement.getChildByName('password').value;

        console.log(username, password);

        const loggedinUser = await axios.post('/auth/login', {
          username,
          password,
        });

        // // window.localStorage.setItem('token', newUser.data.token);
        // // const token = window.localStorage.getItem('token');
        // // console.log('TOKEN!!!', token);
        // // if (token) {
        // //   const res = await axios.get('/auth/me', {
        // //     headers: {
        // //       authorization: token,
        // //     },
        // //   });
        // // }

        if (loggedinUser !== null) {
          scene.scene.stop('LoginScene');
          scene.scene.launch('MainMenuScene');
        }
      }

      if (event.target.name === 'redirectSignupButton') {
        scene.scene.stop('LoginScene');
        scene.scene.launch('SignupScene');
      }
    });
  }

  update() {}
}
