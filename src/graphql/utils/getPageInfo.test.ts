import getPageInfo from './getPageInfo'

// Overwrite the DEFAULT_LIMIT const to make testing clearer and decoupled from real data
jest.mock('../config', () => ({
  DEFAULT_LIMIT: 12,
}))

describe('getPageInfo', () => {
  it('returns the pageInfo object when only totalCount is given', () => {
    const output = getPageInfo(12)

    expect(output).toEqual({
      hasNextPage: false, // totalCount equals DEFAULT_LIMIT
      totalPages: 1,
    })
  })

  it('returns the pageInfo object when custom limit', () => {
    const output = getPageInfo(21, 1, 10)

    expect(output).toEqual({
      hasNextPage: true,
      totalPages: 3,
    })
  })
})
