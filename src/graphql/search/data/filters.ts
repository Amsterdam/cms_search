import { DATA_SEARCH_FILTER, DATA_SEARCH_ENDPOINTS, DataSearchType } from './config'
import { FilterOptions, Filter, DataSearchResultType } from '../../../generated/graphql'
import { FILTER_TYPES } from '../../config'

export default (results: DataSearchResultType[]): { filters: Array<Filter> } => {
  const filters = [
    {
      type: DATA_SEARCH_FILTER.type,
      label: DATA_SEARCH_FILTER.label,
      filterType: FILTER_TYPES.RADIO,
      options: DATA_SEARCH_ENDPOINTS.map(
        // Return all the available data types as filter options
        (result: DataSearchType): FilterOptions => {
          const { count = 0 } = results.find(({ type }) => type === result.type) || {}

          return {
            id: result.type,
            label: result.label,
            count,
          }
        },
      ),
    },
  ]

  return {
    filters,
  }
}
