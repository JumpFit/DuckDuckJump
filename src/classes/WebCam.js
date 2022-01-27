import Phaser from 'phaser';
import Camera from '../pose-detection/Camera';
import Detector from '../pose-detection/Detector';
import { FONT } from '../utils/constants';

export default class WebCam extends Phaser.GameObjects.Video {
  constructor(
    player,
    scene,
    x,
    y,
    key,
    options = { camera: null, visible: false }
  ) {
    super(scene, x, y, key);
    this.removeVideoElementOnDestroy = true;
    this.camera = options.camera;
    this.player = player;
    this.setVisible(!!options.visible);
    scene.add.existing(this).setDepth(1);
    this.error = this.error.bind(this);
    this.squat = this.squat.bind(this);
    this.jump = this.jump.bind(this);
    this.neutral = this.neutral.bind(this);

    this.init();
  }
  async init() {
    const camera = this.camera || new Camera();

    this.boundary = this.scene.add
      .rectangle(
        this.scene.scale.width * 0.5,
        this.scene.scale.height * 0.5,
        this.camera.videoOptions.width,
        this.camera.videoOptions.height,
        0x000000
      )
      .setStrokeStyle(3, 0xffffff);
    this.scene.add
      .text(
        this.scene.scale.width * 0.5,
        this.scene.scale.height * 0.5,
        'Loading...',
        {
          fontFamily: FONT,
          fontSize: '2rem',
        }
      )
      .setOrigin(0.5);

    this.detector = new Detector();
    [this.stream] = await Promise.all([
      camera.getStream(),
      this.detector.init(),
    ]);
    this.loadMediaStream(this.stream);

    await this.playVideo();
    this.detectPoses();
  }

  async updateStream() {
    if (this.detector) {
      this.detector.endDetection();
    }
    this.stream = await this.camera.getStream();
    this.video.srcObject = this.stream;
    try {
      await this.playVideo();
      this.detectPoses();
    } catch (error) {
      console.log(error);
    }
  }

  async playVideo() {
    try {
      await new Promise((resolve) => {
        this.video.onloadeddata = () => {
          resolve(this.video);
        };
      });
      if (this.scene) {
        this.play();
      } else {
        this.destroy();
      }
    } catch (error) {
      console.log(error);
    }
  }

  detectPoses() {
    this.detector.detectPoses(
      this.video,
      this.squat,
      this.jump,
      this.neutral,
      this.error
    );
  }

  squat() {
    this.player.emit('duck');
    if (this.player.scene) this.player.scene.showCamError = false;
  }

  jump() {
    this.player.emit('jump');
    if (this.player.scene) this.player.scene.showCamError = false;
  }

  neutral() {
    this.player.emit('neutral');
    if (this.player.scene) this.player.scene.showCamError = false;
  }

  error() {
    if (this.player.scene) this.player.scene.showCamError = true;
  }

  endDetection() {
    this.detector.endDetection();
  }

  setPlayer(player) {
    this.endDetection();
    this.player = player;
    this.detectPoses();
  }

  destroy() {
    if (this.detector) {
      this.detector.destroy();
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    super.destroy();
  }
}
