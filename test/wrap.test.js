const wrap = require('../src/wrap')

describe('wrap', () => {
  test.concurrent('returns a tuple with null error and the data if the promise is resolved', async () => {
    const promise = Promise.resolve('data')
    const [error, data] = await wrap(promise)
    expect(error).toBeNull()
    expect(data).toBe('data')
  })

  test.concurrent('returns a tuple with the error and null data if the promise is rejected', async () => {
    const promise = Promise.reject(new Error('error'))
    const [error, data] = await wrap(promise)
    expect(error).toEqual(new Error('error'))
    expect(data).toBeNull()
  })

  test.concurrent('returns a tuple with an error and null data if the input is not a promise', () => {
    const input = 'not a promise'
    const [error, data] = wrap(input)
    expect(error).toBeInstanceOf(Error)
    expect(data).toBeNull()
  })
})
