import dataResolver from './index'
import * as filters from './filters'
import * as normalize from './normalize'
import * as getPageInfo from '../../utils/getPageInfo'
import { FilterInput } from '../../../generated/graphql'
import CustomError from '../../utils/CustomError'

// Overwrite the DATA_SEARCH_ENDPOINTS const to make testing clearer and decoupled from real data
jest.mock('./config', () => ({
  DATA_SEARCH_FILTER: { type: 'foo' },
  DATA_SEARCH_ENDPOINTS: [
    {
      endpoint: 'https://api.endpoint.com/users',
      type: 'users',
      labelSingular: 'User',
      label: 'Users',
      searchParam: 'q',
      params: {
        foo: 'var',
      },
    },
    {
      endpoint: 'https://api.endpoint.com/posts',
      type: 'posts',
      labelSingular: 'Post',
      label: 'Posts',
      searchParam: 'query',
    },
  ],
  DATA_SEARCH_LIMIT: 12,
  DATA_SEARCH_MAX_RESULTS: 20,
}))

jest.mock('./filters')
jest.mock('./normalize')
jest.mock('../../utils/getPageInfo')
jest.mock('../../utils/CustomError')

describe('dataResolver', () => {
  const SEARCH_TERM = 'foo'
  const TYPE: FilterInput = { type: 'foo', values: ['users'] }
  const FILTERS = [{ type: 'foo', id: 'foo', label: 'Foo', options: [] }]

  const CONTEXT = {
    loaders: {
      cms: { load: jest.fn, clear: jest.fn() },
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

    it('with the search term, params and pagination', async () => {
      const mockDataLoader = jest.fn(() => ({ status: 200, foo: 'var' }))

      await dataResolver(
        '',
        { q: SEARCH_TERM },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // No filters given so return all endpoints from the config
      expect(mockDataLoader).toHaveBeenCalledTimes(2)
      expect(mockDataLoader.mock.calls).toEqual([
        [`https://api.endpoint.com/users/?q=${SEARCH_TERM}&page=1&foo=var`],
        [`https://api.endpoint.com/posts/?query=${SEARCH_TERM}&page=1`],
      ])

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
        `https://api.endpoint.com/users/?q=${SEARCH_TERM}&page=1&foo=var`,
      )

      // Error thrown so call clear()
      expect(mockClear).toHaveBeenCalledTimes(1)
      expect(mockClear).toHaveBeenCalledWith(
        `https://api.endpoint.com/users/?q=${SEARCH_TERM}&page=1&foo=var`,
      )

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

    const PAGE_INFO = {
      hasNextPage: true,
      totalPages: 12,
    }

    const DATA_LOADER = {
      status: 'fulfilled',
      value: {
        results: [DATA],
        count: 1,
      },
    }

    let mockDataLoader = jest.fn()
    let mockGetFilters: jest.SpyInstance<any>
    let mockNormalizeResults: jest.SpyInstance<any>
    let mockGetPageInfo: jest.SpyInstance<any>

    beforeEach(() => {
      mockGetFilters = jest.spyOn(filters, 'default').mockReturnValueOnce(FILTERS)
      mockNormalizeResults = jest
        .spyOn(normalize, 'normalizeResults')
        .mockReturnValueOnce(NORMALIZED[0])
        .mockReturnValueOnce(NORMALIZED[1])
      mockDataLoader = jest.fn(() => DATA_LOADER)
      mockGetPageInfo = jest.spyOn(getPageInfo, 'default').mockReturnValueOnce(PAGE_INFO)
    })

    afterEach(() => {
      mockGetFilters.mockReset()
      mockNormalizeResults.mockReset()
      mockDataLoader.mockReset()
      mockGetPageInfo.mockReset()
    })

    it('with the dataloader results ', async () => {
      await dataResolver(
        '',
        { q: SEARCH_TERM },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // Called once for every endpoint
      expect(mockDataLoader).toHaveBeenCalledTimes(2)

      // Then function normalizeResults will be called with the combination of DATA_SEARCH_ENDPOINTS and the result from the dataloader including the type
      expect(mockNormalizeResults.mock.calls).toEqual([
        [DATA, NORMALIZED[0].type],
        [DATA, NORMALIZED[1].type],
      ])
    })

    it('and handles pagination', async () => {
      const PAGE = 4

      const output = await dataResolver(
        '',
        { q: SEARCH_TERM, input: { page: PAGE } },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // Called once for every endpoint
      expect(mockDataLoader).toHaveBeenCalledTimes(2)

      // There pageInfo results are retrieved with the input values
      // The dataloader is called once for every endpoint, so the totalCount is two times the dataloader result
      expect(mockGetPageInfo).toHaveBeenCalledWith(DATA_LOADER.value.count * 2, PAGE, 12)

      expect(output).toMatchObject({
        pageInfo: PAGE_INFO,
      })
    })

    it('including the edge case when DATA_SEARCH_MAX_RESULTS is exceeded', async () => {
      mockDataLoader = jest.fn(() => ({
        ...DATA_LOADER,
        value: {
          ...DATA_LOADER.value,
          count: 9999,
        },
      }))

      const output = await dataResolver(
        '',
        { q: SEARCH_TERM },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // There pageInfo results are retrieved with the input values,
      // But with the maximum as totalCount
      expect(mockGetPageInfo).toHaveBeenCalledWith(20, 1, 12)

      expect(output).toMatchObject({
        pageInfo: {
          ...PAGE_INFO,
          hasLimitedResults: true, // IMPORTANT: The data APIs currently return a maximum of 1000 results
        },
      })
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

      // There pageInfo results are retrieved with the defaults
      expect(mockGetPageInfo).toHaveBeenCalledWith(RESULTS[0].count + RESULTS[1].count, 1, 12)

      expect(output).toEqual({
        filters: FILTERS,
        results: RESULTS,
        totalCount: DATA_LOADER.value.count + DATA_LOADER.value.count, // 1 + 1
        pageInfo: { ...PAGE_INFO, hasLimitedResults: false },
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
        [`https://api.endpoint.com/users/?q=${SEARCH_TERM}&page=1&foo=var`],
        [`https://api.endpoint.com/posts/?query=${SEARCH_TERM}&page=1`],
      ])
    })
  })
})
