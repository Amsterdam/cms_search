import datasetResolver from './index'
import * as filters from './filters'
import * as normalize from './normalize'
import DataError from '../../utils/DataError'

// Overwrite the DATA_SEARCH_ENDPOINTS const to make testing clearer and decoupled from real data
jest.mock('./config', () => ({
  DCAT_ENDPOINTS: {
    openapi: 'https://api.endpoint.com/openapi',
  },
}))

jest.mock('./filters')
jest.mock('./normalize')
jest.mock('../../utils/DataError')

describe('datasetResolver', () => {
  const SEARCH_TERM = 'foo'
  const FILTERS = { filters: [{ type: ' foo', id: 'foo', label: 'Foo', options: [] }] }

  const CONTEXT = {
    loaders: {
      data: { load: jest.fn, clear: jest.fn() },
      datasets: { load: jest.fn, clear: jest.fn() },
    },
  }

  describe('Call the endpoints', () => {
    it('with the search term', async () => {
      const mockDatasetLoader = jest.fn(() => ({}))

      const mockGetDatasetsEndpoint = jest
        .spyOn(normalize, 'getDatasetsEndpoint')
        .mockReturnValueOnce('mockEndpoint')

      const mockNormalizeDatasets = jest
        .spyOn(normalize, 'normalizeDatasets')
        .mockReturnValueOnce('mockedData')

      await datasetResolver(
        '',
        { q: SEARCH_TERM },
        {
          loaders: { ...CONTEXT.loaders, datasets: { load: mockDatasetLoader, clear: jest.fn() } },
        },
      )

      expect(mockGetDatasetsEndpoint).toHaveBeenCalledWith(SEARCH_TERM, {})

      // The DataLoader should be called with the datasets endpoint and the openapi endpoint from the config
      expect(mockDatasetLoader).toHaveBeenCalledTimes(2)
      expect(mockDatasetLoader.mock.calls).toEqual([
        ['mockEndpoint'],
        ['https://api.endpoint.com/openapi'],
      ])

      mockDatasetLoader.mockReset()
      mockGetDatasetsEndpoint.mockReset()
      mockNormalizeDatasets.mockReset()
    })

    it('and returns the data in the correct format', async () => {
      jest.spyOn(filters, 'default').mockReset()

      const MOCKED_DATASETS = {
        ['dcat:dataset']: 'mockedDatasets',
        ['void:documents']: 12,
        ['ams:facet_info']: 'mockedFacetInfo',
      }

      const mockDatasetLoader = jest.fn(() => MOCKED_DATASETS)

      const mockGetDatasetsEndpoint = jest
        .spyOn(normalize, 'getDatasetsEndpoint')
        .mockReturnValueOnce('mockEndpoint')

      const mockNormalizeDatasets = jest
        .spyOn(normalize, 'normalizeDatasets')
        .mockReturnValueOnce('mockedData')

      const mockGetFilters = jest.spyOn(filters, 'default').mockReturnValueOnce(FILTERS)

      const output = await datasetResolver(
        '',
        { q: SEARCH_TERM },
        {
          loaders: { ...CONTEXT.loaders, datasets: { load: mockDatasetLoader, clear: jest.fn() } },
        },
      )

      // The DataLoader should be called with the datasets endpoint and the openapi endpoint from the config
      expect(mockDatasetLoader).toHaveBeenCalledTimes(2)

      // The data from the DataLoader must be normalized
      expect(mockNormalizeDatasets).toHaveBeenCalledWith('mockedDatasets', MOCKED_DATASETS)

      // The filters should be collected
      expect(mockGetFilters).toHaveBeenCalledWith('mockedFacetInfo', MOCKED_DATASETS)

      // And the output is returned
      expect(output).toEqual({
        results: 'mockedData',
        ...FILTERS,
        totalCount: 12,
      })

      mockDatasetLoader.mockReset()
      mockGetDatasetsEndpoint.mockReset()
      mockGetFilters.mockReset()
    })

    it('or returns an error and clears the cache when something fails', async () => {
      const mockDatasetLoader = jest.fn(() => ({ status: 999, message: 'error' }))
      const mockClear = jest.fn()

      const mockGetDatasetsEndpoint = jest
        .spyOn(normalize, 'getDatasetsEndpoint')
        .mockReturnValueOnce('mockEndpoint')

      await datasetResolver(
        '',
        { q: SEARCH_TERM },
        {
          loaders: { ...CONTEXT.loaders, datasets: { load: mockDatasetLoader, clear: mockClear } },
        },
      )

      // The DataLoader should be called with the datasets endpoint and the openapi endpoint from the config
      expect(mockDatasetLoader).toHaveBeenCalledTimes(2)

      // The result contains a status code with an error, so call DataError
      expect(DataError).toHaveBeenCalled()

      // And clear the cache
      expect(mockClear).toHaveBeenCalledWith('mockEndpoint')

      mockDatasetLoader.mockReset()
      mockClear.mockReset()
      mockGetDatasetsEndpoint.mockReset()
    })

    //     it('with the search term when there are types', async () => {
    //       const mockDatasetLoader = jest.fn(() => ({ status: 200, foo: 'var' }))

    //       await datasetResolver(
    //         '',
    //         { q: SEARCH_TERM, input: { types: [TYPE] } },
    //         { loaders: { ...CONTEXT.loaders, data: { load: mockDatasetLoader, clear: jest.fn() } } },
    //       )

    //       // Only return the endpoint for the given type
    //       expect(mockDatasetLoader).toHaveBeenCalledTimes(1)
    //       expect(mockDatasetLoader).toHaveBeenCalledWith(`https://api.endpoint.com/users?q=${SEARCH_TERM}`)

    //       mockDatasetLoader.mockReset()
    //     })

    //     it('with the search term and clears key from cache when an error occurs', async () => {
    //       const mockDatasetLoader = jest.fn(() => ({ status: 999, foo: 'var' }))
    //       const mockClear = jest.fn(() => true)

    //       await datasetResolver(
    //         '',
    //         { q: SEARCH_TERM, input: { types: [TYPE] } },
    //         { loaders: { ...CONTEXT.loaders, data: { load: mockDatasetLoader, clear: mockClear } } },
    //       )

    //       // Only return the endpoint for the given type
    //       expect(mockDatasetLoader).toHaveBeenCalledTimes(1)
    //       expect(mockDatasetLoader).toHaveBeenCalledWith(`https://api.endpoint.com/users?q=${SEARCH_TERM}`)

    //       // Error thrown so call clear()
    //       expect(mockClear).toHaveBeenCalledTimes(1)
    //       expect(mockClear).toHaveBeenCalledWith(`https://api.endpoint.com/users?q=${SEARCH_TERM}`)

    //       mockDatasetLoader.mockReset()
    //       mockClear.mockReset()
    //     })
    //   })

    //   describe('Calls the combineTypeResults function', () => {
    //     const mockReturn = [
    //       {
    //         type: 'users',
    //         labelSingular: 'User',
    //         label: 'Users',
    //       },
    //       {
    //         type: 'posts',
    //         labelSingular: 'Post',
    //         label: 'Posts',
    //       },
    //     ]

    //     const mockDatasetLoaderReturn = {
    //       status: 200,
    //       foo: 'var',
    //     }

    //     const mockDatasetLoader = jest.fn(() => mockDatasetLoaderReturn)

    //     // Mock the combineTypeResults as this is tested seperately
    //     const mockedCombinedTypeResults = [
    //       { ...mockReturn[0], count: 1 },
    //       { ...mockReturn[1], count: 3 },
    //     ]

    //     // Set a value for the filters
    //     const mockedFilters = { filters: [{ type: ' foo', id: 'foo', label: 'Foo', options: [] }] }

    //     it('with the normalized results ', async () => {
    //       const mockedCombineTypeResults = jest
    //         .spyOn(normalize, 'combineTypeResults')
    //         .mockReturnValueOnce(mockedCombinedTypeResults)

    //       await datasetResolver(
    //         '',
    //         { q: SEARCH_TERM },
    //         { loaders: { ...CONTEXT.loaders, data: { load: mockDatasetLoader, clear: jest.fn() } } },
    //       )

    //       // Then function combineTypeResults will be called with the combination of DATA_SEARCH_ENDPOINTS and the result from the dataloader
    //       expect(mockedCombineTypeResults).toHaveBeenCalledWith(
    //         [
    //           { ...mockReturn[0], ...mockDatasetLoaderReturn },
    //           { ...mockReturn[1], ...mockDatasetLoaderReturn },
    //         ],
    //         DEFAULT_LIMIT,
    //         DEFAULT_FROM,
    //       )
    //     })

    //     it('and returns the correct values for the reducer', async () => {
    //       const mockedCombineTypeResults = jest
    //         .spyOn(normalize, 'combineTypeResults')
    //         .mockReturnValueOnce(mockedCombinedTypeResults)

    //       const mockedGetFilters = jest.spyOn(filters, 'default').mockReturnValueOnce(mockedFilters)

    //       const output = await datasetResolver(
    //         '',
    //         { q: SEARCH_TERM },
    //         { loaders: { ...CONTEXT.loaders, data: { load: mockDatasetLoader, clear: jest.fn() } } },
    //       )

    //       expect(mockedGetFilters).toHaveBeenCalledWith(mockedCombinedTypeResults)

    //       expect(output).toEqual({
    //         ...mockedFilters,
    //         results: [...mockedCombinedTypeResults],
    //         totalCount: mockedCombinedTypeResults[0].count + mockedCombinedTypeResults[1].count, // 1 + 3
    //       })

    //       mockedCombineTypeResults.mockReset()
    //       mockDatasetLoader.mockReset()
    //     })
  })
})
