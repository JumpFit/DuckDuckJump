export default class EmptyPose {
  constructor() {
    this.leftAnkleQueue = [];
    this.rightAnkleQueue = [];
    this.timer = (performance || Date).now();
  }
}
