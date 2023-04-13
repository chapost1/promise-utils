const any = require('../src/any')
const delay = require('../src/delay')

describe('any', () => {
  test.concurrent('returns the first resolved promise with its index', async () => {
    const resolvedIndex = 2
    const resolvedData = 'resolved'
    const resolvedData2 = 'resolved2'
    const rejectedData = 'rejected'

    const promises = [Promise.reject(rejectedData), delay(1000).then(() => resolvedData), Promise.resolve(resolvedData2)]

    const [rejectedErrors, data, index] = await any(promises)
    expect(rejectedErrors).toBe(null)
    expect(data).toBe(resolvedData2)
    expect(index).toBe(resolvedIndex)
  })

  test.concurrent('returns the only resolved promise with its index', async () => {
    const resolvedIndex = 1
    const resolvedData = 'resolved'
    const rejectedData = 'rejected'

    const promises = [Promise.reject(rejectedData), Promise.resolve(resolvedData), Promise.reject(rejectedData)]

    const [rejectedErrors, data, index] = await any(promises)
    expect(rejectedErrors).toBe(null)
    expect(data).toBe(resolvedData)
    expect(index).toBe(resolvedIndex)
  })

  test.concurrent('returns the rejected errors if all promises are rejected', async () => {
    const rejectedData = 'rejected'
    const promises = [Promise.reject(rejectedData), Promise.reject(rejectedData), Promise.reject(rejectedData)]

    const [rejectedErrors, data, index] = await any(promises)
    expect(rejectedErrors.length).toBe(promises.length)
    expect(rejectedErrors.every(error => error === rejectedData)).toBe(true)
    expect(data).toBe(null)
    expect(index).toBe(null)
  })

  test.concurrent('should handle empty array of promises', async () => {
    const result = await any([])
    const [rejectedErrors, data, index] = result
    expect(rejectedErrors).toEqual(null)
    expect(data).toBe(null)
    expect(index).toBe(-1)
  })

  test.concurrent('should throw typeError if input is not an array', async () => {
    const promises = 'not an array'
    try {
      await any(promises)
      expect(true).toBe(false)// should not reach this line
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
    }
  })
})
