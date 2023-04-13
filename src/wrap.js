
/**
 * Wraps a promise to return a tuple with the error and the data
 * @template T
 * @param {Promise<T>} promise
 * @returns {Promise<[Error, T]>}
 * @example
 * const [error, data] = await promiseUtils.wrap(fetch('https://example.com'));
 * if (error) {
 *    console.error(error);
 * }
 * console.log(data);
 */
const wrap = promise => {
  if (!(promise instanceof Promise)) {
    return [new Error('promise is expected to be a promise'), null]
  }
  return promise
    .then(data => [null, data])
    .catch(error => [error, null])
}

module.exports = wrap
