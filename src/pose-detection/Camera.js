import { isMobile } from './helpers';

export default class Camera {
  constructor(videoDeviceId) {
    this.videoOptions = {
      width: isMobile() ? 360 : 640,
      height: isMobile() ? 270 : 480,
      frameRate: {
        ideal: 60,
      },
    };
    if (videoDeviceId) {
      this.videoOptions.deviceId = videoDeviceId;
    } else {
      this.videoOptions.facingMode = 'user';
    }
  }

  setVideoDeviceId(videoDeviceId) {
    this.videoOptions.deviceId = videoDeviceId;
    if (this.videoOptions.facingMode) {
      delete this.videoOptions.facingMode;
    }
  }

  removeVideoDeviceId() {
    this.videoOptions.facingMode = 'user';
    if (this.videoOptions.deviceId) {
      delete this.videoOptions.deviceId;
    }
  }

  async getStream() {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: this.videoOptions,
        audio: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getUserInputs() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      return await navigator.mediaDevices.enumerateDevices();
    } catch (error) {
      console.log(error);
    }
  }
}
