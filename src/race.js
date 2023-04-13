const wrap = require('./wrap')

/**
 * Wraps an array of promises to return the first object with the data with its index (first promise to finish)
 *
 * or the error and the index of the promise that failed
 *
 * In other words: It returns the first promise that resolves or rejects
 * @template T
 * @param {Promise<T>[]} promises
 * @returns {Promise<[Error, T, number]>}
 * @throws {TypeError} if the input is not an array
 * @example
 * const [error, data, index] = await promiseUtils.race([fetch('https://example.com'), fetch('https://example.com')]);
 * if (error) {
 *   console.error(error);
 * }
 * console.log(data);
 * console.log(index);
 */
const race = promises => {
  // check if the input is an array
  if (!Array.isArray(promises)) {
    throw new TypeError('Expected an array of promises')
  }
  // edge case: if the array is empty, return nullish values
  if (promises.length === 0) {
    return Promise.resolve([null, null, -1])
  }
  // because wrap resolves the promise, even if it is rejected, we can use Promise.any
  // as Promise.any returns the first promise that resolves.
  // If the promise is rejected, it will be resolved with the error
  return Promise.any(promises.map((promise, index) => {
    return wrap(promise).then(([error, data]) => {
      return [error, data, index]
    })
  }))
}

module.exports = race
