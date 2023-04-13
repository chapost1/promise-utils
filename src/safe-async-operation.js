
/**
 * Wraps an async operation in a promise, to catch errors in case the operation is synchronous.
 * @template T
 * @param {Function<any>} asyncOperation
 * @param  {...any} args
 * @returns {Promise<T>}
 * @example
 * const syncOperation = () => {
 *  throw new Error('This is a synchronous error')
 * }
 *
 * const safe = safeAsyncOperation(syncOperation)
 *
 * safe.then(([error, data]) => {
 * if (error) {
 * console.error(error)
 * }
 * console.log(data)
 * })
 * // [Error: This is a synchronous error]
 * // undefined
 */
const safeAsyncOperation = (asyncOperation, ...args) => {
  if (typeof asyncOperation !== 'function') {
    return Promise.reject(new TypeError('Expected a function'))
  }

  // wrap the async operation in a promise, to catch errors of synchronous operations
  return new Promise((resolve, reject) => {
    try {
      // execute the async operation
      const promise = asyncOperation(...args)
      if (promise instanceof Promise) {
        // async operation is a promise
        return promise.then(resolve).catch(reject)
      }
      // async operation is not a promise, but a synchronous operation
      const data = promise
      return resolve(data)
    } catch (error) {
      return reject(error)
    }
  })
}

module.exports = safeAsyncOperation
