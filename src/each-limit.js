
const wrap = require('./wrap')
const safeAsyncOperation = require('./safe-async-operation')

/**
 * Gets an array of items and an async operation and runs the async operation on each item
 *
 * with a limit of how many can run at the same time
 *
 * Returns an array of the results/errors in the same order
 * @template T
 * @param {any[]} items
 * @param {number} limit
 * @param {Function<any>} asyncOperation
 * @returns {Promise<[Error, T][]>}
 * @throws {Error} If the limit is 0 or less
 * @throws {TypeError} If the input is not an array
 * @example
 * const results = await promiseUtils.eachLimit(
 *  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
 * 3,
 * async (item) => {
 *  await promiseUtils.delay(1000)
 * return item
 * }
 * )
 * console.log(results)
 * // [
 * //   [null, 1],
 * //   [null, 2],
 * //   [null, 3],
 * //   [null, 4],
 * //   [null, 5],
 * //   [null, 6],
 * //   [null, 7],
 * //   [null, 8],
 * //   [null, 9],
 * //   [null, 10]
 * // ]
 */
const eachLimit = async (items, limit, asyncOperation) => {
  // if the limit is 0 or less, throw an error
  if (limit <= 0) {
    throw new Error('Limit must be greater than 0')
  }

  // if the input is not an array, throw a TypeError
  if (!Array.isArray(items)) {
    throw new TypeError('Input must be an array')
  }

  if (typeof asyncOperation !== 'function') {
    throw new TypeError('asyncOperation must be a function')
  }

  // if there are no items, return an empty array
  if (items.length === 0) {
    return Promise.resolve([])
  }

  // if the limit is greater than the number of items, set the limit to the number of items
  if (items.length < limit) {
    limit = items.length
  }

  // create an array to store the results/errors
  const results = new Array(items.length)

  // maintain the index of the item in the original array
  const itemsWithIndexes = items.map(
    (item, maintainedIndex) => [item, maintainedIndex]
  )

  // keep track of how many async operations are done
  let doneCounter = 0

  return new Promise(resolve => {
    // each time an async operation is done, run another one, if there are any left
    // thus, there will always be a maximum of limit async operations running at the same time
    const scheduleNewTaskOnComplete = async ([item, maintainedIndex]) => {
      // run the async operation and get the result/error
      const [error, result] = await wrap(safeAsyncOperation(asyncOperation, item))
      // increment the number of completed async operations
      doneCounter++
      // push the result/error to the results array
      results[maintainedIndex] = [error, result]
      // if there are any items left, run another async operation
      if (itemsWithIndexes.length > 0) {
        // run more async operations, as there is an empty slot
        scheduleNewTaskOnComplete(itemsWithIndexes.shift())
      } else if (doneCounter === items.length) {
        // if there are no items left and all async operations are done, resolve the promise
        resolve(results)
      }
    }

    // run the first chunk of async operations (limit)
    for (let index = 0; index < limit; index++) {
      scheduleNewTaskOnComplete(itemsWithIndexes.shift())
    }
  })
}

module.exports = eachLimit
