const wrap = require('./wrap')
const safeAsyncOperation = require('./safe-async-operation')

/**
 * Gets an array of items and an async operation and a feedback function.
 *
 * runs the async operation on each item in parallel
 *
 * calls the feedback function with the result/error of each item Just In Time (JIT) in the same order
 *
 * It means, if the first item takes 10 seconds to finish, the first feedback function will be called after 10 seconds
 *
 * and the second item will be called immediately if it already finished before the first item
 *
 * Returns an array of the results/errors in the same order
 *
 * It throws an error, only if the input is not an array
 * @template T
 * @param {any[]} items
 * @param {Function<any>} asyncOperation
 * @param {(error: Error, res: any) => void} feedbackFunction
 * @returns {Promise<[Error, T][]>}
 * @example
 * const feedbackFunction = (error, res) => {
 *  if (error) {
 *     console.log('error', error)
 * } else {
 *    // do something with the result of the async operation
 *    console.log('res', res)
 * }
 * }
 * const results = await promiseUtils.eachOrderedJit([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async item => {
 *    await resolveIn(1000)
 *   console.log(item)
 *  return item * 2
 * }, feedbackFunction)
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
const eachOrderedJit = async (items, asyncOperation, feedback) => {
  // check if the input is an array
  if (!Array.isArray(items)) {
    throw new TypeError('Expected an array of items')
  }

  // wrap the async operation in a promise to catch errors in case of sync functions
  const results = items.map(item => wrap(safeAsyncOperation(asyncOperation, item)))

  const response = []

  for await (const result of results) {
    feedback(...result)
    response.push(result)
  }

  return response
}

module.exports = eachOrderedJit
