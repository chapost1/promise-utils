const wrap = require('./wrap')

/**
 * Wraps an array of promises to return an array of objects with the data or error
 *
 * It is similar to Promise.allSettled, but it returns an array of objects instead of an object with the index as key
 *
 * It never rejects, but always resolves
 *
 * It resolves once all promises have resolved or rejected
 *
 * @template T
 * @param {Promise<T>[]} promises
 * @returns {Promise<[Error, T][]>}
 * @throws {TypeError} if the input is not an array
 * @example
 * const result = await promiseUtils.allSettled([fetch('https://example.com'), fetch('https://example.com')]);
 * result.forEach(([error, data]) => {
 *   if (error) {
 *    console.error(error);
 *  }
 * console.log(data);
 * });
 */
const allSettled = promises => {
  // check if the input is an array
  if (!Array.isArray(promises)) {
    throw new TypeError('Expected an array of promises')
  }
  // edge case: if the array is empty, return an empty array
  if (promises.length === 0) {
    return Promise.resolve([])
  }

  // because wrap always resolves the promise, even if it is rejected, we can still use Promise.all
  // as promise.all rejects if one of the promises rejects
  return Promise.all(promises.map(wrap))
}

module.exports = allSettled
