
/**
 * Returns a promise that resolves after a specified delay.
 * @param {number} ms - The delay in milliseconds.
 * @returns {Promise<void>}
 * @example
 * await promiseUtils.delay(1000);
 * console.log('1 second has passed');
 * // 1 second has passed
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = delay
