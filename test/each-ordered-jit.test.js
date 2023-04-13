const eachOrderedJit = require('../src/each-ordered-jit')
const delay = require('../src/delay')

describe('eachOrderedJit', () => {
  test.concurrent('should run the async operation on each item in parallel', async () => {
    let lastFeedbackResult = 0
    const feedbackFunction = jest.fn((error, res) => {
      if (error) {
        // do nothing
      } else {
        expect(res).toBeGreaterThan(lastFeedbackResult)
        lastFeedbackResult = res
      }
    })

    const results = await eachOrderedJit([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async item => {
      await delay(1000)
      return item * 2
    }, feedbackFunction)

    expect(results).toEqual([
      [null, 2],
      [null, 4],
      [null, 6],
      [null, 8],
      [null, 10],
      [null, 12],
      [null, 14],
      [null, 16],
      [null, 18],
      [null, 20]
    ])
    expect(feedbackFunction.mock.calls.length).toBe(10)
  })

  test.concurrent('should call the feedback function with the result/error of each item Just In Time (JIT) in the same order', async () => {
    let lastFeedbackResult = 0
    const feedbackFunction = jest.fn((error, res) => {
      if (error) {
        // do nothing
      } else {
        expect(res).toBeGreaterThan(lastFeedbackResult)
        lastFeedbackResult = res
      }
    })

    const results = await eachOrderedJit([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async item => {
      await delay(1000)
      return item * 2
    }, feedbackFunction)

    expect(results).toEqual([
      [null, 2],
      [null, 4],
      [null, 6],
      [null, 8],
      [null, 10],
      [null, 12],
      [null, 14],
      [null, 16],
      [null, 18],
      [null, 20]
    ])

    // check that feedbackFunction was called in the same order as the items array
    for (let i = 0; i < 10; i++) {
      expect(feedbackFunction.mock.calls[i][1]).toBe(i * 2 + 2)
    }
  })

  test.concurrent('should return an array of the results/errors in the same order', async () => {
    let lastFeedbackResult = 0
    const feedbackFunction = jest.fn((error, res) => {
      if (error) {
        // do nothing
      } else {
        expect(res).toBeGreaterThan(lastFeedbackResult)
        lastFeedbackResult = res
      }
    })

    const results = await eachOrderedJit([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async item => {
      await delay(1000)
      return item * 2
    }, feedbackFunction)

    expect(results).toEqual([
      [null, 2],
      [null, 4],
      [null, 6],
      [null, 8],
      [null, 10],
      [null, 12],
      [null, 14],
      [null, 16],
      [null, 18],
      [null, 20]
    ])
    expect(feedbackFunction.mock.calls.length).toBe(10)
  })

  test.concurrent('should throw an error if the first argument is not an array', async () => {
    try {
      await eachOrderedJit({}, () => {}, () => {})
    } catch (error) {
      expect(error.message).toBe('Expected an array of items')
    }
  })

  test.concurrent('should call feedback with the result/error of each item Just In Time (JIT) in the same order', async () => {
    const items = [1, 2, 3]
    const asyncOperation = item => Promise.resolve(item * 2)
    const feedback = jest.fn()

    await eachOrderedJit(items, asyncOperation, feedback)

    expect(feedback).toHaveBeenCalledTimes(items.length)
    expect(feedback).toHaveBeenNthCalledWith(1, null, items[0] * 2)
    expect(feedback).toHaveBeenNthCalledWith(2, null, items[1] * 2)
    expect(feedback).toHaveBeenNthCalledWith(3, null, items[2] * 2)
  })

  test.concurrent('should return an array of the results/errors in the same order', async () => {
    const items = [1, 2, 3]
    const asyncOperation = item => Promise.resolve(item * 2)
    const feedback = jest.fn()

    const result = await eachOrderedJit(items, asyncOperation, feedback)

    expect(result).toEqual([
      [null, items[0] * 2],
      [null, items[1] * 2],
      [null, items[2] * 2]
    ])
  })

  test.concurrent('should return an array of the results/errors in the same order even if the async operation throws an error', async () => {
    const items = [1, 2, 3]
    const asyncOperation = async item => {
      if (item === 2) {
        throw new Error('Error')
      }
      return Promise.resolve(item * 2)
    }
    const feedback = jest.fn()

    const result = await eachOrderedJit(items, asyncOperation, feedback)

    expect(result).toEqual([
      [null, items[0] * 2],
      [new Error('Error'), null],
      [null, items[2] * 2]
    ])
  })

  test.concurrent('should return an array of the results/errors in the same order even if the !SYNC! operation throws an error', async () => {
    const items = [1, 2, 3]
    const asyncOperation = item => {
      if (item === 2) {
        throw new Error('Error')
      }
      return Promise.resolve(item * 2)
    }
    const feedback = jest.fn()

    const result = await eachOrderedJit(items, asyncOperation, feedback)

    expect(result).toEqual([
      [null, items[0] * 2],
      [new Error('Error'), null],
      [null, items[2] * 2]
    ])
  })
})
