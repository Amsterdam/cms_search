import dataResolver from './index'
import * as filters from './filters'
import * as normalize from './normalize'
import { FilterInput } from '../../../generated/graphql'
import CustomError from '../../utils/CustomError'

// Overwrite the DATA_SEARCH_ENDPOINTS const to make testing clearer and decoupled from real data
jest.mock('./config', () => ({
  DATA_SEARCH_ENDPOINTS: [
    {
      endpoint: 'https://api.endpoint.com/users',
      type: 'users',
      labelSingular: 'User',
      label: 'Users',
    },
    {
      endpoint: 'https://api.endpoint.com/posts',
      type: 'posts',
      labelSingular: 'Post',
      label: 'Posts',
    },
  ],
}))

jest.mock('./filters')
jest.mock('./normalize')
jest.mock('../../utils/CustomError')

describe('dataResolver', () => {
  const SEARCH_TERM = 'foo'
  const TYPE: FilterInput = { type: 'types', values: ['users'] }
  const FILTERS = { filters: [{ type: ' foo', id: 'foo', label: 'Foo', options: [] }] }

  const CONTEXT = {
    loaders: {
      data: { load: jest.fn, clear: jest.fn() },
      datasets: { load: jest.fn, clear: jest.fn() },
    },
  }

  const DATA = { type: 'foo ' }

  describe('Call the endpoints', () => {
    // Spy on these functions and return mock response as they're tested seperately
    beforeEach(() => {
      jest.spyOn(filters, 'default').mockReturnValueOnce(FILTERS)
      jest.spyOn(normalize, 'normalizeResults').mockReturnValueOnce(DATA)
    })

    afterEach(() => {
      jest.spyOn(filters, 'default').mockReset()
      jest.spyOn(normalize, 'normalizeResults').mockReset()
    })

    it('with the search term', async () => {
      const mockDataLoader = jest.fn(() => ({ status: 200, foo: 'var' }))

      await dataResolver(
        '',
        { q: SEARCH_TERM },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // No types given so return all endpoints from the config
      expect(mockDataLoader).toHaveBeenCalledTimes(2)
      expect(mockDataLoader.mock.calls).toEqual([
        [`https://api.endpoint.com/users/?q=${SEARCH_TERM}`],
        [`https://api.endpoint.com/posts/?q=${SEARCH_TERM}`],
      ])

      mockDataLoader.mockReset()
    })

    it('with the search term when there are types', async () => {
      const mockDataLoader = jest.fn(() => ({ status: 200, foo: 'var' }))

      await dataResolver(
        '',
        { q: SEARCH_TERM, input: { filters: [TYPE] } },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // Only return the endpoint for the given type
      expect(mockDataLoader).toHaveBeenCalledTimes(1)
      expect(mockDataLoader).toHaveBeenCalledWith(
        `https://api.endpoint.com/users/?q=${SEARCH_TERM}`,
      )

      mockDataLoader.mockReset()
    })

    it('with the search term and clears key from cache when an error occurs', async () => {
      const mockDataLoader = jest.fn(() => ({ status: 'rejected', reason: Error('error') })) // Dataloader returns error as the Promise was rejected
      const mockClear = jest.fn(() => true)

      await dataResolver(
        '',
        { q: SEARCH_TERM, input: { filters: [TYPE] } },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: mockClear } } },
      )

      // Only return the endpoint for the given type
      expect(mockDataLoader).toHaveBeenCalledTimes(1)
      expect(mockDataLoader).toHaveBeenCalledWith(
        `https://api.endpoint.com/users/?q=${SEARCH_TERM}`,
      )

      // Error thrown so call clear()
      expect(mockClear).toHaveBeenCalledTimes(1)
      expect(mockClear).toHaveBeenCalledWith(`https://api.endpoint.com/users/?q=${SEARCH_TERM}`)

      mockDataLoader.mockReset()
      mockClear.mockReset()
    })
  })

  describe('Calls the normalizeResults function', () => {
    const NORMALIZED = [
      {
        type: 'users',
        foo: 'User',
      },
      {
        type: 'posts',
        foo: 'Post',
      },
    ]

    const DATA_LOADER = {
      status: 'fulfilled',
      value: {
        results: [DATA],
        count: 1,
      },
    }

    // Set a value for the filters
    const FILTERS = { filters: [{ type: ' foo', id: 'foo', label: 'Foo', options: [] }] }

    let mockDataLoader = jest.fn()
    let mockGetFilters: jest.SpyInstance<any>
    let mockNormalizeResults: jest.SpyInstance<any>

    beforeEach(() => {
      mockGetFilters = jest.spyOn(filters, 'default').mockReturnValueOnce(FILTERS)
      mockNormalizeResults = jest
        .spyOn(normalize, 'normalizeResults')
        .mockReturnValueOnce(NORMALIZED[0])
        .mockReturnValueOnce(NORMALIZED[1])
      mockDataLoader = jest.fn(() => DATA_LOADER)
    })

    afterEach(() => {
      mockGetFilters.mockReset()
      mockNormalizeResults.mockReset()
      mockDataLoader.mockReset()
    })

    it('with the dataloader results ', async () => {
      await dataResolver(
        '',
        { q: SEARCH_TERM },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // Then function normalizeResults will be called with the combination of DATA_SEARCH_ENDPOINTS and the result from the dataloader
      expect(mockNormalizeResults.mock.calls).toEqual([[DATA], [DATA]])
    })

    it('and returns the correct values for the reducer', async () => {
      const output = await dataResolver(
        '',
        { q: SEARCH_TERM },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // This is a combined results of the return of the normalizeResults function and the DATA_SEARCH_ENDPOINTS constant
      const RESULTS = [
        { count: 1, type: 'users', label: 'User', results: [NORMALIZED[0]] },
        { count: 1, type: 'posts', label: 'Post', results: [NORMALIZED[1]] },
      ]

      expect(mockGetFilters).toHaveBeenCalledWith(RESULTS)

      expect(output).toEqual({
        ...FILTERS,
        results: RESULTS,
        totalCount: DATA_LOADER.value.count + DATA_LOADER.value.count, // 1 + 1
      })
    })

    it('or returns an error and clears the cache when something fails', async () => {
      mockDataLoader = jest.fn(() => ({
        status: 'rejected',
        reason: Error('error'),
      }))

      const mockClear = jest.fn()

      await dataResolver(
        '',
        { q: SEARCH_TERM },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: mockClear } } },
      )

      // The result contains a status code with an error, so call CustomError
      expect(CustomError).toHaveBeenCalled()

      // And clear the cache
      expect(mockClear.mock.calls).toEqual([
        [`https://api.endpoint.com/users/?q=${SEARCH_TERM}`],
        [`https://api.endpoint.com/posts/?q=${SEARCH_TERM}`],
      ])
    })
  })
})
