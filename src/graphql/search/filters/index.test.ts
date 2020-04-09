import { Filter } from '../../../generated/graphql'
import { FilterType } from '../../config'
import { FILTERS } from '../cms/config'
import * as cmsFilters from '../cms/filters'
import * as datasetsFilters from '../datasets/filters'
import filters from './index'
import * as utils from './utils'

// Overwrite the DCAT_ENDPOINTS const to make testing clearer and decoupled from real data
jest.mock('../datasets/config', () => ({
  DCAT_ENDPOINTS: {
    openapi: 'https://api.endpoint.com/openapi',
  },
}))

jest.mock('../../../map/graphql', () => ({
  THEME_FILTER: {
    ...FILTERS.THEME,
    options: [],
  },
}))

describe('filters', () => {
  let mockGetCmsFilters: jest.SpyInstance<any>
  let mockGetDatasetsFilters: jest.SpyInstance<any>
  let mockCombineFilters: jest.SpyInstance<any>
  let mockCMSDataloader = jest.fn()
  let mockDatasetsDataloader = jest.fn()

  const FILTER: Filter = {
    filterType: FilterType.Radio,
    type: 'test',
    label: 'Test',
    options: [{ id: 'test-option', label: 'Test option' }],
  }

  beforeEach(() => {
    mockGetCmsFilters = jest.spyOn(cmsFilters, 'getThemeFilters').mockReturnValueOnce(FILTER)
    mockGetDatasetsFilters = jest.spyOn(datasetsFilters, 'default').mockReturnValueOnce([FILTER])
    mockCombineFilters = jest.spyOn(utils, 'combineFilters').mockReturnValueOnce([FILTER, FILTER])

    mockCMSDataloader = jest.fn(() => ({
      value: FILTER,
    }))
    mockDatasetsDataloader = jest.fn(() => ({
      value: FILTER,
    }))
  })

  afterEach(() => {
    mockGetCmsFilters.mockReset()
    mockGetDatasetsFilters.mockReset()
    mockCMSDataloader.mockReset()
    mockDatasetsDataloader.mockReset()
  })

  it('should retrieve the filters from the dataloaders', async () => {
    const CONTEXT = {
      loaders: {
        cms: { load: mockCMSDataloader, clear: jest.fn() },
        data: { load: jest.fn, clear: jest.fn() },
        datasets: { load: mockDatasetsDataloader, clear: jest.fn() },
      },
    }

    await filters({}, {}, CONTEXT)

    expect(mockCMSDataloader).toHaveBeenCalled()
    expect(mockGetCmsFilters).toHaveBeenCalledWith(FILTER)

    expect(mockDatasetsDataloader).toHaveBeenCalled()
    expect(mockGetDatasetsFilters).toHaveBeenCalledWith(FILTER)
  })

  it('and return the output form the combineResults function', async () => {
    const CONTEXT = {
      loaders: {
        cms: { load: mockCMSDataloader, clear: jest.fn() },
        data: { load: jest.fn, clear: jest.fn() },
        datasets: { load: mockDatasetsDataloader, clear: jest.fn() },
      },
    }

    const output = await filters({}, {}, CONTEXT)
    const themeFilter = {
      ...FILTERS.THEME,
      options: [],
    }

    expect(mockCombineFilters).toHaveBeenCalledWith([FILTER, FILTER, themeFilter])

    expect(output).toEqual([FILTER, FILTER])
  })

  it('unless something goes wrong', async () => {
    const ERROR = new Error('something went wrong')

    const CONTEXT = {
      loaders: {
        cms: {
          load: jest.fn(() => {
            throw ERROR
          }),
          clear: jest.fn(),
        },
        data: { load: jest.fn, clear: jest.fn() },
        datasets: { load: mockDatasetsDataloader, clear: jest.fn() },
      },
    }

    const output = await filters({}, {}, CONTEXT)

    expect(output).toEqual(ERROR)
  })
})
