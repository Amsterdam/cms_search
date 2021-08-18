import { CombinedDataResult, Filter, FilterOption } from '../../../generated/graphql'
import { FilterType } from '../../config'
import { DataSearchType, DATA_SEARCH_ENDPOINTS, DATA_SEARCH_FILTER } from './config'

export default (results: CombinedDataResult[]): Array<Filter> => {
  const options: Array<FilterOption> = []

  DATA_SEARCH_ENDPOINTS.forEach((result: DataSearchType) => {
    if (!options.find(({ id }) => result.type === id)) {
      const { count = 0 } = results.find(({ type }) => type === result.type) || {}

      options.push({
        id: result.type,
        label: result.label,
        count,
      })
    }
  })

  return [
    {
      type: DATA_SEARCH_FILTER.type,
      label: DATA_SEARCH_FILTER.label,
      filterType: FilterType.Radio,
      options,
    },
  ]
}
