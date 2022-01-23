const { BACKGROUND_COLOR } = require('../constants');

export default {
  type: Phaser.AUTO,
  width: 1600,
  height: 900,
  parent: 'game',
  backgroundColor: BACKGROUND_COLOR,
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [],
};
