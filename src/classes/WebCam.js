import Phaser from 'phaser';
import Camera from '../pose-detection/Camera';
import Detector from '../pose-detection/Detector';

export default class WebCam extends Phaser.GameObjects.Video {
  constructor(player, scene, x, y, key, camera, visible) {
    super(scene, x, y, key);
    this.camera = camera;
    this.player = player;
    this.setVisible(!!visible);
    scene.add.existing(this);

    this.error = this.error.bind(this);
    this.squat = this.squat.bind(this);
    this.jump = this.jump.bind(this);
    this.neutral = this.neutral.bind(this);

    this.init();
  }
  async init() {
    const camera = this.camera || new Camera();
    this.detector = new Detector();
    const [stream] = await Promise.all([
      camera.getStream(),
      this.detector.init(),
    ]);
    this.loadMediaStream(stream);

    await this.playVideo();
    this.detectPoses();
  }

  async updateStream() {
    if (this.detector) {
      this.detector.endDetection();
    }
    const stream = await this.camera.getStream();
    this.video.srcObject = stream;

    await this.playVideo();
    await this.detectPoses();
  }

  async playVideo() {
    await new Promise((resolve) => {
      this.video.onloadeddata = () => {
        resolve(this.video);
      };
    });
    this.play();
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
    this.scene.showCamError = false;
  }

  jump() {
    this.player.emit('jump');
    this.scene.showCamError = false;
  }

  neutral() {
    this.player.emit('neutral');
    this.scene.showCamError = false;
  }

  error() {
    this.scene.showCamError = true;
  }
}
