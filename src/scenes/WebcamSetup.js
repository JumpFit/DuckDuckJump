import * as Phaser from 'phaser';
import Camera from '../pose-detection/Camera';
import WebCam from '../classes/WebCam';

const camera = new Camera();

export default class WebcamSetup extends Phaser.Scene {
  constructor() {
    super('WebcamSetup');

    // VIDEO INPUT
    this.selectVideoInput = this.selectVideoInput.bind(this);

    // METHOD BINDING
    this.beginDetectionTest = this.beginDetectionTest.bind(this);
    this.beginDuckTest = this.beginDuckTest.bind(this);
    this.beginJumpTest = this.beginJumpTest.bind(this);
    this.readyToStartGame = this.readyToStartGame.bind(this);
  }

  preload() {
    this.load.image('mainmenuButton', 'assets/gameover/mainmenubutton.png');
    this.load.image('next', 'assets/webcamsetup/nextbutton.png');
  }

  init({ mode }) {
    this.mode = mode;
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.events.on('shutdown', this.shutdown, this);

    this.mainmenuButton = this.add
      .image(
        this.scale.width * 0.02,
        this.scale.height * 0.95,
        'mainmenuButton'
      )
      .setOrigin(0, 1)
      .setDepth(1)
      .setInteractive({ userHandCursor: true });
    this.mainmenuButton.on('pointerdown', () => {
      this.scene.stop('WebcamSetup');
      this.scene.start('MainMenuScene');
    });

    this.nextButton = this.add
      .image(this.scale.width * 0.98, this.scale.height * 0.95, 'next')
      .setOrigin(1, 1)
      .setDepth(2)
      .setInteractive({ userHandCursor: true });
    this.nextButton.on('pointerdown', () => {
      this.beginDetectionTest();
    });

    this.text = this.add
      .text(
        this.scale.width / 2,
        this.scale.height * 0.95,
        'Select your webcam',
        { fontSize: '2rem', fontFamily: 'HortaRegular' }
      )
      .setOrigin(0.5, 1);

    this.inputSelectHTML = this.add
      .dom(this.scale.width / 2, this.scale.height * 0.05)
      .createFromHTML('<select id="input-select" class="form-select"></select>')
      .setDepth(1)
      .setOrigin(0.5, 0);
    this.inputSelect = this.inputSelectHTML.getChildByID('input-select');
    this.inputSelect.addEventListener('change', this.selectVideoInput);
    this.populateInputSelect();
  }

  update() {
    this.cursors.up.on('down', () => {
      this.events.emit('jump');
    });
    if (this.cursors.down.isDown) {
      this.events.emit('duck');
    }
    this.cursors.up.on('up', () => {
      this.events.emit('neutral');
    });
    this.cursors.down.on('up', () => {
      this.events.emit('neutral');
    });
  }

  shutdown() {
    if (this.webcam) {
      this.webcam.destroy();
    }
  }

  async populateInputSelect() {
    const inputs = await camera.getUserInputs();
    this.inputSelect.innerHTML = inputs
      .map((device) =>
        device.deviceId
          ? `<option value='${device.deviceId}'>${device.label}</option>`
          : ''
      )
      .join('');
    camera.setVideoDeviceId(this.inputSelect.value);
    this.webcam = new WebCam(
      this.events,
      this,
      this.scale.width / 2,
      this.scale.height / 2,
      'webcam',
      { camera, visible: true }
    ).setFlipX(true);
  }

  selectVideoInput() {
    camera.setVideoDeviceId(this.inputSelect.value);
    this.webcam.updateStream();
  }

  beginDetectionTest() {
    this.inputSelectHTML.setVisible(false);
    this.nextButton.setVisible(false);
    const { x, y, width, height } = this.webcam.boundary;
    if (!this.rectangle)
      this.rectangle = this.add.rectangle(x, y, width * 0.8, height * 0.8);
    this.rectangle.setStrokeStyle(3, 0x00ff00).setDepth(1);

    this.text.setText('Center your whole body in the frame!');

    this.events.on('neutral', this.beginDuckTest);
  }

  beginDuckTest() {
    this.events.removeListener('neutral');
    this.text.setText('Now, do a squat!');
    this.events.on('duck', () => {
      this.text.setText('Nice! And back up...');
      this.events.removeListener('duck');
      this.events.on('neutral', this.beginJumpTest);
    });
  }

  beginJumpTest() {
    this.events.removeListener('neutral');
    this.text.setText('Now, do a jump!');
    this.events.on('jump', () => {
      this.events.removeListener('jump');
      this.events.on('neutral', this.readyToStartGame);
    });
  }

  readyToStartGame() {
    this.events.removeListener('neutral');

    let countdown = 3;
    this.text.setText(`Nice!  Get ready to start in ${countdown}`);
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        countdown--;
        if (countdown === 0) {
          this.webcam.endDetection();
          this.time.removeAllEvents();
          this.setVisible(false);
          this.scene.run(this.mode, this.webcam);
        }
        this.text.setText(`Nice!  Get ready to start in ${countdown}`);
      },
      loop: true,
    });
  }

  playAgain() {
    this.setVisible(true);
    this.webcam.setPlayer(this.events);
    this.beginDetectionTest();
  }

  setVisible(isVisible) {
    this.mainmenuButton.setVisible(isVisible);
    this.scene.setVisible(isVisible);
  }
}
