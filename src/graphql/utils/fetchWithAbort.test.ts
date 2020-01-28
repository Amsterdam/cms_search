import * as fetch from 'node-fetch'
import AbortController from 'abort-controller'

jest.mock('node-fetch')
jest.mock('abort-controller')

import fetchWithAbort from './fetchWithAbort'

describe('fetchWithAbort', () => {
  describe('Returns data when the request returns result', () => {
    const mockFetch = jest.spyOn(fetch, 'default').mockImplementation((): any =>
      Promise.resolve({
        status: 200,
        json: () => ({
          foo: 'var',
        }),
      }),
    )

    afterEach(() => {
      mockFetch.mockReset()
    })

    it('with just an url', async () => {
      const output = await fetchWithAbort('url')

      expect(mockFetch).toHaveBeenCalledWith('url', { signal: undefined })

      expect(output).toEqual({
        foo: 'var',
      })
    })
    it('with header information', async () => {
      const mockFetch = jest.spyOn(fetch, 'default').mockImplementationOnce((): any =>
        Promise.resolve({
          status: 200,
          json: () => ({
            foo: 'var',
          }),
        }),
      )

      const output = await fetchWithAbort('url', { lorem: 'ipsum' })

      expect(mockFetch).toHaveBeenCalledWith('url', { lorem: 'ipsum', signal: undefined })

      expect(output).toEqual({
        foo: 'var',
      })

      mockFetch.mockReset()
    })
  })

  describe('Returns data when the request returns', () => {
    it('a non OK status code', async () => {
      const mockFetch = jest.spyOn(fetch, 'default').mockImplementationOnce((): any =>
        Promise.resolve({
          status: 401,
          json: () => ({}),
        }),
      )

      const output = await fetchWithAbort('url')

      expect(mockFetch).toHaveBeenCalledWith('url', { signal: undefined })

      expect(output).toEqual({
        status: 401,
        message: '',
      })

      mockFetch.mockReset()
    })

    it('when the request throws an error', async () => {
      let mockFetch = jest.spyOn(fetch, 'default').mockImplementationOnce((): any =>
        Promise.reject({
          name: 'Error',
          message: 'Lorem ipsum',
        }),
      )

      const output = await fetchWithAbort('url')

      expect(mockFetch).toHaveBeenCalledWith('url', { signal: undefined })

      expect(output).toEqual({
        status: 500,
        message: 'Lorem ipsum',
      })

      mockFetch.mockReset()
    })

    it('when the request throws an AbortError', async () => {
      let mockFetch = jest.spyOn(fetch, 'default').mockImplementationOnce((): any =>
        Promise.reject({
          name: 'AbortError',
          message: 'Lorem ipsum',
        }),
      )

      const output = await fetchWithAbort('url')

      expect(mockFetch).toHaveBeenCalledWith('url', { signal: undefined })

      expect(output).toEqual({
        status: 504,
        message: 'Lorem ipsum',
      })

      mockFetch.mockReset()
    })
  })

  it('aborts the fetch request if it takes to long', async () => {
    const mockedAbortController = <jest.Mock<any, any>>(<unknown>AbortController)

    mockedAbortController.mockImplementation((): any => ({ abort: jest.fn() }))

    const mockFetch = jest.spyOn(fetch, 'default').mockImplementationOnce((): any =>
      Promise.reject({
        name: 'AbortError',
        message: 'Lorem ipsum',
      }),
    )

    jest.useFakeTimers()

    const output = await fetchWithAbort('url')

    expect(setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 1200)
    expect(mockedAbortController).toHaveBeenCalled()

    expect(output).toEqual({
      status: 504,
      message: 'Lorem ipsum',
    })

    mockFetch.mockReset()
    mockedAbortController.mockReset()
  })
})
