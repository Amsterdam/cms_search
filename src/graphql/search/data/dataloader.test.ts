// import DataLoader from 'dataloader'

import { LRUMap } from 'lru_map'
import { createDataLoader } from './dataloader'
import DataLoader from 'dataloader'
import { MAX_CACHE_SIZE } from './config'
import * as loaderFunction from '../../utils/loaderFunction'

jest.mock('../../utils/loaderFunction')
jest.mock('dataloader')
jest.mock('lru_map')

describe('dataloader', () => {
  const mockedDataLoader = <jest.Mock<typeof DataLoader, any>>(<unknown>DataLoader)
  const mockedLRUMap = <jest.Mock<any, any>>(<unknown>LRUMap)

  it('should return the cached dataloader when there is no token given', () => {
    const mockedLoaderFunction = jest.spyOn(loaderFunction, 'default').mockReturnValueOnce({})

    mockedDataLoader.mockImplementation((): any => true)
    mockedLRUMap.mockImplementation((): any => true)

    const output = createDataLoader('')

    expect(mockedLRUMap).toHaveBeenCalledWith(MAX_CACHE_SIZE)
    expect(mockedLRUMap).toHaveBeenCalledTimes(1)

    expect(mockedDataLoader).toHaveBeenCalledWith(mockedLoaderFunction, {
      cache: true,
      cacheMap: jasmine.any(LRUMap),
    })

    expect(output).toEqual(jasmine.any(DataLoader))

    mockedLRUMap.mockReset()
    mockedDataLoader.mockReset()
    mockedLoaderFunction.mockReset()
  })

  it('should return the cached dataloader when there is a token given', () => {
    mockedDataLoader.mockImplementation((): any => true)
    mockedLRUMap.mockImplementation((): any => true)

    const output = createDataLoader('erewrerewr')

    // The cacheMap MUST not be used
    expect(mockedLRUMap).not.toHaveBeenCalled()

    // TODO: Check if the spy on loaderFunction can be accepted as `anonymous` function here
    expect(mockedDataLoader).toHaveBeenCalledWith(jasmine.any(Function), {
      cache: false, // Make sure there's no cache when a token is given
    })

    expect(output).toEqual(jasmine.any(DataLoader))
  })
})
