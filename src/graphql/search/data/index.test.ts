import dataResolver from './index'
import * as filters from './filters'
import * as normalize from './normalize'
import { DEFAULT_LIMIT, DEFAULT_FROM } from '../../../config'

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

describe('dataResolver', () => {
  const SEARCH_TERM = 'foo'
  const TYPE = 'users'
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

      // No types given so return all endpoints from the config
      expect(mockDataLoader).toHaveBeenCalledTimes(2)
      expect(mockDataLoader.mock.calls).toEqual([
        [`https://api.endpoint.com/users?q=${SEARCH_TERM}`],
        [`https://api.endpoint.com/posts?q=${SEARCH_TERM}`],
      ])

      mockDataLoader.mockReset()
    })

    it('with the search term when there are types', async () => {
      const mockDataLoader = jest.fn(() => ({ status: 200, foo: 'var' }))

      await dataResolver(
        '',
        { q: SEARCH_TERM, input: { types: [TYPE] } },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // Only return the endpoint for the given type
      expect(mockDataLoader).toHaveBeenCalledTimes(1)
      expect(mockDataLoader).toHaveBeenCalledWith(`https://api.endpoint.com/users?q=${SEARCH_TERM}`)

      mockDataLoader.mockReset()
    })

    it('with the search term and clears key from cache when an error occurs', async () => {
      const mockDataLoader = jest.fn(() => ({ status: 999, foo: 'var' }))
      const mockClear = jest.fn(() => true)

      await dataResolver(
        '',
        { q: SEARCH_TERM, input: { types: [TYPE] } },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: mockClear } } },
      )

      // Only return the endpoint for the given type
      expect(mockDataLoader).toHaveBeenCalledTimes(1)
      expect(mockDataLoader).toHaveBeenCalledWith(`https://api.endpoint.com/users?q=${SEARCH_TERM}`)

      // Error thrown so call clear()
      expect(mockClear).toHaveBeenCalledTimes(1)
      expect(mockClear).toHaveBeenCalledWith(`https://api.endpoint.com/users?q=${SEARCH_TERM}`)

      mockDataLoader.mockReset()
      mockClear.mockReset()
    })
  })

  describe('Calls the combineTypeResults function', () => {
    const mockReturn = [
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

    const mockDataLoaderReturn = {
      status: 200,
      foo: 'var',
    }

    const mockDataLoader = jest.fn(() => mockDataLoaderReturn)

    // Mock the combineTypeResults as this is tested seperately
    const mockedCombinedTypeResults = [
      { ...mockReturn[0], count: 1 },
      { ...mockReturn[1], count: 3 },
    ]

    // Set a value for the filters
    const mockedFilters = { filters: [{ type: ' foo', id: 'foo', label: 'Foo', options: [] }] }

    it('with the normalized results ', async () => {
      const mockedCombineTypeResults = jest
        .spyOn(normalize, 'combineTypeResults')
        .mockReturnValueOnce(mockedCombinedTypeResults)

      await dataResolver(
        '',
        { q: SEARCH_TERM },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      // Then function combineTypeResults will be called with the combination of DATA_SEARCH_ENDPOINTS and the result from the dataloader
      expect(mockedCombineTypeResults).toHaveBeenCalledWith(
        [
          { ...mockReturn[0], ...mockDataLoaderReturn },
          { ...mockReturn[1], ...mockDataLoaderReturn },
        ],
        DEFAULT_LIMIT,
        DEFAULT_FROM,
      )
    })

    it('and returns the correct values for the reducer', async () => {
      const mockedCombineTypeResults = jest
        .spyOn(normalize, 'combineTypeResults')
        .mockReturnValueOnce(mockedCombinedTypeResults)

      const mockedGetFilters = jest.spyOn(filters, 'default').mockReturnValueOnce(mockedFilters)

      const output = await dataResolver(
        '',
        { q: SEARCH_TERM },
        { loaders: { ...CONTEXT.loaders, data: { load: mockDataLoader, clear: jest.fn() } } },
      )

      expect(mockedGetFilters).toHaveBeenCalledWith(mockedCombinedTypeResults)

      expect(output).toEqual({
        ...mockedFilters,
        results: [...mockedCombinedTypeResults],
        totalCount: mockedCombinedTypeResults[0].count + mockedCombinedTypeResults[1].count, // 1 + 3
      })

      mockedCombineTypeResults.mockReset()
      mockDataLoader.mockReset()
    })
  })
})
