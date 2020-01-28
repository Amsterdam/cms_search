import getFilters from './filters'

// Overwrite the DATA_SEARCH_FILTER const to make testing clearer and decoupled from real data
jest.mock('./config', () => ({
  DATA_SEARCH_FILTER: {
    type: 'filter1',
    label: 'Filter 1',
  },
  DATA_SEARCH_ENDPOINTS: [
    {
      type: 'users',
      labelSingular: 'User',
      label: 'Users',
    },
    {
      type: 'posts',
      labelSingular: 'Post',
      label: 'Posts',
    },
  ],
}))

describe('filters', () => {
  it('Should return the correct filters', () => {
    const input = [
      {
        type: 'users',
        count: 12,
      },
    ]

    const output = getFilters(input)

    // Return all filters and set the count when possible to match
    expect(output.filters).toEqual([
      {
        label: 'Filter 1',
        options: [
          { count: 12, id: 'users', label: 'Users' },
          { count: 0, id: 'posts', label: 'Posts' },
        ], // Strips the type field from the options and adds the field id
        type: 'filter1',
      },
    ])
  })
})
