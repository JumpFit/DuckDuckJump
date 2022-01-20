/**
 * Check to see if user is on a mobile device
 * @returns {Boolean} true if user is on a mobile device
 */
export const isMobile = () =>
  /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  /Android/i.test(navigator.userAgent);

/**
 * Calculate distance between 2 points
 * @param {Keypoint} v1
 * @param {Keypoint} v2
 * @returns {Number} distance between v1 and v2
 */
export const calcDistance = (v1, v2) => {
  const dX = Math.abs(v1.x - v2.x);
  const dY = Math.abs(v1.y - v2.y);
  ``;
  return Math.sqrt(dX * dX + dY * dY);
};
