const allSettled = require('../src/all-settled')

describe('allSettled', () => {
  test.concurrent('resolves an array of objects with the data or error, once all promises have resolved or rejected', async () => {
    const resolvedData = { id: 1 }
    const rejectedError = new Error('Failed to fetch data')

    const resolvedPromise = Promise.resolve(resolvedData)
    const rejectedPromise = Promise.reject(rejectedError)

    const results = await allSettled([resolvedPromise, rejectedPromise])

    expect(results).toEqual([
      [null, resolvedData],
      [rejectedError, null]
    ])
  })

  test.concurrent('should resolve to an array of arrays with errors and data if all promises resolve', async () => {
    const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]
    const result = await allSettled(promises)

    expect(result).toEqual([[null, 1], [null, 2], [null, 3]])
  })

  test.concurrent('should resolve to an array of arrays with errors and data if some promises reject', async () => {
    const promises = [Promise.resolve(1), Promise.reject(new Error('error')), Promise.resolve(3)]
    const result = await allSettled(promises)

    expect(result).toEqual([[null, 1], [new Error('error'), null], [null, 3]])
  })

  test.concurrent('should resolve to an array of arrays with errors and data if all promises reject', async () => {
    const promises = [Promise.reject(new Error('error 1')), Promise.reject(new Error('error 2')), Promise.reject(new Error('error 3'))]
    const result = await allSettled(promises)

    expect(result).toEqual([[new Error('error 1'), null], [new Error('error 2'), null], [new Error('error 3'), null]])
  })

  test.concurrent('never rejects', async () => {
    const rejectedError = new Error('Failed to fetch data')

    const rejectedPromise = Promise.reject(rejectedError)

    await expect(allSettled([rejectedPromise])).resolves.toEqual([
      [rejectedError, null]
    ])
  })

  test.concurrent('should handle empty array of promises', async () => {
    const result = await allSettled([])
    expect(result).toEqual([])
  })

  test.concurrent('should throw typeError if input is not an array', async () => {
    const promises = 'not an array'
    try {
      await allSettled(promises)
      expect(true).toBe(false)// should not reach this line
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
    }
  })
})
