const { BACKGROUND_COLOR } = require('../constants');

export default {
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
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
