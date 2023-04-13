/**
 * Takes an array of promises and returns the first rejected promise along with its index.
 *
 * Returns the resolved data in the order it was passed in if all promises resolve,
 * and null for the error.
 *
 * In other words: It returns the first promise that rejects or if all promises are resolved, it returns the data
 * @template T
 * @param {Promise<T>[]} promises
 * @returns {Promise<[Error, number, T[]]>}
 * @throws {TypeError} if the input is not an array
 * @example
 * const result = await promiseUtils.all([fetch('https://example.com'), fetch('https://example.com')]);
 * const [rejectedError, rejectedIndex, orderedResolvedData] = result;
 * console.error(rejectedError);
 * console.log(rejectedIndex);
 * orderedResolvedData.forEach(data => {
 *  console.log(data);
 * });
 */
const all = promises => {
  // check if the input is an array
  if (!Array.isArray(promises)) {
    throw new TypeError('Expected an array of promises')
  }
  // edge case: if the array is empty, return nullish values
  if (promises.length === 0) {
    return Promise.resolve([null, null, []])
  }

  // it should return error if one of the promises rejects
  return new Promise(resolve => {
    let resolvedCount = 0

    const results = new Array(promises.length).fill(null)

    promises.forEach((promise, index) => {
      promise.then(data => {
        // if all promises have resolved, resolve the promise
        resolvedCount++
        results[index] = data
        if (resolvedCount === promises.length) {
          resolve([null, null, results])
        }
      }).catch(error => {
        // once rejected, return error and its index
        resolve([error, index, null])
      })
    })
  })
}

module.exports = all
