const all = require('../src/all')
const delay = require('../src/delay')

describe('all', () => {
  test.concurrent('returns the first rejected promise and its index', async () => {
    const error = new Error('rejected')
    const rejectedPromise = Promise.reject(error)
    const resolvedPromise = Promise.resolve('resolved')
    const result = await all([rejectedPromise, resolvedPromise])
    const [rejectedError, rejectedIndex, orderedResolvedData] = result
    expect(rejectedError).toEqual(error)
    expect(rejectedIndex).toEqual(0)
    expect(orderedResolvedData).toBeNull()
  })

  test.concurrent('returns the first rejected promise and its index when have multiple of rejected', async () => {
    const error1 = new Error('rejected1')
    const error2 = new Error('rejected2')
    const rejectedPromise1 = delay(100).then(() => Promise.reject(error1))
    const rejectedPromise2 = delay(150).then(() => Promise.reject(error2))
    const resolvedPromise = Promise.resolve('resolved')
    const result = await all([rejectedPromise1, rejectedPromise2, resolvedPromise])
    const [rejectedError, rejectedIndex, orderedResolvedData] = result
    expect(rejectedError).toEqual(error1)
    expect(rejectedIndex).toEqual(0)
    expect(orderedResolvedData).toBeNull()
  })

  test.concurrent('returns the resolved data if all promises resolve', async () => {
    const resolvedPromise1 = Promise.resolve('resolved 1')
    const resolvedPromise2 = Promise.resolve('resolved 2')
    const result = await all([resolvedPromise1, resolvedPromise2])
    const [rejectedError, rejectedIndex, orderedResolvedData] = result
    expect(rejectedError).toBeNull()
    expect(rejectedIndex).toBeNull()
    expect(orderedResolvedData).toEqual(['resolved 1', 'resolved 2'])
  })

  test.concurrent('should handle empty array of promises', async () => {
    const result = await all([])
    const [rejectedError, rejectedIndex, orderedResolvedData] = result
    expect(rejectedError).toBeNull()
    expect(rejectedIndex).toBeNull()
    expect(orderedResolvedData).toEqual([])
  })

  test.concurrent('should throw typeError if input is not an array', async () => {
    const promises = 'not an array'
    try {
      await all(promises)
      expect(true).toBe(false)// should not reach this line
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
    }
  })
})
