import dataResolver from './index'
import * as filters from './filters'
import * as normalize from './normalize'
import * as getPageInfo from '../../utils/getPageInfo'
import { FilterInput } from '../../../generated/graphql'

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
  DATA_SEARCH_LIMIT: 12,
  DATA_SEARCH_MAX_RESULTS: 20,
}))

jest.mock('./filters')
jest.mock('./normalize')
jest.mock('../../utils/getPageInfo')

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

  describe('Call the endpoints', () => {
    // Spy on these functions and return mock response as they're tested seperately
    beforeEach(() => {
      jest.spyOn(filters, 'default').mockReturnValueOnce(FILTERS)
      jest.spyOn(normalize, 'combineTypeResults').mockReturnValueOnce([])
    })

    afterEach(() => {
      jest.spyOn(filters, 'default').mockReset()
      jest.spyOn(normalize, 'combineTypeResults').mockReset()
    })

    it('with the search term', async () => {
      const mockDataLoader = jest.fn(() => ({ status: 200, foo: 'var' }))

      await dataResolver(
        '',
        { q: SEARCH_TERM },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // No filters given so return all endpoints from the config
      expect(mockDataLoader).toHaveBeenCalledTimes(2)
      expect(mockDataLoader.mock.calls).toEqual([
        [`https://api.endpoint.com/users?q=${SEARCH_TERM}&page=1`],
        [`https://api.endpoint.com/posts?q=${SEARCH_TERM}&page=1`],
      ])

      mockDataLoader.mockReset()
    })

    it('with the search term when there is pagination', async () => {
      const mockDataLoader = jest.fn(() => ({ status: 200, foo: 'var' }))

      await dataResolver(
        '',
        { q: SEARCH_TERM, input: { page: 12, filters: [TYPE] } },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // Only return the endpoint for the given type
      expect(mockDataLoader).toHaveBeenCalledTimes(1)
      expect(mockDataLoader).toHaveBeenCalledWith(
        `https://api.endpoint.com/users?q=${SEARCH_TERM}&page=12`,
      )

      mockDataLoader.mockReset()
    })

    it('with the search term and clears key from cache when an error occurs', async () => {
      const mockDataLoader = jest.fn(() => ({ status: 999, foo: 'var' }))
      const mockClear = jest.fn(() => true)

      await dataResolver(
        '',
        { q: SEARCH_TERM, input: { filters: [TYPE] } },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: mockClear } } },
      )

      // Only return the endpoint for the given type
      expect(mockDataLoader).toHaveBeenCalledTimes(1)
      expect(mockDataLoader).toHaveBeenCalledWith(
        `https://api.endpoint.com/users?q=${SEARCH_TERM}&page=1`,
      )

      // Error thrown so call clear()
      expect(mockClear).toHaveBeenCalledTimes(1)
      expect(mockClear).toHaveBeenCalledWith(
        `https://api.endpoint.com/users?q=${SEARCH_TERM}&page=1`,
      )

      mockDataLoader.mockReset()
      mockClear.mockReset()
    })
  })

  describe('Calls the combineTypeResults function', () => {
    const RETURN = [
      {
        type: 'users',
        labelSingular: 'User',
        label: 'Users',
      },
      {
        type: 'posts',
        labelSingular: 'Post',
        label: 'Posts',
      },
    ]

    const DATA = {
      status: 200,
      foo: 'var',
    }

    // Mock the combineTypeResults as this is tested seperately
    const COMBINED = [
      { ...RETURN[0], count: 1 },
      { ...RETURN[1], count: 3 },
    ]

    const TOTAL_COUNT = COMBINED[0].count + COMBINED[1].count

    // Set a value for the filters
    const FILTERS = { filters: [{ type: ' foo', id: 'foo', label: 'Foo', options: [] }] }

    const PAGE_INFO = {
      hasNextPage: true,
      totalPages: 12,
    }

    let mockCombineTypeResults: jest.SpyInstance<any>
    let mockGetFilters: jest.SpyInstance<any>
    let mockGetPageInfo: jest.SpyInstance<any>
    let mockDataLoader = jest.fn()

    beforeEach(() => {
      mockCombineTypeResults = jest
        .spyOn(normalize, 'combineTypeResults')
        .mockReturnValueOnce(COMBINED)

      mockGetFilters = jest.spyOn(filters, 'default').mockReturnValueOnce(FILTERS)
      mockGetPageInfo = jest.spyOn(getPageInfo, 'default').mockReturnValueOnce(PAGE_INFO)

      mockDataLoader = jest.fn(() => DATA)
    })

    afterEach(() => {
      mockCombineTypeResults.mockReset()
      mockGetFilters.mockReset()
      mockGetPageInfo.mockReset()
      mockDataLoader.mockReset()
    })

    it('with the normalized results ', async () => {
      await dataResolver(
        '',
        { q: SEARCH_TERM },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // Then function combineTypeResults will be called with the combination of DATA_SEARCH_ENDPOINTS and the result from the dataloader
      expect(mockCombineTypeResults).toHaveBeenCalledWith([
        { ...RETURN[0], ...DATA },
        { ...RETURN[1], ...DATA },
      ])
    })

    it('and handles pagination', async () => {
      const PAGE = 4

      const output = await dataResolver(
        '',
        { q: SEARCH_TERM, input: { page: PAGE } },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // The filters should be collected
      expect(mockGetFilters).toHaveBeenCalledWith(COMBINED)

      // There pageInfo results are retrieved with the input values
      expect(mockGetPageInfo).toHaveBeenCalledWith(TOTAL_COUNT, PAGE, 12)

      expect(output).toMatchObject({
        pageInfo: PAGE_INFO,
      })
    })

    it('including the edge case when DATA_SEARCH_MAX_RESULTS is exceeded', async () => {
      mockCombineTypeResults.mockReset()

      mockCombineTypeResults = jest
        .spyOn(normalize, 'combineTypeResults')
        .mockReturnValueOnce([...COMBINED, { ...RETURN[0], count: 112 }])

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

      // The filters should be collected
      expect(mockGetFilters).toHaveBeenCalledWith(COMBINED)

      // There pageInfo results are retrieved with the defaults
      expect(mockGetPageInfo).toHaveBeenCalledWith(TOTAL_COUNT, 1, 12)

      expect(output).toEqual({
        ...FILTERS,
        results: [...COMBINED],
        totalCount: TOTAL_COUNT,
        pageInfo: { ...PAGE_INFO, hasLimitedResults: false },
      })
    })
  })
})
