/**
 * Convert pounds to kilograms
 * @param {Number} weight  weight in LB
 * @returns {Number} weight in KG
 */
export const lbToKg = (weight) => weight / 2.2046;

/**
 * Calculate calories burned from jumping
 * @param {Number} weight weight in KG
 * @param {Number} jumps number of jumps performed
 * @returns {Integer} calories burned
 */
export const calsBurnedJumping = (weight, jumps) =>
  Math.round(weight * 0.0175 * 0.118 * jumps);

/**
 * Calculate calories burned from squatting
 * @param {Number} weight weight in KG
 * @param {Number} squats number of squats performed
 * @returns {Integer} calories burned
 */
export const calsBurnedSquatting = (weight, squats) =>
  Math.round(weight * 0.0175 * 0.22 * squats);
