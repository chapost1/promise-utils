const race = require('../src/race')
const delay = require('../src/delay')

describe('race', () => {
  test.concurrent('should resolve with the first resolved promise data and its index', async () => {
    const mockPromise1 = delay(100).then(() => 'data1')
    const mockPromise2 = delay(200).then(() => 'data2')

    const [error, data, index] = await race([mockPromise1, mockPromise2])

    expect(error).toBeNull()
    expect(data).toEqual('data1')
    expect(index).toEqual(0)
  })

  test.concurrent('should resolve with the first rejected promise error and its index', async () => {
    const mockPromise1 = delay(100).then(() => {
      throw new Error('error1')
    })
    const mockPromise2 = delay(200).then(() => {
      throw new Error('error2')
    })

    const [error, data, index] = await race([mockPromise1, mockPromise2])

    expect(error).toEqual(new Error('error1'))
    expect(data).toBeNull()
    expect(index).toEqual(0)
  })

  test.concurrent('should handle empty array of promises', async () => {
    const [error, data, index] = await race([])

    expect(error).toBeNull()
    expect(data).toBeNull()
    expect(index).toEqual(-1)
  })

  test.concurrent('should throw typeError if input is not an array', async () => {
    const promises = 'not an array'
    try {
      await race(promises)
      expect(true).toBe(false)// should not reach this line
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
    }
  })
})
