const each = require('../src/each')

describe('each', () => {
  test.concurrent('should return an array of results/errors in the same order', async () => {
    const items = [1, 2, 3, 4, 5]
    const asyncOperation = jest.fn(async item => item * 2)

    const results = await each(items, asyncOperation)
    expect(results).toEqual([[null, 2], [null, 4], [null, 6], [null, 8], [null, 10]])
    expect(asyncOperation).toHaveBeenCalledTimes(5)
  })

  test.concurrent('should return an array of errors when one or more of the promises are rejected', async () => {
    const items = [1, 2, 3, 4, 5]
    const asyncOperation = jest.fn(async item => {
      if (item === 3) {
        throw new Error('Something went wrong')
      }

      return item * 2
    })

    const results = await each(items, asyncOperation)
    expect(results).toEqual([[null, 2], [null, 4], [new Error('Something went wrong'), null], [null, 8], [null, 10]])
    expect(asyncOperation).toHaveBeenCalledTimes(5)
  })

  test.concurrent('should throw a TypeError if the input is not an array', async () => {
    const items = {}
    const asyncOperation = jest.fn()

    try {
      await each(items, asyncOperation)
      expect(true).toBe(false)// should not reach this line
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
    }

    expect(asyncOperation).toHaveBeenCalledTimes(0)
  })

  test.concurrent('should throw an error if the async operation is not a function', async () => {
    const items = [1, 2, 3, 4, 5]

    try {
      await each(items, {})
      expect(true).toBe(false)// should not reach this line
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
    }
  })

  test.concurrent('should return a empty array if array is empty', async () => {
    const items = []
    const asyncOperation = jest.fn()
    const result = await each(items, asyncOperation)
    expect(result).toEqual([])
    expect(asyncOperation).toHaveBeenCalledTimes(0)
  })

  test.concurrent('should not throw an error if the async operation is actually sync and throws an error', async () => {
    const items = [1, 2, 3]
    const asyncOperation = jest.fn(item => {
      if (item === 2) {
        throw new Error('Something went wrong')
      }

      return item
    })

    const results = await each(items, asyncOperation)
    expect(results).toEqual([[null, 1], [new Error('Something went wrong'), null], [null, 3]])
    expect(asyncOperation).toHaveBeenCalledTimes(3)
  })
})
