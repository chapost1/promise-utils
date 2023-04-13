const executeInReverseOrder = require('../src/execute-in-reverse-order')

describe('executeInReverseOrder', () => {
  test.concurrent('should return an error and the index of the failed promise', async () => {
    const promises = [
      () => Promise.resolve('first'),
      () => Promise.reject(new Error('Something went wrong')),
      () => Promise.resolve('third')
    ]

    const [error, failedOperationIndex] = await executeInReverseOrder(promises)
    expect(error).toBeInstanceOf(Error)
    expect(failedOperationIndex).toBe(1)
  })

  test.concurrent('should return an error and the index of the failed promise after 3 attempts', async () => {
    const promises = [
      () => Promise.resolve('first'),
      () => Promise.reject(new Error('Something went wrong')),
      () => Promise.resolve('third')
    ]

    const [error, failedOperationIndex] = await executeInReverseOrder(promises, 3)
    expect(error).toBeInstanceOf(Error)
    expect(failedOperationIndex).toBe(1)
  })

  test.concurrent('should not return an error if all promises succeed', async () => {
    const promises = [
      () => Promise.resolve('first'),
      () => Promise.resolve('second'),
      () => Promise.resolve('third')
    ]

    const [error, failedOperationIndex] = await executeInReverseOrder(promises)
    expect(error).toBeNull()
    expect(failedOperationIndex).toBe(-1)
  })

  test.concurrent('should not return an error if the array is empty', async () => {
    const promises = []

    const [error, failedOperationIndex] = await executeInReverseOrder(promises)
    expect(error).toBeNull()
    expect(failedOperationIndex).toBe(-1)
  })

  test.concurrent('should return an error if the array contains a non-function', async () => {
    const promises = [
      () => Promise.resolve('first'),
      'second',
      () => Promise.resolve('third')
    ]

    const [error, failedOperationIndex] = await executeInReverseOrder(promises)
    expect(error).toBeInstanceOf(Error)
    expect(failedOperationIndex).toBe(1)
  })

  test.concurrent('should return an error if the array contains a non-promise', async () => {
    const promises = [
      () => Promise.resolve('first'),
      () => 'second',
      () => Promise.resolve('third')
    ]

    const [error, failedOperationIndex] = await executeInReverseOrder(promises)
    expect(error).toBeInstanceOf(Error)
    expect(failedOperationIndex).toBe(1)
  })

  test.concurrent('should call the promises in reverse order', async () => {
    const logs = []
    const promises = [
      () => Promise.resolve('first').then(() => logs.push('first')),
      () => Promise.resolve('second').then(() => logs.push('second')),
      () => Promise.resolve('third').then(() => logs.push('third'))
    ]

    const [error, failedOperationIndex] = await executeInReverseOrder(promises)
    expect(error).toBeNull()
    expect(failedOperationIndex).toBe(-1)
    expect(logs).toEqual(['third', 'second', 'first'])
  })

  test.concurrent('should call the promises in reverse order after 3 attempts', async () => {
    const logs = []
    let counter = 0
    const promises = [
      () => Promise.resolve('first').then(() => logs.push('first')),
      () => {
        counter += 1
        if (counter < 3) {
          return Promise.reject(new Error('Something went wrong'))
        }
        return Promise.resolve('second').then(() => logs.push('second'))
      },
      () => Promise.resolve('third').then(() => logs.push('third'))
    ]

    const [error, failedOperationIndex] = await executeInReverseOrder(promises, 3)
    expect(error).toBeNull()
    expect(failedOperationIndex).toBe(-1)
    expect(logs).toEqual(['third', 'second', 'first'])
  })

  test.concurrent('should not touch the original array', async () => {
    const promises = [
      () => Promise.resolve('first'),
      () => Promise.resolve('second'),
      () => Promise.resolve('third')
    ]

    const originalPromises = [...promises]

    const [error, failedOperationIndex] = await executeInReverseOrder(promises)
    expect(error).toBeNull()
    expect(failedOperationIndex).toBe(-1)
    expect(promises.length).toEqual(originalPromises.length)
  })
})
