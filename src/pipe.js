const wrap = require('./wrap')

/**
 * @typedef {Function} AsyncFunction
 * @param {...*} args
 * @returns {Promise<*>}
 * @private
 */

/**
 * @param {...Function|AsyncFunction} fns
 * @returns {boolean}
 * @private
 */
const isAsyncFunction = func => {
  return func.constructor.name === 'AsyncFunction'
}

/**
 * @param {unknown} obj
 * @returns {boolean}
 * @private
 */
const isPromise = obj => {
  return obj && obj instanceof Promise
}

/**
 * @param {...Function|AsyncFunction} fns
 * @returns {boolean}
 * @private
 */
const isSyncFunction = func => {
  return func.constructor.name === 'Function'
}

/**
 * @param {unknown} obj
 * @returns {boolean}
 * @private
 */
const isFunctionType = obj => {
  return typeof obj === 'function'
}

/**
 * @returns {never}
 * @private
 * @throws {Error}
 */
const throwInvalidInputError = () => {
  throw new Error('Invalid input, expected at least one function')
}

/**
 * Gets any number of functions and runs them in order
 *
 * Passes the result of each function to the next one
 *
 * If any of the functions throws an error, the pipe is stopped and the error is thrown
 *
 * If any of the arguments is not a function, an error is thrown
 *
 * If any of the functions is an async function, the result is awaited
 *
 * If any of the functions is a sync function, the result is directly passed to the next function
 *
 * If no functions are passed, an error is thrown
 *
 * Returns the result of the last function
 *
 * Functions in the pipe can be either sync or async
 *
 * @param {...Function|AsyncFunction} fns
 * @returns {Promise<unknown>}
 * @private
 * @throws {Error}
 */
const pipeUtil = async (...fns) => {
  let result = null
  let invokedFunctionResult = null

  if (fns.length === 0) {
    return throwInvalidInputError()
  }

  for (const func of fns) {
    if (isPromise(func)) {
      // Await the result if it's a promise
      result = await func
    } else if (!isFunctionType(func)) {
      return throwInvalidInputError()
    } else if (isAsyncFunction(func)) {
      // Async function, await the result
      result = await func(result)
    } else if (isSyncFunction(func)) {
      // Sync function, directly invoke it
      invokedFunctionResult = func(result)
      if (isPromise(invokedFunctionResult)) {
        // Await the result if it's a promise (in case a promise is returned from a sync function)
        result = await invokedFunctionResult
      } else {
        result = invokedFunctionResult
      }
    } else {
      return throwInvalidInputError()
    }
  }

  return result
}

/**
 * Gets any number of functions and runs them in order
 *
 * Passes the result of each function to the next one
 *
 * If any of the functions throws an error, the pipe is stopped and the error is thrown
 *
 * If any of the arguments is not a function, an error is thrown
 *
 * If any of the functions is an async function, the result is awaited
 *
 * If any of the functions is a sync function, the result is directly passed to the next function
 *
 * If no functions are passed, an error is thrown
 *
 * Returns the result of the last function
 *
 * Functions in the pipe can be either sync or async
 *
 * @template {unknown} T
 * @param {...Function|AsyncFunction} fns
 * @returns {Promise<[Error, T]>}
 * @throws {Error}
 * @example
 *
 * *Both sync and async functions can be used in the pipe
 *
 * const [error, result] = await pipe(
 *  getUsername, // sync function
 *  db.getUser, // async function
 *  user => user.id, // sync function
 *  db.getPosts, // async function
 *  posts => posts.length // sync function
 * )
 *
 * if (error) {
 * console.error(error)
 * return
 * }
 *
 * console.log(result)
 * // => 37
 *
 *
 */
const pipe = async (...fns) => {
  return await wrap(pipeUtil(...fns))
}

module.exports = pipe
