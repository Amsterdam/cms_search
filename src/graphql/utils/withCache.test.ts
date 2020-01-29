import memoryCache from 'memory-cache'
import withCache from './withCache'

jest.mock('memory-cache')

describe('withCache', () => {
  const cacheKey = 'test'
  const value = { foo: 'bar' }
  const time = 1000

  test('it should store the value in the cache correctly and return it', async () => {
    const mockedGet = jest.spyOn(memoryCache, 'get').mockReturnValue(null)
    const mockedPut = jest.spyOn(memoryCache, 'put').mockReturnValue(value)
    let invokedExecutor = false

    const result = await withCache(
      cacheKey,
      () => {
        invokedExecutor = true
        return Promise.resolve(value)
      },
      time,
    )

    expect(result).toEqual(value)
    expect(invokedExecutor).toEqual(true)
    expect(mockedPut).toHaveBeenCalledWith(cacheKey, value, time * 1000)

    mockedGet.mockRestore()
    mockedPut.mockRestore()
  })

  test('it should return the cached value if present and not invoke the executor', async () => {
    const mockedGet = jest.spyOn(memoryCache, 'get').mockReturnValue(value)
    let invokedExecutor = false

    const result = await withCache(
      cacheKey,
      () => {
        invokedExecutor = true
        return Promise.resolve({ baz: 'buzz' })
      },
      time,
    )

    expect(result).toEqual(value)
    expect(invokedExecutor).toEqual(false)
    expect(mockedGet).toHaveBeenCalledWith(cacheKey)

    mockedGet.mockRestore()
  })
})
