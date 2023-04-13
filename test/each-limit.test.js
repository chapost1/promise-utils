const eachLimit = require('../src/each-limit')
const delay = require('../src/delay')

describe('eachLimit', () => {
  test.concurrent('throws TypeError if input is not an array', async () => {
    await expect(eachLimit({}, 1, async () => { })).rejects.toThrow(TypeError)
  })

  test.concurrent('throws TypeError if asyncOperation is not a function', async () => {
    await expect(eachLimit([], 1, {})).rejects.toThrow(TypeError)
  })

  test.concurrent('throws Error if limit is 0 or less', async () => {
    await expect(eachLimit([], 0, async () => { })).rejects.toThrow(Error)
  })

  test.concurrent('returns an empty array if no items are given', async () => {
    const result = await eachLimit([], 1, async () => { })
    expect(result).toEqual([])
  })

  test.concurrent('sets limit to the number of items if limit is greater than the number of items', async () => {
    const items = [1, 2, 3]
    const result = await eachLimit(items, 4, async (item) => {
      return item
    })
    expect(result).toEqual([[null, 1], [null, 2], [null, 3]])
  })

  test.concurrent('returns an array of results/errors in the same order', async () => {
    const results = await eachLimit([1, 2, 3], 2, async (item) => {
      return item
    })
    expect(results).toEqual([[null, 1], [null, 2], [null, 3]])
  })

  test.concurrent('should limit the number of concurrent operations', async () => {
    let activeOperations = 0
    let maxActiveOperations = 0

    const incrementActiveOperations = () => {
      activeOperations++
      maxActiveOperations = Math.max(activeOperations, maxActiveOperations)
    }

    const decrementActiveOperations = () => {
      activeOperations--
    }

    const asyncOperation = async item => {
      incrementActiveOperations()
      await delay(10)
      decrementActiveOperations()
      return item
    }

    const items = Array.from({ length: 100 }, (_, i) => i)
    const limit = 10

    await eachLimit(items, limit, asyncOperation)

    expect(maxActiveOperations).toEqual(limit)
  }, 10000)

  test.concurrent('should not raise an exception if asyncOperation is actually sync and throws an error', async () => {
    const items = [1, 2, 3]
    const asyncOperation = jest.fn(item => {
      if (item === 2) {
        throw new Error('Something went wrong')
      }

      return item
    })

    const results = await eachLimit(items, 2, asyncOperation)
    expect(results).toEqual([[null, 1], [new Error('Something went wrong'), null], [null, 3]])
    expect(asyncOperation).toHaveBeenCalledTimes(3)
  })
})
