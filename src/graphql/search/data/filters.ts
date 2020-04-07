import { CombinedDataResult, Filter, FilterOptions } from '../../../generated/graphql'
import { FilterType } from '../../config'
import { DataSearchType, DATA_SEARCH_ENDPOINTS, DATA_SEARCH_FILTER } from './config'

export default (results: CombinedDataResult[]): Array<Filter> => [
  {
    type: DATA_SEARCH_FILTER.type,
    label: DATA_SEARCH_FILTER.label,
    filterType: FilterType.Radio,
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
