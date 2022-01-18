/* global poseDetection:readonly */

const video = document.getElementById('video');
const videoSelect = document.getElementById('videoSelect');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const display = document.getElementById('display');
let detector, rafId, base;

let MIN_CONFIDENCE = 0.3,
  SHOULDER_CONFIDENCE = 0.4;

// --- HELPER FUNCTIONS --- //

/**
 * Checks to see if user is on a mobile device
 * @returns {Boolean} true if user is on a mobile device
 */
const isMobile = () =>
  /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  /Android/i.test(navigator.userAgent);

/**
 * Calculate distance between 2 points
 * @param {Keypoint} v1
 * @param {Keypoint} v2
 * @returns {Number} distance between v1 and v2
 */
const calcDistance = (v1, v2) => {
  const dX = Math.abs(v1.x - v2.x);
  const dY = Math.abs(v1.y - v2.y);
  return Math.sqrt(dX * dX + dY * dY);
};

// --- MAIN FUNCTIONS --- //

/**
 * Create detector function
 * @returns {PoseDetector} detector instance
 */
const createDetector = async () => {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
  };
  const detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );

  return detector;
};

/**
 *
 * @param {String} videoDeviceId
 * @returns {Stream} video stream of selected device id
 */
const getStream = async (videoDeviceId) => {
  try {
    const videoOptions = {
      width: isMobile() ? 360 : 640,
      height: isMobile() ? 270 : 480,
      frameRate: {
        ideal: 60,
      },
    };
    video.width = videoOptions.width;
    video.height = videoOptions.height;
    if (videoDeviceId) {
      videoOptions.deviceId = videoDeviceId;
    } else {
      videoOptions.facingMode = 'user';
    }
    return await navigator.mediaDevices.getUserMedia({
      video: videoOptions,
      audio: false,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Loads stream of selected video source
 */
const selectVideoInput = async () => {
  try {
    const stream = await getStream(videoSelect.value);
    video.srcObject = stream;
    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
    video.play();
  } catch (error) {
    alert(error);
  }
};

/**
 * Empty Pose Class
 */
class EmptyPose {
  constructor() {
    this.leftAnkleQueue = [];
    this.rightAnkleQueue = [];
    this.timer = (performance || Date).now();
  }
}

/**
 * MAIN POSE DETECTOR FUNCTION
 */
const getPose = async () => {
  // Estimate the pose
  try {
    const poses = await detector.estimatePoses(video);

    // If a pose exists:
    if (poses.length) {
      const points = poses[0].keypoints;
      // Make sure we have all needed skeleton points:
      let confident = true;
      const skeletonPoints = [5, 6, 11, 12, 13, 14, 15, 16];
      for (let i of skeletonPoints) {
        if (points[i].score < MIN_CONFIDENCE) {
          confident = false;
          break;
        }
      }
      if (!confident) {
        display.innerText = '???';
        display.style.color = 'red';
      } else {
        display.style.color = 'black';
        // Check if shoulder width has changed much.  If so, user has moved closer or further from camera, so start with fresh base data
        const shoulderWidth =
          points[5].score > SHOULDER_CONFIDENCE &&
          points[6].score > SHOULDER_CONFIDENCE
            ? calcDistance(points[5], points[6])
            : null;
        base.shoulderWidth = base.shoulderWidth || shoulderWidth;
        if (
          shoulderWidth &&
          Math.abs(shoulderWidth - base.shoulderWidth) / base.shoulderWidth >
            0.09
        ) {
          base = new EmptyPose();
        }

        // Set current points:
        const leftAnkleY = points[15].y;
        const rightAnkleY = points[16].y;
        const leftKneeY = points[13].y;
        const rightKneeY = points[14].y;
        const leftHipY = points[11].y;
        const rightHipY = points[12].y;

        // Add ankles to Queue:
        base.leftAnkleQueue.push(leftAnkleY);
        base.rightAnkleQueue.push(rightAnkleY);

        // Remove ankle data older than 1.5s from queue
        const elapsedTime = (performance || Date).now() - base.timer;
        if (base.leftAnkleQueue.length > 1 && elapsedTime > 1500) {
          base.leftAnkleQueue.shift();
          base.rightAnkleQueue.shift();
          base.timer = (performance || Date).now();
        }
        base.leftAnkleY = Math.max(...base.leftAnkleQueue);
        base.rightAnkleY = Math.max(...base.leftAnkleQueue);

        // Update other base data
        base.hipToKnees =
          base.hipToKnees ||
          Math.max(
            Math.abs(leftKneeY - leftHipY),
            Math.abs(rightKneeY - rightHipY)
          );

        base.anklesToKnees =
          base.anklesToKnees ||
          Math.max(
            Math.abs(leftAnkleY - leftKneeY),
            Math.abs(rightAnkleY - rightKneeY)
          );

        base.hipToKnees = Math.max(
          base.hipToKnees,
          Math.abs(leftKneeY - leftHipY),
          Math.abs(rightKneeY - rightHipY)
        );

        base.anklesToKnees = Math.max(
          base.anklesToKnees,
          Math.abs(leftAnkleY - leftKneeY),
          Math.abs(rightAnkleY - rightKneeY)
        );

        // Calculate height of feet off "ground"
        const dLeftAnkle = Math.abs(leftAnkleY - base.leftAnkleY);
        const dRightAnkle = Math.abs(rightAnkleY - base.rightAnkleY);

        if (
          // JUMP CONDITIONS::
          dLeftAnkle >= 0.22 * base.anklesToKnees &&
          dRightAnkle >= 0.22 * base.anklesToKnees
        ) {
          display.innerText = 'jump';
          display.style.color = 'blue';
        } else if (
          // SQUAT CONDITIONS:
          Math.abs(leftKneeY - leftHipY) <= 0.66 * base.hipToKnees &&
          Math.abs(rightKneeY - rightHipY) <= 0.66 * base.hipToKnees
        ) {
          display.innerText = 'squat';
          display.style.color = 'green';
        } else {
          // NEUTRAL:
          display.innerText = 'neutral';
        }
      }
    }
    rafId = requestAnimationFrame(getPose);
  } catch (error) {
    detector.dispose();
  }
};

/**
 * Begin pose detection
 */
const beginPoseDetection = () => {
  display.innerText = 'Here we go!';
  base = new EmptyPose();
  getPose();
};

/**
 * End pose detection
 */
const endPoseDetection = () => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  display.innerText = 'CLICK START!';
};

// --- DOM SETUP --- //
// Listen for user to press start
videoSelect.addEventListener('change', selectVideoInput);
startButton.addEventListener('click', beginPoseDetection);
stopButton.addEventListener('click', endPoseDetection);

// Fill out the option select with video devices:
navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    const options = devices
      .map((device) =>
        device.deviceId
          ? `<option value='${device.deviceId}'>${device.label}</option>`
          : ''
      )
      .join('');
    videoSelect.innerHTML = options;
    selectVideoInput();
  });
});

// --- MAIN APP --- //
const app = async () => {
  try {
    detector = await createDetector();
  } catch (error) {
    detector.dispose();
    alert(error);
  }
};

app();
