const safeAsyncOperation = require('../src/safe-async-operation')

describe('safeAsyncOperation', () => {
  test.concurrent('should handle a synchronous error', () => {
    const syncOperation = () => {
      throw new Error('This is a synchronous error')
    }

    const safe = safeAsyncOperation(syncOperation)

    safe.then(data => {
      expect(data).toBe(undefined)
    }).catch(error => {
      expect(error).toBeInstanceOf(Error)
    })
  })

  test.concurrent('should handle an asynchronous error', () => {
    const asyncOperation = () => Promise.reject(new Error('This is an asynchronous error'))

    const safe = safeAsyncOperation(asyncOperation)

    return safe.then(data => {
      expect(data).toBe(undefined)
    }).catch(error => {
      expect(error).toBeInstanceOf(Error)
    })
  })

  test.concurrent('should handle a successful operation', () => {
    const asyncOperation = () => Promise.resolve('This is a successful operation')

    const safe = safeAsyncOperation(asyncOperation)

    return safe.then(data => {
      expect(data).toBe('This is a successful operation')
    }).catch(error => {
      expect(error).toBe(null)
    })
  })

  test.concurrent('should pass along arguments to the async operation', () => {
    const asyncOperation = (arg1, arg2) => Promise.resolve(arg1 + arg2)

    const safe = safeAsyncOperation(asyncOperation, 1, 2)

    return safe.then(data => {
      expect(data).toBe(3)
    }).catch(error => {
      expect(error).toBe(null)
    })
  })

  test.concurrent('should handle reject if asyncOperation is not a function', () => {
    const safe = safeAsyncOperation('not a function')

    return safe.then(data => {
      expect(data).toBe(undefined)
    }).catch(error => {
      expect(error).toBeInstanceOf(TypeError)
    })
  })

  test.concurrent('should handle async operation which is a promise', () => {
    const pData = 'This is a successful operation'
    const asyncOperation = async () => {
      return pData
    }

    const safe = safeAsyncOperation(asyncOperation)

    return safe.then(data => {
      expect(data).toBe(pData)
    }).catch(error => {
      expect(error).toBeInstanceOf(TypeError)
    })
  })
})
