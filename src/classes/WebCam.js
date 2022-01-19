import Phaser from 'phaser';
import Camera from '../pose-detection/Camera';
import Detector from '../pose-detection/detector';

export default class WebCam extends Phaser.GameObjects.Video {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    scene.add.existing(this);
    this.init();
  }
  async init() {
    const camera = new Camera();
    const detector = new Detector();
    const [stream] = await Promise.all([camera.getStream(), detector.init()]);
    this.loadMediaStream(stream);

    const squat = () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown' })
      );
    };

    const jump = () => {
      console.log('jump');
    };

    const neutral = () => {
      console.log('neutral');
    };

    const error = () => {
      console.log('not in frame');
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
