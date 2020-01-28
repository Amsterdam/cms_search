import { DEFAULT_FROM, DEFAULT_LIMIT } from '../../../config'
import { DataSearchResult, QueryDataSearchArgs } from '../../../generated/graphql'
import { combineTypeResults } from './normalize'
import { DATA_SEARCH_ENDPOINTS } from './config'
import getFilters from './filters'

const index = async (
  _: any,
  { q: searchTerm, input }: QueryDataSearchArgs,
  context: {
    loaders: { data: { load: Function; clear: Function } }
  },
): Promise<DataSearchResult> => {
  const { limit, from, types } = input || {}
  const { loaders } = context

  let endpoints: any = []

  // If there are types in the request, not all endpoints should be called from DataLoader
  if (types && types.length > 0) {
    endpoints = DATA_SEARCH_ENDPOINTS.filter(({ type }: any) => types.includes(type))

    // Throw an error when the requested types don't exist
    if (endpoints.length === 0) {
      throw new Error('The entered type(s) does not exist')
    }
  } else {
    endpoints = DATA_SEARCH_ENDPOINTS
  }

  // Get the results from the DataLoader
  const dataloaderResults: Object[] = await Promise.all(
    // Construct the keys e.g. the URLs that should be loaded or fetched
    endpoints.map(async ({ endpoint, type, label, labelSingular }: any) => {
      const key = `${endpoint}?q=${searchTerm}`
      const result = await loaders.data.load(key)

      // If an error is thrown, delete the key from the cache and try again
      if (result.status !== 200) {
        loaders.data.clear(`${endpoint}?q=${searchTerm}`)
      }

      return { ...result, type, label, labelSingular }
    }),
  )

  // Combine and normalize information about the types
  const results = combineTypeResults(
    dataloaderResults,
    limit || DEFAULT_LIMIT,
    from || DEFAULT_FROM,
  ) // Use the default values when there's no value found

  // Get the count of each individual type to calculate the total count for all types
  const totalCount =
    results.reduce((acc: number, { count }: { count: number }) => acc + count, 0) || 0

  // Get the available filters and merge with the results to get a count
  const filters = getFilters(results)

  return {
    totalCount,
    results,
    ...filters,
  }
}

export default index
