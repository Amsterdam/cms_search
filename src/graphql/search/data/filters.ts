import { DATA_SEARCH_FILTER } from './config'
import { DataSearchResultType, FilterOptions } from '../../../generated/graphql'

export default (results: any): any => {
  // Return all the available data types as filters
  const filters = [
    {
      type: DATA_SEARCH_FILTER.type,
      label: DATA_SEARCH_FILTER.label,
      options: results.map(
        (result: DataSearchResultType): FilterOptions => ({
          id: result.type || '',
          label: result.label || '',
          count: result.count,
        }),
      ),
    },
  ]

  return {
    filters,
  }
}
