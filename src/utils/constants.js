export const BACKGROUND_COLOR = '#4bb9fa';

export const GREY_BACKGROUND_COLOR = '#9b9b9b';

export const ACCENT_COLOR = '#447FF1';

//Several values to use inside of EndlessScene
export const gameOptions = {
  platformSpeedRange: [300, 400], //pixels per second
  spawnRange: [50, 100], //pixels from right of screen latest platform is before next spawns
  platformSizeRange: [450, 600], //width in pixels
  platformHeightRange: [-10, 20], //height range between latest and next platforms
  platformHeightScale: 50, //a scale multiplied by the height range
  platformVerticalLimit: [0.6, 0.9], //min and max height of platforms in a screen ratio
  playerGravity: 400, //gravity value to act on player
  playerStartPosition: [100, 450], //x and y starting position for player
};
