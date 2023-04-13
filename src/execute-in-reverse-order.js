const wrap = require('./wrap')

/**
 * Executes an array of promises in reverse order.
 * @param {Array<Function>} promises - An array of promises to execute.
 * @param {number} [attempts] - The number of times to attempt a promise. Defaults to 1.
 * @returns {[Error, number]} - An array containing the error and the index of the failed promise.
 * @example
 * const promises = [
 *   () => Promise.resolve('first'),
 *   () => Promise.resolve('second'),
 *   () => Promise.resolve('third')
 * ]
 * const [error, failedOperationIndex] = await promiseUtils.executeInReverseOrder(promises)
 * if (error) {
 *   console.log('I've failed at index', failedOperationIndex)
 *   console.error(error)
 *   return
 * }
 * console.log('No errors!')
 * // => No errors!
 */
const executeInReverseOrder = async (promises, attempts = 1) => {
  let error = null
  let failedOperationIndex = -1
  let attemptsLeft = attempts

  const promisesCopy = [...promises]

  while (promisesCopy.length > 0) {
    const promise = promisesCopy.pop()
    if (typeof promise !== 'function') {
      error = new Error('Not a function')
      failedOperationIndex = promisesCopy.length
      break
    }

    const [localError] = await wrap(promise())
    attemptsLeft -= 1
    if (localError) {
      if (attemptsLeft === 0) {
        failedOperationIndex = promisesCopy.length
        error = localError
        break
      }

      promisesCopy.push(promise)
      continue
    }

    attemptsLeft = attempts
  }

  return [error, failedOperationIndex]
}

module.exports = executeInReverseOrder
