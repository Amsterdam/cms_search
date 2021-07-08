import { Filter } from '../../../generated/graphql'
import { DEFAULT_LIMIT, FilterType } from '../../config'
import * as getPageInfo from '../../utils/getPageInfo'
import datasetResolver from './index'
import * as normalize from './normalize'
import openAPIFixture from '../../../fixtures/openapi/fixture'

// Overwrite the DCAT_ENDPOINTS const to make testing clearer and decoupled from real data
jest.mock('./config', () => ({
  DCAT_ENDPOINTS: {
    openapi: 'https://api.endpoint.com/openapi',
  },
}))

jest.mock('./normalize')
jest.mock('../../utils/getPageInfo')

describe('datasetResolver', () => {
  const SEARCH_TERM = 'foo'
  const FILTERS: Filter[] = [
    { filterType: FilterType.Radio, type: 'foo', label: 'Foo', options: [] },
  ]

  const CONTEXT: any = {
    loaders: {
      cms: { load: jest.fn, clear: jest.fn() },
      data: { load: jest.fn, clear: jest.fn() },
      datasets: { load: jest.fn, clear: jest.fn() },
      openAPI: { load: jest.fn, clear: jest.fn() },
    },
  }

  const DATASETS = {
    'dcat:dataset': 'mockedDatasets',
    'void:documents': 12,
    'ams:facet_info': 'mockedFacetInfo',
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
  let mockOpenAPILoader = jest.fn()

  beforeEach(() => {
    mockGetDatasetsEndpoint = jest
      .spyOn(normalize, 'getDatasetsEndpoint')
      .mockReturnValueOnce('mockEndpoint')

    mockNormalizeDatasets = jest
      .spyOn(normalize, 'normalizeDatasets')
      .mockReturnValueOnce('mockedData')

    mockGetFilters = jest.spyOn(normalize, 'formatFilters').mockReturnValueOnce(FILTERS)
    mockGetPageInfo = jest.spyOn(getPageInfo, 'default').mockReturnValueOnce(PAGE_INFO)

    mockDatasetLoader = jest.fn(() => ({
      value: DATASETS,
    }))

    mockOpenAPILoader = jest.fn(() => ({
      value: openAPIFixture,
    }))
  })

  afterEach(() => {
    mockGetDatasetsEndpoint.mockReset()
    mockNormalizeDatasets.mockReset()
    mockGetFilters.mockReset()
    mockGetPageInfo.mockReset()
    mockDatasetLoader.mockReset()
    mockOpenAPILoader.mockReset()
  })

  describe('Call the endpoints', () => {
    it('with the search term', async () => {
      await datasetResolver(
        '',
        { q: SEARCH_TERM },
        {
          loaders: {
            ...CONTEXT.loaders,
            // @ts-ignore
            datasets: { load: mockDatasetLoader, clear: jest.fn() },
            // @ts-ignore
            openAPI: { load: mockOpenAPILoader, clear: jest.fn() },
          },
        },
      )

      // There's no page number or limit given, so the defaults are used
      expect(mockGetDatasetsEndpoint).toHaveBeenCalledWith(SEARCH_TERM, 0, DEFAULT_LIMIT, [])

      // The DataLoader should be called with the datasets endpoint and the openapi endpoint from the config
      expect(mockDatasetLoader).toHaveBeenCalledTimes(1)
      expect(mockOpenAPILoader).toHaveBeenCalledTimes(1)
      expect(mockDatasetLoader.mock.calls).toEqual([['mockEndpoint']])
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
          loaders: {
            ...CONTEXT.loaders,
            datasets: { load: mockDatasetLoader, clear: jest.fn() },
            openAPI: { load: mockOpenAPILoader, clear: jest.fn() },
          },
        },
      )

      // There's a page number and limit given
      expect(mockGetDatasetsEndpoint).toHaveBeenCalledWith(SEARCH_TERM, FROM, LIMIT, FILTER_INPUT)

      // There pageInfo results are retrieved
      expect(mockGetPageInfo).toHaveBeenCalledWith(DATASETS['void:documents'], PAGE, LIMIT)

      // And the output is returned
      expect(output).toMatchObject({
        filters: FILTERS,
        pageInfo: PAGE_INFO,
      })
    })

    it('and returns the data in the correct format', async () => {
      const output = await datasetResolver(
        '',
        { q: SEARCH_TERM },
        {
          loaders: {
            ...CONTEXT.loaders,
            datasets: { load: mockDatasetLoader, clear: jest.fn() },
            openAPI: { load: mockOpenAPILoader, clear: jest.fn() },
          },
        },
      )

      // The DataLoader should be called with the datasets endpoint and the openapi endpoint from the config
      expect(mockDatasetLoader).toHaveBeenCalledTimes(1)

      // The data from the DataLoader must be normalized
      expect(mockNormalizeDatasets).toHaveBeenCalledWith('mockedDatasets', openAPIFixture)

      // The filters should be collected
      expect(mockGetFilters).toHaveBeenCalledWith(openAPIFixture, 'mockedFacetInfo')

      // And the output is returned
      expect(output).toEqual({
        results: 'mockedData',
        filters: FILTERS,
        totalCount: DATASETS['void:documents'],
        pageInfo: PAGE_INFO,
      })
    })

    it('should throw an error and clears the cache when request to datasets fails', async () => {
      mockDatasetLoader.mockReset()
      mockDatasetLoader = jest.fn(() => ({ status: 'rejected', reason: 'error' }))

      const mockClear = jest.fn()

      await expect(
        datasetResolver(
          '',
          { q: SEARCH_TERM },
          {
            loaders: {
              ...CONTEXT.loaders,
              datasets: { load: mockDatasetLoader, clear: mockClear },
              openAPI: { load: mockOpenAPILoader, clear: mockClear },
            },
          },
        ),
      ).rejects.toThrow('Something went wrong while requesting Datasets')

      // And clear the cache
      expect(mockClear).toHaveBeenCalledWith('mockEndpoint')

      mockClear.mockReset()
    })

    it('should throw an error and clears the cache when request to openapi fails', async () => {
      mockOpenAPILoader.mockReset()
      mockOpenAPILoader = jest.fn(() => ({ status: 'rejected', reason: 'error' }))

      const mockClear = jest.fn()

      await expect(
        datasetResolver(
          '',
          { q: SEARCH_TERM },
          {
            loaders: {
              ...CONTEXT.loaders,
              datasets: { load: mockDatasetLoader, clear: mockClear },
              openAPI: { load: mockOpenAPILoader, clear: mockClear },
            },
          },
        ),
      ).rejects.toThrow('Something went wrong while requesting OpenAPI')

      // And clear the cache
      expect(mockClear).toHaveBeenCalledWith('https://api.endpoint.com/openapi')

      mockClear.mockReset()
    })
  })
})
