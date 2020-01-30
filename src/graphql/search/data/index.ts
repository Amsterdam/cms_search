import { DataSearchResult, QueryDataSearchArgs } from '../../../generated/graphql'
import { combineTypeResults } from './normalize'
import { DATA_SEARCH_ENDPOINTS, DATA_SEARCH_LIMIT } from './config'
import getFilters from './filters'
import { Context } from '../../config'
import getPageInfo from '../../utils/getPageInfo'

const index = async (
  _: any,
  { q: searchTerm, input }: QueryDataSearchArgs,
  context: Context,
): Promise<DataSearchResult> => {
  let { page, limit } = input || {}
  const { filters } = input || {}
  const { loaders } = context

  // Get the page and limit from the input, otherwise use the defaults
  page = page || 1
  limit = limit || DATA_SEARCH_LIMIT

  const from = (page - 1) * limit

  let endpoints: Array<Object> = []

  // If there are filters in the request, not all endpoints should be called from DataLoader
  if (filters && filters.length > 0) {
    const filterTypes = filters.find(filter => filter.type === 'types')?.values ?? []

    endpoints = DATA_SEARCH_ENDPOINTS.filter(({ type }) => filterTypes.includes(type))

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
      const key = `${endpoint}?q=${searchTerm}${page ? `&page=${page}` : ''}`
      const result = await loaders.data.load(key)

      console.log(key)
      // https://acc.api.data.amsterdam.nl/atlas/search/adres/?q=p&page=8

      // If an error is thrown, delete the key from the cache and throw an error
      if (result.status !== 200) {
        loaders.data.clear(key)
      }

      console.log(result.results.length)

      return { ...result, type, label, labelSingular }
    }),
  )

  // Combine and normalize information about the types
  const results = combineTypeResults(dataloaderResults, limit, from) // Use the default values when there's no value found

  // Get the count of each individual type to calculate the total count for all types
  const totalCount =
    results.reduce((acc: number, { count }: { count: number }) => acc + count, 0) || 0

  return {
    totalCount,
    results,
    // Get the page info details
    ...getPageInfo(totalCount, page, limit),
    // Get the available filters and merge with the results to get a count
    ...getFilters(results),
  }
}

export default index
