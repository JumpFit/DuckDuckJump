/* global poseDetection:readonly */

const video = document.getElementById('video');
const table = document.getElementById('table');
const videoSelect = document.getElementById('videoSelect');
const startButton = document.getElementById('startButton');
const display = document.getElementById('display');
const data = document.getElementById('data');

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
  // console.log('started');
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

    // let captureNumber = 0;

    // document.addEventListener('keydown', async (evt) => {
    //   console.log(evt);
    //   if (evt.key === 'PageUp') {
    //     evt.preventDefault();
    //     const poses = await detector.estimatePoses(video);
    //     if (poses.length) {
    //       captureNumber++;
    //       console.log(`CAPTURE: ${captureNumber}`);
    //       updateTable(poses);
    //       console.log(JSON.stringify(poses));
    //     }
    //   }
    // });

    const begin = async () => {
      display.innerText = 'almost there...';
      const base = {};

      setInterval(async () => {
        const poses = await detector.estimatePoses(video);

        // If we have poses:
        if (poses.length) {
          updateTable(poses);
          const points = poses[0].keypoints;
          let confident = true;
          for (let i = 11; i <= 16; i++) {
            if (points[i].score < 0.6) {
              confident = false;
              break;
            }
          }
          if (confident) {
            const leftAnkleY = points[15].y;
            const rightAnkleY = points[16].y;
            const leftKneeY = points[13].y;
            const rightKneeY = points[14].y;
            const leftHipY = points[11].y;
            const rightHipY = points[12].y;

            base.leftAnkleY = base.leftAnkleY || leftAnkleY;
            base.rightAnkleY = base.rightAnkleY || rightAnkleY;
            base.hipToKnees =
              base.hipToKnees ||
              Math.max(
                Math.abs(leftKneeY - leftHipY),
                Math.abs(rightKneeY - rightHipY)
              );

            base.leftAnkleY = Math.max(base.leftAnkleY, leftAnkleY);
            base.rightAnkleY = Math.max(base.rightAnkleY, rightAnkleY);
            base.hipToKnees = Math.max(
              base.hipToKnees,
              Math.abs(leftKneeY - leftHipY),
              Math.abs(rightKneeY - rightHipY)
            );

            const leftAnkleToKnee = Math.abs(leftAnkleY - leftKneeY);
            const rightAnkleToKnee = Math.abs(rightAnkleY - rightKneeY);
            const dLeftAnkle = Math.abs(leftAnkleY - base.leftAnkleY);
            const dRightAnkle = Math.abs(rightAnkleY - base.rightAnkleY);
            data.innerHTML = `<p>${dLeftAnkle} : ${leftAnkleToKnee}</p><p>${dRightAnkle} : ${rightAnkleToKnee}</p>`;

            if (
              Math.min(
                Math.abs(leftKneeY - leftHipY),
                Math.abs(rightKneeY - rightHipY)
              ) <=
              0.63 * base.hipToKnees
            ) {
              display.innerText = 'squat';
            } else if (
              dLeftAnkle >= 0.42 * leftAnkleToKnee &&
              dRightAnkle >= 0.42 * rightAnkleToKnee
            ) {
              display.innerText = 'jump';
            } else {
              display.innerText = 'neutral';
            }
          }
          // console.log(calcDistance(points[1], points[2]));
        }
      }, 33);
    };
    display.innerText = 'get ready!';
    setTimeout(begin, 5000);
  } catch (error) {
    detector.dispose();
    alert(error);
  }
};