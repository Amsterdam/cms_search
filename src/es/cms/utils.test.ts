import { getThemeFilter } from './utils'

jest.mock('../../graphql/search/cms/config', () => ({
  FILTERS: {
    THEME: {
      type: 'test',
    },
  },
}))

jest.mock('../../generated/drupal', () => ({
  DrupalThemeFilterIDs: {
    ['test-filter']: 41,
  },
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
})
