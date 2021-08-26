import { FilterInput, Maybe } from '../../../generated/graphql'
import { DataSearchType, DATA_SEARCH_ENDPOINTS, DATA_INDEX_ENDPOINTS } from './config'

const getEndpoints = (
  query: Maybe<string> | undefined,
  filterInput: Maybe<Array<FilterInput>> | undefined,
) => {
  let endpoints: Array<DataSearchType> = []

  if (query) {
    // Only endpoints that expect a query in this format should be used
    endpoints = DATA_SEARCH_ENDPOINTS.filter(({ queryMatcher, ...endpoint }) => {
      // If the endpoint type is requested as a filter, don't remove the endpoint from the request to prevent errors
      if (filterInput?.find((filter: FilterInput) => filter.values.indexOf(endpoint.type) > -1)) {
        return endpoint.endpoint
      }

      if (queryMatcher) {
        return queryMatcher?.exec(query) && endpoint.endpoint
      }

      // Since the endpoints are stored in env's (check config.ts), the endpoint theoretically might not exist.
      // This will make sure undefined endpoints will be filtered out.
      return endpoint.endpoint
    })

    return endpoints
  }

  // Prevent duplicate endpoints when there is no query
  DATA_SEARCH_ENDPOINTS.forEach((endpoint) => {
    if (!endpoints.find(({ type }) => endpoint.type === type)) {
      // Most API searh endpoints require a query parameter so if there is no query present then we need to use a
      // non-search API endpoint
      const newEndpoint = DATA_INDEX_ENDPOINTS.find(
        (indexEndpoint) => endpoint.type === indexEndpoint.type,
      )

      if (newEndpoint) {
        endpoints.push({
          ...endpoint,
          endpoint: newEndpoint.endpoint,
        })
      } else {
        endpoints.push(endpoint)
      }
    }
  })

  return endpoints
}

export default getEndpoints
