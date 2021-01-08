import { Filter } from '../../../generated/graphql'
import { FilterType } from '../../config'
import { FILTERS } from '../cms/config'
import * as cmsFilters from '../cms/filters'
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
  let mockCombineFilters: jest.SpyInstance<any>
  let mockCMSDataloader = jest.fn()
  let mockDatasetsDataloader = jest.fn()
  let mockOpenAPIDataloader = jest.fn()

  const FILTER: Filter = {
    filterType: FilterType.Radio,
    type: 'test',
    label: 'Test',
    options: [{ id: 'test-option', label: 'Test option' }],
  }

  beforeEach(() => {
    mockGetCmsFilters = jest.spyOn(cmsFilters, 'getThemeFilters').mockReturnValueOnce(FILTER)
    mockCombineFilters = jest.spyOn(utils, 'combineFilters').mockReturnValueOnce([FILTER, FILTER])

    mockCMSDataloader = jest.fn(() => ({
      status: 'fulfilled',
      value: FILTER,
    }))
    mockDatasetsDataloader = jest.fn(() => ({
      status: 'fulfilled',
      value: FILTER,
    }))
  })

  afterEach(() => {
    mockGetCmsFilters.mockReset()
    mockCMSDataloader.mockReset()
    mockDatasetsDataloader.mockReset()
    mockOpenAPIDataloader.mockReset()
  })

  it('should retrieve the filters from the dataloaders', async () => {
    const CONTEXT: any = {
      loaders: {
        cms: { load: mockCMSDataloader, clear: jest.fn() },
        data: { load: jest.fn, clear: jest.fn() },
        datasets: { load: mockDatasetsDataloader, clear: jest.fn() },
        openAPI: { load: mockOpenAPIDataloader, clear: jest.fn() },
      },
    }

    await filters({}, {}, CONTEXT)

    expect(mockCMSDataloader).toHaveBeenCalled()
    expect(mockGetCmsFilters).toHaveBeenCalledWith(FILTER)

    expect(mockDatasetsDataloader).toHaveBeenCalled()
  })

  it('and return the output form the combineResults function', async () => {
    const CONTEXT: any = {
      loaders: {
        cms: { load: mockCMSDataloader, clear: jest.fn() },
        data: { load: jest.fn, clear: jest.fn() },
        datasets: { load: mockDatasetsDataloader, clear: jest.fn() },
        openAPI: { load: mockOpenAPIDataloader, clear: jest.fn() },
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

  it.only('unless something goes wrong', async () => {
    const CONTEXT: any = {
      loaders: {
        cms: {
          load: jest.fn(() => ({
            status: 'rejected',
            reason: 'some reason but this will not be used by CustomError',
          })),
          clear: jest.fn(),
        },
        data: { load: jest.fn, clear: jest.fn() },
        datasets: { load: mockDatasetsDataloader, clear: jest.fn() },
        openAPI: { load: mockOpenAPIDataloader, clear: jest.fn() },
      },
    }

    await expect(filters({}, {}, CONTEXT)).rejects.toThrow(
      'Something went wrong while requesting CMS Theme Taxonomy',
    )
  })
})
