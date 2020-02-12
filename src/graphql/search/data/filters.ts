import { DATA_SEARCH_FILTER, DATA_SEARCH_ENDPOINTS, DataSearchType } from './config'
import { FilterOptions, Filter, DataSearchResultType } from '../../../generated/graphql'
import { FilterTypes } from '../../config'

export default (results: DataSearchResultType[]): Array<Filter> => [
  {
    type: DATA_SEARCH_FILTER.type,
    label: DATA_SEARCH_FILTER.label,
    filterType: FilterTypes.Radio,
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
