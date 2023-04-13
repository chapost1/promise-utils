const delay = require('../src/delay')

describe('delay', () => {
  test.concurrent('resolves after the specified delay', async () => {
    const startTime = Date.now()
    await delay(1000)
    const endTime = Date.now()
    expect(endTime - startTime).toBeGreaterThanOrEqual(1000)
  })

  test.concurrent('resolves immediately for a delay of 0 milliseconds', async () => {
    const startTime = Date.now()
    await delay(0)
    const endTime = Date.now()
    expect(endTime - startTime).toBeLessThan(50)
  })
})
