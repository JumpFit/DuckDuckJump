import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { calcDistance } from './helpers';
import EmptyPose from './EmptyPose';

export default class Detector {
  constructor() {
    this.DETECTOR_CONFIG = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    this.MIN_CONFIDENCE = 0.3;
    this.SHOULDER_CONFIDENCE = 0.4;
    this.rafId = null;
    this.base = new EmptyPose();
  }

  async init() {
    try {
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        this.DETECTOR_CONFIG
      );
    } catch (error) {
      if (this.detector) {
        this.detector.dispose();
        this.detector = null;
      }
      console.log(error);
    }
  }
  /**
   * Begin pose detection on video source
   * @param {HTMLVideoElement} video input stream
   * @param {Function} squatFn callback when squat is detected
   * @param {Function} jumpFn callback when jump is detected
   * @param {Function} neutralFn callback when neutral is detected
   * @param {Function} errorFn callback when pose cannot be detected
   */
  async detectPoses(
    video,
    squatFn = () => {},
    jumpFn = () => {},
    neutralFn = () => {},
    errorFn = () => {}
  ) {
    if (!this.detector) {
      await this.init();
    }
    try {
      const poses = await this.detector.estimatePoses(video);
      // If a pose exists:
      if (poses.length) {
        const points = poses[0].keypoints;
        // Make sure we have all needed skeleton points:
        let confident = true;
        const skeletonPoints = [5, 6, 11, 12, 13, 14, 15, 16];
        for (let i of skeletonPoints) {
          if (points[i].score < this.MIN_CONFIDENCE) {
            confident = false;
            break;
          }
        }
        if (!confident) {
          errorFn();
        } else {
          // Check if shoulder width has changed much.  If so, user has moved closer or further from camera, so start with fresh base data
          const shoulderWidth =
            points[5].score > this.SHOULDER_CONFIDENCE &&
            points[6].score > this.SHOULDER_CONFIDENCE
              ? calcDistance(points[5], points[6])
              : null;
          this.base.shoulderWidth = this.base.shoulderWidth || shoulderWidth;
          if (
            shoulderWidth &&
            Math.abs(shoulderWidth - this.base.shoulderWidth) /
              this.base.shoulderWidth >
              0.09
          ) {
            this.base = new EmptyPose();
          }

          // Set current points:
          const leftAnkleY = points[15].y;
          const rightAnkleY = points[16].y;
          const leftKneeY = points[13].y;
          const rightKneeY = points[14].y;
          const leftHipY = points[11].y;
          const rightHipY = points[12].y;

          // Add ankles to Queue:
          this.base.leftAnkleQueue.push(leftAnkleY);
          this.base.rightAnkleQueue.push(rightAnkleY);

          // Remove ankle data older than 1.5s from queue
          const elapsedTime = (performance || Date).now() - this.base.timer;
          if (this.base.leftAnkleQueue.length > 1 && elapsedTime > 1500) {
            this.base.leftAnkleQueue.shift();
            this.base.rightAnkleQueue.shift();
            this.base.timer = (performance || Date).now();
          }
          this.base.leftAnkleY = Math.max(...this.base.leftAnkleQueue);
          this.base.rightAnkleY = Math.max(...this.base.leftAnkleQueue);

          // Update other base data
          this.base.hipToKnees =
            this.base.hipToKnees ||
            Math.max(
              Math.abs(leftKneeY - leftHipY),
              Math.abs(rightKneeY - rightHipY)
            );

          this.base.anklesToKnees =
            this.base.anklesToKnees ||
            Math.max(
              Math.abs(leftAnkleY - leftKneeY),
              Math.abs(rightAnkleY - rightKneeY)
            );

          this.base.hipToKnees = Math.max(
            this.base.hipToKnees,
            Math.abs(leftKneeY - leftHipY),
            Math.abs(rightKneeY - rightHipY)
          );

          this.base.anklesToKnees = Math.max(
            this.base.anklesToKnees,
            Math.abs(leftAnkleY - leftKneeY),
            Math.abs(rightAnkleY - rightKneeY)
          );

          // Calculate height of feet off "ground"
          const dLeftAnkle = Math.abs(leftAnkleY - this.base.leftAnkleY);
          const dRightAnkle = Math.abs(rightAnkleY - this.base.rightAnkleY);

          if (
            // JUMP CONDITIONS::
            dLeftAnkle >= 0.22 * this.base.anklesToKnees &&
            dRightAnkle >= 0.22 * this.base.anklesToKnees
          ) {
            jumpFn();
          } else if (
            // SQUAT CONDITIONS:
            Math.abs(leftKneeY - leftHipY) <= 0.66 * this.base.hipToKnees &&
            Math.abs(rightKneeY - rightHipY) <= 0.66 * this.base.hipToKnees
          ) {
            squatFn();
          } else {
            // NEUTRAL:
            neutralFn();
          }
        }
      }
      this.rafId = requestAnimationFrame(() =>
        this.detectPoses(video, squatFn, jumpFn, neutralFn, errorFn)
      );
    } catch (error) {
      console.log(error);
      this.detector.dispose();
      this.detector = null;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
    }
  }

  endDetection() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Disposes of the TF pose detector
   */
  destroy() {
    if (this.detector) {
      this.detector.dispose();
      this.detector = null;
    }
  }
}
