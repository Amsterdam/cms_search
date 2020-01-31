import datasetResolver from './index'
import * as filters from './filters'
import * as normalize from './normalize'
import DataError from '../../utils/DataError'
import { DEFAULT_LIMIT } from '../../config'
import * as getPageInfo from '../../utils/getPageInfo'

// Overwrite the DCAT_ENDPOINTS const to make testing clearer and decoupled from real data
jest.mock('./config', () => ({
  DCAT_ENDPOINTS: {
    openapi: 'https://api.endpoint.com/openapi',
  },
}))

jest.mock('./filters')
jest.mock('./normalize')
jest.mock('../../utils/DataError')
jest.mock('../../utils/getPageInfo')

describe('datasetResolver', () => {
  const SEARCH_TERM = 'foo'
  const FILTERS = { filters: [{ type: ' foo', id: 'foo', label: 'Foo', options: [] }] }

  const CONTEXT = {
    loaders: {
      data: { load: jest.fn, clear: jest.fn() },
      datasets: { load: jest.fn, clear: jest.fn() },
    },
  }

  const DATASETS = {
    ['dcat:dataset']: 'mockedDatasets',
    ['void:documents']: 12,
    ['ams:facet_info']: 'mockedFacetInfo',
  }

  const PAGE_INFO = {
    hasNextPage: true,
    totalPages: 12,
  }

  let mockGetDatasetsEndpoint: jest.SpyInstance<any>
  let mockNormalizeDatasets: jest.SpyInstance<any>
  let mockGetFilters: jest.SpyInstance<any>
  let mockGetPageInfo: jest.SpyInstance<any>
  let mockDatasetLoader = jest.fn()

  beforeEach(() => {
    mockGetDatasetsEndpoint = jest
      .spyOn(normalize, 'getDatasetsEndpoint')
      .mockReturnValueOnce('mockEndpoint')

    mockNormalizeDatasets = jest
      .spyOn(normalize, 'normalizeDatasets')
      .mockReturnValueOnce('mockedData')

    mockGetFilters = jest.spyOn(filters, 'default').mockReturnValueOnce(FILTERS)
    mockGetPageInfo = jest.spyOn(getPageInfo, 'default').mockReturnValueOnce(PAGE_INFO)

    mockDatasetLoader = jest.fn(() => DATASETS)
  })

  afterEach(() => {
    mockGetDatasetsEndpoint.mockReset()
    mockNormalizeDatasets.mockReset()
    mockGetFilters.mockReset()
    mockGetPageInfo.mockReset()
    mockDatasetLoader.mockReset()
  })

  describe('Call the endpoints', () => {
    it('with the search term', async () => {
      await datasetResolver(
        '',
        { q: SEARCH_TERM },
        {
          loaders: { ...CONTEXT.loaders, datasets: { load: mockDatasetLoader, clear: jest.fn() } },
        },
      )

      // There's no page number or limit given, so the defaults are used
      expect(mockGetDatasetsEndpoint).toHaveBeenCalledWith(SEARCH_TERM, 0, DEFAULT_LIMIT, [])

      // The DataLoader should be called with the datasets endpoint and the openapi endpoint from the config
      expect(mockDatasetLoader).toHaveBeenCalledTimes(2)
      expect(mockDatasetLoader.mock.calls).toEqual([
        ['mockEndpoint'],
        ['https://api.endpoint.com/openapi'],
      ])
    })

    it('and handles pagination', async () => {
      const FILTER_INPUT = [{ type: 'foo', values: ['var'] }]
      const PAGE = 6
      const LIMIT = 1
      const FROM = (PAGE - 1) * LIMIT

      const output = await datasetResolver(
        '',
        {
          q: SEARCH_TERM,
          input: {
            page: PAGE,
            limit: LIMIT,
            filters: FILTER_INPUT,
          },
        },
        {
          loaders: { ...CONTEXT.loaders, datasets: { load: mockDatasetLoader, clear: jest.fn() } },
        },
      )

      // There's a page number and limit given
      expect(mockGetDatasetsEndpoint).toHaveBeenCalledWith(SEARCH_TERM, FROM, LIMIT, FILTER_INPUT)

      // There pageInfo results are retrieved
      expect(mockGetPageInfo).toHaveBeenCalledWith(DATASETS['void:documents'], PAGE, LIMIT)

      // And the output is returned
      expect(output).toMatchObject({
        ...FILTERS,
        pageInfo: PAGE_INFO,
      })
    })

    it('and returns the data in the correct format', async () => {
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
      expect(mockNormalizeDatasets).toHaveBeenCalledWith('mockedDatasets', DATASETS)

      // The filters should be collected
      expect(mockGetFilters).toHaveBeenCalledWith('mockedFacetInfo', DATASETS)

      // And the output is returned
      expect(output).toEqual({
        results: 'mockedData',
        ...FILTERS,
        totalCount: DATASETS['void:documents'],
        pageInfo: PAGE_INFO,
      })
    })

    it('or returns an error and clears the cache when something fails', async () => {
      const mockDatasetLoader = jest.fn(() => ({ status: 999, message: 'error' }))
      const mockClear = jest.fn()

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

      mockClear.mockReset()
    })
  })
})
