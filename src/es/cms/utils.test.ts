import { getThemeFilter, getSubTypeFilter } from './utils'

jest.mock('../../graphql/search/cms/config', () => ({
  FILTERS: {
    THEME: {
      type: 'test',
    },
    SUBTYPE: {
      type: 'subtypeTest',
    },
  },
}))

jest.mock('../../generated/drupal', () => ({
  DRUPAL_THEME_FILTER_IDS: new Map([['test-filter', 41]]),
}))

describe('utils', () => {
  describe('getThemeFilter', () => {
    it('should return an object with the matched enum value from the config', () => {
      const input = [
        {
          type: 'test',
          values: ['test:test-filter'],
        },
      ]

      expect(getThemeFilter(input)).toEqual({ terms: { field_theme_id: [41] } })
    })

    it('should return null if there is no matched enum value from the config', () => {
      const input = [
        {
          type: 'test',
          values: ['test:filter'],
        },
      ]

      expect(getThemeFilter(input)).toEqual(null)
    })

    it('or when there are no values found in the filter', () => {
      const input = [
        {
          type: 'test',
          values: [''],
        },
      ]

      expect(getThemeFilter(input)).toEqual(null)
    })
  })

  describe('getSubTypeFilter', () => {
    it('should return an object with the matched enum value from the config', () => {
      const input = [
        {
          type: 'subtypeTest',
          values: ['subtypeTest:test-filter'],
        },
      ]

      expect(getSubTypeFilter(input)).toEqual([{ term: { field_special_type: 'test-filter' } }])
    })

    it('should return an empty array if there is no matched enum value from the config or when there are no values found in the filter', () => {
      let input = [
        {
          type: 'test123',
          values: ['test123:filter'],
        },
      ]

      expect(getSubTypeFilter(input)).toEqual([])

      input = [
        {
          type: 'subtypeTest',
          values: [''],
        },
      ]

      expect(getSubTypeFilter(input)).toEqual([])
    })
  })
})
