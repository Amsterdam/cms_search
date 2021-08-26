import getEndpoints from './endpoints'

// Overwrite the DATA_SEARCH_ENDPOINTS and DATA_INDEX_ENDPOINTS to make testing clearer and decoupled from real data
jest.mock('./config', () => ({
  DATA_SEARCH_ENDPOINTS: [
    {
      type: 'documents',
      endpoint: 'https://api.endpoint.com/documents',
      labelSingular: 'Document',
      label: 'Documents',
      searchParam: 'document',
      queryMatcher: /^[A-Z]{2,3}\d/,
    },
    {
      type: 'documents',
      endpoint: 'https://api.endpoint.com/documents',
      labelSingular: 'Document',
      label: 'Documents',
      searchParam: 'abc_id_number',
      queryMatcher: /^ABC\d/,
      queryFormatter: /^ABC/,
    },
    {
      type: 'locations',
      endpoint: 'https://api.endpoint.com/locations',
      label: 'Locations',
      labelSingular: 'Location',
      searchParam: 'q',
    },
    {
      type: 'users',
      endpoint: 'https://api.endpoint.com/users',
      label: 'Users',
      labelSingular: 'User',
      searchParam: 'q',
    },
  ],
  DATA_INDEX_ENDPOINTS: [
    {
      type: 'documents',
      endpoint: 'https://api.endpoint.com/documents',
    },
    {
      type: 'locations',
      endpoint: 'https://api.endpoint.com/locations',
    },
  ],
}))

describe('Data endpoints', () => {
  it('uses the index endpoints with no query', () => {
    const endpoints = getEndpoints(null, [])

    expect(endpoints).toHaveLength(3)
    expect(endpoints[0]).toHaveProperty('endpoint', 'https://api.endpoint.com/documents')
    expect(endpoints[1]).toHaveProperty('endpoint', 'https://api.endpoint.com/locations')
    expect(endpoints[2]).toHaveProperty('endpoint', 'https://api.endpoint.com/users')
  })

  it('does not use duplicate endpoints with no query', () => {
    const endpoints = getEndpoints(null, [])
    const filtered = endpoints.filter(({ type }) => type === 'documents')

    expect(filtered).toHaveLength(1)
  })

  it('uses the search endpoints with a query', () => {
    const endpoints = getEndpoints('foobar', [])

    // Note that this query doesn't match the queryMatchers so we expect only 2 endpoints
    expect(endpoints).toHaveLength(2)
    expect(endpoints[0]).toHaveProperty('endpoint', 'https://api.endpoint.com/locations')
    expect(endpoints[1]).toHaveProperty('endpoint', 'https://api.endpoint.com/users')
  })

  it('uses the correct queryMatcher if the query is ABC2138059', () => {
    const endpoints = getEndpoints('ABC2138059', [])

    expect(endpoints).toHaveLength(4)
    expect(endpoints[0]).toHaveProperty('endpoint', 'https://api.endpoint.com/documents')

    const filtered = endpoints.filter(
      ({ queryMatcher }) => String(queryMatcher) === String(/^ABC\d/),
    )
    expect(filtered).toHaveLength(1)
  })
})
