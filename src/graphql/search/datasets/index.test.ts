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
  })
})
