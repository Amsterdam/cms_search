import loaderFunction from './loaderFunction'
import * as fetchWithAbort from './fetchWithAbort'

jest.mock('node-fetch', () => ({
  __esModule: true,
}))

describe('loaderFunction', () => {
  describe('Returns a Promise that resolves to the values corresponding the keys', () => {
    it('when no keys are given', async () => {
      const mockFetchWithAbort = jest.spyOn(fetchWithAbort, 'default')

      const output = await loaderFunction([])

      expect(mockFetchWithAbort).not.toHaveBeenCalled()

      expect(output).toEqual([])

      mockFetchWithAbort.mockReset()
    })

    it('when one key is given', async () => {
      const mockFetchWithAbort = jest
        .spyOn(fetchWithAbort, 'default')
        .mockImplementationOnce(() => Promise.resolve({ foo: 'var' }))

      const output = await loaderFunction(['foo'])

      expect(mockFetchWithAbort).toHaveBeenCalledTimes(1)
      expect(mockFetchWithAbort).toHaveBeenCalledWith('foo', {})

      // Promise.allSettled() returns an array with a status and value for resolved Promises
      expect(output).toEqual([{ status: 'fulfilled', value: { foo: 'var' } }])

      mockFetchWithAbort.mockReset()
    })

    it('when multiple keys are given', async () => {
      const mockFetchWithAbort = jest
        .spyOn(fetchWithAbort, 'default')
        .mockImplementation(() => Promise.resolve({ foo: 'var' }))

      const output = await loaderFunction(['foo', 'var'])

      expect(mockFetchWithAbort).toHaveBeenCalledTimes(2)
      expect(mockFetchWithAbort.mock.calls).toEqual([
        ['foo', {}],
        ['var', {}],
      ])

      expect(output).toEqual([
        { status: 'fulfilled', value: { foo: 'var' } },
        { status: 'fulfilled', value: { foo: 'var' } },
      ])

      mockFetchWithAbort.mockReset()
    })

    it('when not all given keys are resolved', async () => {
      const mockFetchWithAbort = jest
        .spyOn(fetchWithAbort, 'default')
        .mockImplementationOnce(() => Promise.resolve({ foo: 'var' }))
        .mockImplementationOnce(() => Promise.reject(new Error('foo')))

      const output = await loaderFunction(['foo', 'var'])

      expect(mockFetchWithAbort).toHaveBeenCalledTimes(2)
      expect(mockFetchWithAbort.mock.calls).toEqual([
        ['foo', {}],
        ['var', {}],
      ])

      // Promise.allSettled() returns an array with a status and value for resolved Promises, and a reason for rejected Promises
      expect(output).toEqual([
        { status: 'fulfilled', value: { foo: 'var' } },
        { status: 'rejected', reason: Error('foo') },
      ])

      mockFetchWithAbort.mockReset()
    })

    it('when a token has been given', async () => {
      const mockFetchWithAbort = jest
        .spyOn(fetchWithAbort, 'default')
        .mockImplementation(() => Promise.resolve({ foo: 'var' }))

      const output = await loaderFunction(['foo'], 'wewrewrew')

      expect(mockFetchWithAbort).toHaveBeenCalledTimes(1)
      expect(mockFetchWithAbort).toHaveBeenCalledWith('foo', {
        headers: { authorization: 'wewrewrew' },
      })

      expect(output).toEqual([{ status: 'fulfilled', value: { foo: 'var' } }])

      mockFetchWithAbort.mockReset()
    })
  })
})
