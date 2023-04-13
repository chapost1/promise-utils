const allSettled = require('./all-settled')
const safeAsyncOperation = require('./safe-async-operation')

/**
 * Gets an array of items and an async operation and runs the async operation on each item
 *
 * Returns an array of the results/errors in the same order
 * @template T
 * @param {any[]} items
 * @param {Function<any>} asyncOperation
 * @returns {Promise<[Error, T][]>}
 * @throws {TypeError} If the input is not an array
 * @example
 * const results = await promiseUtils.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async item => {
 *    await resolveIn(1000)
 *   console.log(item)
 *  return item * 2
 * })
 * console.log(results)
 * // [
 * //   [null, 2],
 * //   [null, 4],
 * //   [null, 6],
 * //   [null, 8],
 * //   [null, 10],
 * //   [null, 12],
 * //   [null, 14],
 * //   [null, 16],
 * //   [null, 18],
 * //   [null, 20]
 * // ]
 */
const each = (items, asyncOperation) => {
  // check if the input is an array
  if (!Array.isArray(items)) {
    throw new TypeError('Expected an array of items')
  }

  if (typeof asyncOperation !== 'function') {
    throw new TypeError('Expected a function')
  }

  const promises = items.map(item => safeAsyncOperation(asyncOperation, item))

  return allSettled(promises)
}

module.exports = each
