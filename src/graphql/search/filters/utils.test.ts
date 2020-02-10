import { combineFilters } from './utils'

describe('utils', () => {
  describe('combineFilters', () => {
    const MOCK_FILTER = [
      {
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
      const input = [
        ...MOCK_FILTER,
        {
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

    it('or when multiple matching filters with additional options', () => {
      const input = [
        ...MOCK_FILTER,
        {
          ...MOCK_FILTER[0],
          options: [
            {
              id: 'test-2',
              label: 'Test option 2',
            },
            {
              id: 'test-3',
              label: 'Test option 3',
            },
          ],
        },
      ]

      // The result is a new array with the first input, but with the options from the second filter input
      expect(combineFilters(input)).toEqual([
        {
          ...MOCK_FILTER[0],
          options: [
            ...MOCK_FILTER[0].options,
            {
              id: 'test-2',
              label: 'Test option 2',
            },
            {
              id: 'test-3',
              label: 'Test option 3',
            },
          ],
        },
      ])
    })
  })
})
