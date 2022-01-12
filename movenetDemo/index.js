/* global poseDetection:readonly */

const video = document.getElementById('video');
const table = document.getElementById('table');
const videoSelect = document.getElementById('videoSelect');
const startButton = document.getElementById('startButton');

startButton.addEventListener('click', () => {
  const videoDeviceId = videoSelect.value;
  if (videoDeviceId) {
    app(videoDeviceId);
  }
});

// Update table with pose info
const updateTable = (poses) => {
  const header = `<tr><td>name</td><td>x</td><td>y</td><td>score</td></tr>`;
  const rows = poses[0].keypoints
    .map(
      (bodyPart) =>
        `<tr><td>${bodyPart.name}</td><td>${bodyPart.x}</td><td>${bodyPart.y}</td><td>${bodyPart.score}</td></tr>`
    )
    .join('');
  table.innerHTML = header + rows;
};

// Fill out the select table with video devices:
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

// calculate distance between 2 points:
const calcDistance = (v1, v2) => {
  const dX = Math.abs(v1.x - v2.x);
  const dY = Math.abs(v1.y - v2.y);
  return Math.sqrt(dX * dX + dY * dY);
};

// Create detector function
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

// Get stream function
const getStream = async (videoDeviceId) => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: videoDeviceId,
      },
      audio: false,
    });
  } catch (error) {
    console.log(error);
  }
};

// Main app
const app = async (videoDeviceId) => {
  const detector = await createDetector();
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
      const poses = await detector.estimatePoses(video);

      // If we have poses:
      if (poses.length) {
        updateTable(poses);
        const points = poses[0].keypoints;
        console.log(calcDistance(points[1], points[2]));
      }
    }, 1000);
  } catch (error) {
    detector.dispose();
    alert(error);
  }
};
