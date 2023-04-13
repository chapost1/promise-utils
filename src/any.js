/**
 * Wraps an array of promises to return the first resolved promise with its index
 *
 * If all promises are rejected, it will return the errors ordered and null for the data
 *
 * In other words: It returns the first promise that resolves or if all promises are rejected, it returns the errors
 * @template T
 * @param {Promise<T>[]} promises
 * @returns {Promise<[Error[], T, number]>}
 * @throws {TypeError} if the input is not an array
 * @example
 * const [rejectedErrors, resolvedData, resolvedIndex] = await promiseUtils.any([fetch('https://example.com'), fetch('https://example.com')]);
 * if (rejectedErrors) {
 *  console.error(rejectedErrors);
 * }
 * console.log(resolvedData);
 * console.log(resolvedIndex);
 */
const any = promises => {
  // check if the input is an array
  if (!Array.isArray(promises)) {
    throw new TypeError('Expected an array of promises')
  }
  // edge case: if the array is empty, return nullish values
  if (promises.length === 0) {
    return Promise.resolve([null, null, -1])
  }

  // we need to aggregate the errors, so we can return them
  // and to resolve the promise only if all promises are rejected
  // or if one promise is resolved

  return new Promise(resolve => {
    // create an array with the same length as the input array
    const rejectedErrors = new Array(promises.length).fill(null)

    let rejectedCount = 0

    promises.forEach((promise, index) => {
      promise.then(data => {
        // if one promise is resolved, resolve the promise with the data
        resolve([null, data, index])
      }).catch(error => {
        rejectedCount++
        rejectedErrors[index] = error
        // if all promises are rejected, resolve the promise with the errors
        if (rejectedCount === promises.length) {
          resolve([rejectedErrors, null, null])
        }
      })
    })
  })
}

module.exports = any
