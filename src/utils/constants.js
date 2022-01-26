export const BACKGROUND_COLOR = '#5DACD8';

//Several values to use inside of EndlessScene
export const gameOptions = {
  platformSpeedRange: [300, 350], //pixels per second
  spawnRange: [25, 50], //pixels from right of screen latest platform is before next spawns
  platformSizeRange: [300, 400], //width in pixels
  platformHeightRange: [-10, 5], //height range between latest and next platforms
  platformHeightScale: 25, //a scale multiplied by the height range
  platformVerticalLimit: [0.6, 0.9], //min and max height of platforms in a screen ratio
  playerGravity: 600, //gravity value to act on player
  playerStartPosition: [100, 560], //x and y starting position for player
};
