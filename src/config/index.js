export default {
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  parent: 'game',
  backgroundColor: '#5DACD8',
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
