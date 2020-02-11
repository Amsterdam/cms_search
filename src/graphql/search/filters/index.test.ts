import filters from './index'
import * as cmsFilters from '../cms/filters'
import * as datasetsFilters from '../datasets/filters'
import * as utils from './utils'

// Overwrite the DCAT_ENDPOINTS const to make testing clearer and decoupled from real data
jest.mock('../datasets/config', () => ({
  DCAT_ENDPOINTS: {
    openapi: 'https://api.endpoint.com/openapi',
  },
}))

describe('filters', () => {
  let mockGetCmsFilters: jest.SpyInstance<any>
  let mockGetDatasetsFilters: jest.SpyInstance<any>
  let mockCombineFilters: jest.SpyInstance<any>
  let mockCMSDataloader = jest.fn()
  let mockDatasetsDataloader = jest.fn()

  const FILTERS = [
    {
      type: 'test',
      label: 'Test',
      options: [{ id: 'test-option', label: 'Test option' }],
    },
  ]

  beforeEach(() => {
    mockGetCmsFilters = jest.spyOn(cmsFilters, 'default').mockReturnValueOnce(FILTERS)
    mockGetDatasetsFilters = jest.spyOn(datasetsFilters, 'default').mockReturnValueOnce(FILTERS)
    mockCombineFilters = jest
      .spyOn(utils, 'combineFilters')
      .mockReturnValueOnce([...FILTERS, ...FILTERS])

    mockCMSDataloader = jest.fn(() => ({
      value: FILTERS,
    }))
    mockDatasetsDataloader = jest.fn(() => ({
      value: FILTERS,
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
    expect(mockGetCmsFilters).toHaveBeenCalledWith(FILTERS)

    expect(mockDatasetsDataloader).toHaveBeenCalled()
    expect(mockGetDatasetsFilters).toHaveBeenCalledWith(FILTERS)
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

    expect(mockCombineFilters).toHaveBeenCalledWith([...FILTERS, ...FILTERS])

    expect(output).toEqual([...FILTERS, ...FILTERS])
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
