import * as Phaser from 'phaser';
import Camera from '../pose-detection/Camera';
import WebCam from '../classes/WebCam';

const camera = new Camera();

export default class WebcamSetup extends Phaser.Scene {
  constructor() {
    super('WebcamSetup');
    this.selectVideoInput = this.selectVideoInput.bind(this);
    this.state = {};
  }

  preload() {}

  create() {
    this.document = this.add
      .dom(this.scale.width / 2, this.scale.height / 2)
      .createFromHTML('<select id="input-select"></select>')
      .setDepth(1);
    this.inputSelect = this.document.getChildByID('input-select');
    this.inputSelect.addEventListener('change', this.selectVideoInput);
    this.populateInputSelect();
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
      this,
      this,
      this.scale.width / 2,
      this.scale.height / 2,
      'webcam',
      camera,
      true
    ).setFlipX(true);

    this.events.on('neutral', () => {
      console.log('neutral');
    });

    this.events.on('duck', () => {
      console.log('duck');
    });

    this.events.on('jump', () => {
      console.log('jump');
    });
  }

  selectVideoInput() {
    camera.setVideoDeviceId(this.inputSelect.value);
    this.webcam.updateStream();
  }
}
