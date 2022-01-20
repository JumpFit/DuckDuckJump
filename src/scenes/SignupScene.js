import * as phaser from 'phaser';
import axios from 'axios';

export default class SignupScene extends phaser.Scene {
  constructor() {
    super('SignupScene');
    this.state = {};
  }

  /*
  init runs each time a scene is initialized
  any key-value pairs you attach in an obj
  as the second argument in this.scene.start()
  will be able to be accessed by the scene it is passed to
  */

  preload() {
    this.load.html('signupform', 'assets/text/signupform.html');
  }

  create() {
    //signup form
    const scene = this;

    scene.inputElement = scene.add.dom(400, 300).createFromCache('signupform');

    scene.inputElement.addListener('click');
    scene.inputElement.on('click', async function (event) {
      if (event.target.name === 'signupButton') {
        const username = scene.inputElement.getChildByName('username').value;
        const password = scene.inputElement.getChildByName('password').value;
        const firstName = scene.inputElement.getChildByName('firstName').value;
        const lastName = scene.inputElement.getChildByName('lastName').value;
        const birthday = scene.inputElement.getChildByName('birthday').value;
        const weight = scene.inputElement.getChildByName('weight').value;
        const heightFeet =
          scene.inputElement.getChildByName('heightFeet').value;
        const heightInches =
          scene.inputElement.getChildByName('heightInches').value;

        console.log(
          username,
          password,
          firstName,
          lastName,
          birthday,
          weight,
          heightFeet,
          heightInches
        );

        const newUser = await axios.post('/auth/signup', {
          username,
          password,
          firstName,
          lastName,
          birthday,
          weight,
          heightFeet,
          heightInches,
        });

        console.log('NEW USER!!!!', newUser);

        // window.localStorage.setItem('token', newUser.data.token);
        // const token = window.localStorage.getItem('token');
        // console.log('TOKEN!!!', token);
        // if (token) {
        //   const res = await axios.get('/auth/me', {
        //     headers: {
        //       authorization: token,
        //     },
        //   });
        // }

        if (newUser !== null) {
          scene.scene.stop('SignupScene');
          scene.scene.launch('LoginScene');
        }
      }

      if (event.target.name === 'redirectLoginButton') {
        scene.scene.stop('SignupScene');
        scene.scene.launch('LoginScene');
      }
    });
  }

  update() {}
}
