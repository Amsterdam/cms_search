import {
  DataSearchResult,
  QueryDataSearchArgs,
  DataSearchResultType,
} from '../../../generated/graphql'
import { normalizeResults } from './normalize'
import { DATA_SEARCH_ENDPOINTS, DATA_SEARCH_FILTER, DATA_SEARCH_API_MAX_RESULTS } from './config'
import getFilters from './filters'
import { Context } from '../../config'
import CustomError from '../../utils/CustomError'

const index = async (
  _: any,
  { q: searchTerm, input }: QueryDataSearchArgs,
  context: Context,
): Promise<DataSearchResult> => {
  const { filters, limit = DATA_SEARCH_API_MAX_RESULTS } = input || {}
  const { loaders } = context

  let endpoints: Array<Object> = []

  // If there are filters in the request, not all endpoints should be called from DataLoader
  if (filters && filters.length > 0) {
    const filterTypes =
      filters.find(filter => filter.type === DATA_SEARCH_FILTER.type)?.values ?? []

    endpoints = DATA_SEARCH_ENDPOINTS.filter(({ type }) => filterTypes.includes(type))

    // Throw an error when the requested types don't exist
    if (endpoints.length === 0) {
      throw new Error('The entered type(s) does not exist')
    }
  } else {
    endpoints = DATA_SEARCH_ENDPOINTS
  }

  // Get the results from the DataLoader
  const dataloaderResults: DataSearchResultType[] = await Promise.all(
    // Construct the keys e.g. the URLs that should be loaded or fetched
    endpoints.map(async ({ endpoint, type, label, labelSingular }: any) => {
      const key = `${endpoint}/?q=${searchTerm}`
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
          results.length > 0 // TODO: Delete the slice once the pagination gets merged
            ? results.slice(0, limit).map((result: Object) => normalizeResults(result))
            : [],
      }
    }),
  )

  // Get the count of each individual type to calculate the total count for all types
  const totalCount =
    dataloaderResults.reduce((acc: number, { count }: { count: number }) => acc + count, 0) || 0

  return {
    totalCount,
    results: dataloaderResults,
    // Get the available filters and merge with the results to get a count
    ...getFilters(dataloaderResults),
  }
}

export default index
