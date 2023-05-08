const delay = require('../src/delay')
const pipe = require('../src/pipe')

describe('pipe', () => {
  test.concurrent('should throw an error if no functions are passed', async () => {
    const [error] = await pipe()
    expect(error).toBeInstanceOf(Error)
  })

  test.concurrent('should throw an error if any of the arguments is not a function', async () => {
    const [error] = await pipe('not a function')
    expect(error).toBeInstanceOf(Error)
  })

  test.concurrent('should throw an error if any of the functions throws an error', async () => {
    const [error] = await pipe(() => {
      throw new Error('Something went wrong')
    })
    expect(error).toBeInstanceOf(Error)
  })

  test.concurrent('should call the functions in order', async () => {
    const logs = []
    const [error] = await pipe(
      () => logs.push('first'),
      () => logs.push('second'),
      () => logs.push('third')
    )
    expect(error).toBeNull()
    expect(logs).toEqual(['first', 'second', 'third'])
  })

  test.concurrent('should pass the result of each function to the next one', async () => {
    const [error, result] = await pipe(
      () => 'first',
      first => `${first} second`,
      second => `${second} third`
    )
    expect(error).toBeNull()
    expect(result).toEqual('first second third')
  })

  test.concurrent('should await the result of async functions', async () => {
    const [error, result] = await pipe(
      async () => 'first',
      first => `${first} second`,
      second => `${second} third`
    )
    expect(error).toBeNull()
    expect(result).toEqual('first second third')
  })

  test.concurrent('should return the result of the last function', async () => {
    const [error, result] = await pipe(
      () => 5,
      async arg => {
        await delay(100)
        return arg * 2
      },
      async arg => {
        await delay(100)
        return arg + 5
      }
    )
    expect(error).toBeNull()
    expect(result).toEqual(15)
  })
})
