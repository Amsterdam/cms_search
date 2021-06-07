import * as fetch from 'node-fetch'
import AbortController from 'abort-controller'

jest.mock('node-fetch')
jest.mock('abort-controller')

jest.useFakeTimers()

import fetchWithAbort, { MAX_REQUEST_TIME } from './fetchWithAbort'

describe('fetchWithAbort', () => {
  describe('Returns data when the request returns result', () => {
    const mockFetch = jest.spyOn(fetch, 'default').mockImplementation(
      (): Promise<any> =>
        Promise.resolve({
          ok: true,
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
    it('with options', async () => {
      const mockFetch = jest.spyOn(fetch, 'default').mockImplementationOnce(
        (): Promise<any> =>
          Promise.resolve({
            ok: true,
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
      const STATUS = 401
      const STATUS_TEXT = 'foo'
      const mockFetch = jest.spyOn(fetch, 'default').mockImplementationOnce(
        (): Promise<any> =>
          Promise.resolve({
            ok: false,
            status: STATUS,
            statusText: STATUS_TEXT,
            json: () => ({}),
          }),
      )

      try {
        await fetchWithAbort('url')
      } catch (e) {
        expect(e.message).toBe(`${STATUS} - ${STATUS_TEXT}`) // The thrown error is the status code and statusText combined
      }

      mockFetch.mockReset()
    })

    it('when the request throws an error', async () => {
      const MESSAGE = 'Lorem ipsum'
      let mockFetch = jest.spyOn(fetch, 'default').mockImplementationOnce(
        (): Promise<any> =>
          Promise.reject({
            name: 'Error',
            message: MESSAGE,
          }),
      )

      try {
        await fetchWithAbort('url')
      } catch (e) {
        expect(e.message).toBe(MESSAGE) // The thrown error is the error message
      }

      mockFetch.mockReset()
    })
  })

  it('aborts the fetch request if it takes to long', async () => {
    const mockedAbortController = <jest.Mock<any, any>>(<unknown>AbortController)

    mockedAbortController.mockImplementation((): Object => ({ abort: jest.fn() }))

    const mockFetch = jest.spyOn(fetch, 'default').mockImplementationOnce(
      (): Promise<any> =>
        Promise.reject({
          name: 'AbortError',
          message: 'Lorem ipsum',
        }),
    )

    jest.useFakeTimers()

    try {
      await fetchWithAbort('url')

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), MAX_REQUEST_TIME)
      expect(mockedAbortController).toHaveBeenCalled()
    } catch (e) {
      expect(e.message).toBe('504 - Gateway Timeout') // The thrown error is the error message
    }

    mockFetch.mockReset()
    mockedAbortController.mockReset()
  })
})
