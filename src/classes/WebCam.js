import Phaser from 'phaser';
import Camera from '../pose-detection/Camera';
import Detector from '../pose-detection/Detector';

export default class WebCam extends Phaser.GameObjects.Video {
  constructor(player, scene, x, y, key) {
    super(scene, x, y, key);
    this.player = player;
    this.setVisible(false);
    scene.add.existing(this);
    this.init();
  }
  async init() {
    const camera = new Camera();
    const detector = new Detector();
    const [stream] = await Promise.all([camera.getStream(), detector.init()]);
    this.loadMediaStream(stream);

    const squat = () => {
      this.player.emit('duck');
      this.scene.showCamError = false;
    };

    const jump = () => {
      this.player.emit('jump');
      this.scene.showCamError = false;
    };

    const neutral = () => {
      this.player.emit('neutral');
      this.scene.showCamError = false;
    };

    const error = () => {
      this.scene.showCamError = true;
    };

    await new Promise((resolve) => {
      this.video.onloadeddata = () => {
        resolve(this.video);
      };
    });
    this.play();
    detector.detectPoses(this.video, squat, jump, neutral, error);
  }
}
