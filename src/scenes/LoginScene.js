import * as Phaser from 'phaser';
import axios from 'axios';

export default class LoginScene extends Phaser.Scene {
  constructor() {
    super('LoginScene');
    this.state = {};
  }

  init(data) {}

  preload() {
    this.load.html('loginform', 'assets/text/loginform.html');
  }

  create() {
    // login form
    const scene = this;

    scene.inputElement = scene.add.dom(400, 300).createFromCache('loginform');

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

        console.log('LOGIN USER!!!!', loggedinUser);

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
          scene.scene.launch('PlayScene');
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
