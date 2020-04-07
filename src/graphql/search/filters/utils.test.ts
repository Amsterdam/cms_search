import { Filter, FilterType } from '../../../generated/graphql'
import { combineFilterOptions, combineFilters } from './utils'

describe('utils', () => {
  const MOCK_FILTER_OPTIONS = [
    {
      id: 'test',
      label: 'Test option',
    },
  ]

  describe('combineFilterOptions', () => {
    it('should return the initial data when just one filter', () => {
      const input = MOCK_FILTER_OPTIONS

      expect(combineFilterOptions(input)).toEqual(input)
    })

    it('or when multiple matching filter options and additional options', () => {
      const input = [
        ...MOCK_FILTER_OPTIONS,
        ...MOCK_FILTER_OPTIONS,
        {
          id: 'test-2',
          label: 'Test option 2',
        },
      ]

      // The result is a new array with the first input, but with the options from the second filter input
      expect(combineFilterOptions(input)).toEqual([
        ...MOCK_FILTER_OPTIONS,
        {
          id: 'test-2',
          label: 'Test option 2',
        },
      ])
    })
  })

  describe('combineFilters', () => {
    const MOCK_FILTER: Filter[] = [
      {
        filterType: FilterType.Radio,
        label: 'Test',
        type: 'test',
        options: [
          {
            id: 'test',
            label: 'Test option',
          },
        ],
      },
    ]

    it('should return the initial data when just one filter', () => {
      const input = MOCK_FILTER

      expect(combineFilters(input)).toEqual(input)
    })

    it('or when multiple non-matching filters', () => {
      const input: Filter[] = [
        ...MOCK_FILTER,
        {
          filterType: FilterType.Radio,
          label: 'Test 2',
          type: 'test-2',
          options: [
            {
              id: 'test',
              label: 'Test option',
            },
          ],
        },
      ]

      expect(combineFilters(input)).toEqual(input)
    })

    it('should return no duplicate when multiple matching filters', () => {
      const input = [...MOCK_FILTER, ...MOCK_FILTER]

      // The result is a new array with only the first input
      expect(combineFilters(input)).toEqual([input[0]])
    })
  })
})
