/* global poseDetection:readonly */

const video = document.getElementById('video');
const videoSelect = document.getElementById('videoSelect');
const startButton = document.getElementById('startButton');
const display = document.getElementById('display');
let detector;

// Listen for user to press start
startButton.addEventListener('click', () => {
  const videoDeviceId = videoSelect.value;
  beginPoseDetection(videoDeviceId, 60);
});

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
  });
});

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
    const video = videoDeviceId
      ? {
          deviceId: videoDeviceId,
        }
      : { facingMode: 'user' };
    return await navigator.mediaDevices.getUserMedia({
      video,
      audio: false,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Empty Pose Class
 */
class EmptyPose {
  constructor() {
    this.leftAnkleQueue = [];
    this.rightAnkleQueue = [];
  }
}

// Begin Pose Detection
const beginPoseDetection = async (videoDeviceId, fps) => {
  display.innerText = 'Here we go!';
  let base = new EmptyPose();
  try {
    const stream = await getStream(videoDeviceId);
    video.srcObject = stream;
    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
    video.play();

    setInterval(async () => {
      // Estimate the pose
      const poses = await detector.estimatePoses(video);

      // If a pose exists:
      if (poses.length) {
        const points = poses[0].keypoints;

        // Make sure we have all needed skeleton points:
        let confident = true;
        const skeletonPoints = [5, 6, 11, 12, 13, 14, 15, 16];
        for (let i of skeletonPoints) {
          if (points[i].score < 0.65) {
            confident = false;
            break;
          }
        }

        // If we are confident in our points:
        if (confident) {
          // Check if shoulder width has changed much.  If so, user has moved closer or further from camera, so start with fresh base data
          const shoulderWidth = calcDistance(points[5], points[6]);
          base.shoulderWidth = base.shoulderWidth || shoulderWidth;
          if (
            Math.abs(shoulderWidth - base.shoulderWidth) / base.shoulderWidth >
            0.1
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
          if (base.leftAnkleQueue.length > fps * 1.5) {
            base.leftAnkleQueue.shift();
            base.rightAnkleQueue.shift();
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
            dLeftAnkle >= 0.29 * base.anklesToKnees &&
            dRightAnkle >= 0.29 * base.anklesToKnees
          ) {
            display.innerText = 'jump';
          } else if (
            // SQUAT CONDITIONS:
            Math.abs(leftKneeY - leftHipY) <= 0.71 * base.hipToKnees &&
            Math.abs(rightKneeY - rightHipY) <= 0.71 * base.hipToKnees
          ) {
            display.innerText = 'squat';
          } else {
            // NEUTRAL:
            display.innerText = 'neutral';
          }
        }
      }
    }, 1000 / fps);
  } catch (error) {
    console.log(error);
  }
};

// Main app
const app = async () => {
  try {
    detector = await createDetector();
  } catch (error) {
    detector.dispose();
    alert(error);
  }
};

app();
