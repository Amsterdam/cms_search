import { getThemeFilterOptions } from './normalize'

jest.mock('./config', () => ({
  FILTERS: {
    THEME: {
      type: 'test',
    },
  },
}))

jest.mock('../../../generated/drupal', () => ({
  DrupalThemeFilterIDs: {
    ['test-filter']: 41,
  },
}))

describe('utils', () => {
  describe('getThemeFilterOptions', () => {
    it('should return an array with objects that match the enum value from the config', () => {
      const input = {
        data: [
          {
            attributes: {
              drupal_internal__tid: 41,
              name: 'Test',
            },
          },
        ],
      }

      // The ID is combined from the Filters type and the enum value
      expect(getThemeFilterOptions(input)).toEqual([
        { count: 0, id: 'test:test-filter', label: 'Test' },
      ])
    })

    it('should return an array with objects that have no match with the enum value from the config', () => {
      const input = {
        data: [
          {
            attributes: {
              drupal_internal__tid: 42,
              name: 'Test',
            },
          },
        ],
      }

      // The ID is combined from the Filters type and the enum value
      expect(getThemeFilterOptions(input)).toEqual([{ count: 0, id: 'test:', label: 'Test' }])
    })
  })
})
