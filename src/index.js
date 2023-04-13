// @ts-check

/**
 * @typedef {Object} PromiseUtils
 * @property {import('./wrap')} wrap
 * @property {import('./delay')} delay
 * @property {import('./all')} all
 * @property {import('./all-settled')} allSettled
 * @property {import('./any')} any
 * @property {import('./each')} each
 * @property {import('./race')} race
 * @property {import('./execute-in-reverse-order')} executeInReverseOrder
 * @property {import('./each-limit')} eachLimit
 * @property {import('./each-ordered-jit')} eachOrderedJit
 */

/**
 * @type {PromiseUtils}
 */
module.exports = Object.freeze({
  wrap: require('./wrap'),
  delay: require('./delay'),
  all: require('./all'),
  allSettled: require('./all-settled'),
  any: require('./any'),
  executeInReverseOrder: require('./execute-in-reverse-order'),
  each: require('./each'),
  race: require('./race'),
  eachLimit: require('./each-limit'),
  eachOrderedJit: require('./each-ordered-jit')
})
