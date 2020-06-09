import queryString from 'querystring'
import {
  CombinedDataResult,
  DataSearchResult,
  QueryDataSearchArgs,
} from '../../../generated/graphql'
import { Context } from '../../config'
import CustomError from '../../utils/CustomError'
import getPageInfo from '../../utils/getPageInfo'
import {
  DataSearchType,
  DATA_SEARCH_ENDPOINTS,
  DATA_SEARCH_FILTER,
  DATA_SEARCH_LIMIT,
  DATA_SEARCH_MAX_RESULTS,
} from './config'
import getFilters from './filters'
import { normalizeResults } from './normalize'

const index = async (
  _: any,
  { q, input }: QueryDataSearchArgs,
  context: Context,
): Promise<DataSearchResult> => {
  let { page, limit } = input || {}
  const { filters: filterInput } = input || {}
  const { loaders } = context

  // Get the limit from the input, but only when the page is `null`
  limit = page || !limit ? DATA_SEARCH_LIMIT : limit
  page = page || 1 // Get the page from the input, otherwise use the default

  let endpoints: Array<DataSearchType> = DATA_SEARCH_ENDPOINTS

  // Only endpoints that expect a query in this format should be used
  endpoints = endpoints.filter(({ queryMatcher, ...endpoint }) => {
    if (queryMatcher) {
      return !!q?.match(queryMatcher) ? endpoint : null
    }

    return endpoint
  })

  // If there are filters in the request, not all endpoints should be called from DataLoader
  if (filterInput && filterInput.length > 0) {
    const filterTypes =
      filterInput.find((filter) => filter.type === DATA_SEARCH_FILTER.type)?.values ?? []

    endpoints = endpoints.filter(({ type }) => filterTypes.includes(type))

    // Throw an error when the requested types don't exist
    if (endpoints.length === 0) {
      throw new Error('The entered type(s) does not exist')
    }
  }

  // Get the results from the DataLoader
  const dataloaderResults: CombinedDataResult[] = await Promise.all(
    // Construct the keys e.g. the URLs that should be loaded or fetched
    endpoints.map(
      async ({ endpoint, type, searchParam, queryFormatter, params, label, labelSingular }) => {
        // Remove search parameter prefixes
        q = queryFormatter ? q?.replace(queryFormatter, '') : q

        const query = queryString.stringify({ [searchParam]: q, page, ...(params || {}) })

        const key = `${endpoint}/?${query}`
        const result = await loaders.data.load(key)
        const { status, value } = result

        // If an error is thrown, delete the key from the cache and throw an error
        if (status === 'rejected') {
          loaders.data.clear(key)

          return {
            count: 0,
            label: label,
            type,
            results: new CustomError(result.reason, type, label), // GraphQL can handle Error as response on nullable types and will return `null` for the field and places the Error in the `errors` field, extending the error to handle this will break the autogeneration of types
          }
        }

        // The Promise resolved, so return the valid Data
        const { results = [], count } = value || {}

        return {
          count: count || 0,
          label: count === 1 ? labelSingular : label,
          type,
          results:
            results.length > 0 // TODO: Add test to see if the corect number of results is returned
              ? results.slice(0, limit).map((result: Object) => normalizeResults(result, type))
              : [],
        }
      },
    ),
  )

  // Get the count of each individual type to calculate the total count for all types
  const totalCount =
    dataloaderResults.reduce((acc: number, { count }: { count: number }) => acc + count, 0) || 0

  // IMPORTANT: The data APIs currently return a maximum of 1000 results
  const hasLimitedResults = !!(totalCount > DATA_SEARCH_MAX_RESULTS)

  const pageInfo = {
    // Get the page info details
    ...getPageInfo(
      hasLimitedResults ? DATA_SEARCH_MAX_RESULTS : totalCount,
      page,
      DATA_SEARCH_LIMIT,
    ),
    hasLimitedResults,
  }

  // Get the available filters and merge with the results to get a count
  const filters = getFilters(dataloaderResults)

  return {
    totalCount,
    pageInfo,
    results: dataloaderResults,
    filters,
  }
}

export default index
