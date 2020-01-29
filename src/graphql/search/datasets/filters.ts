import {
  formatFilters,
  // getCatalogFilters
} from './normalize'
import { Filter } from '../../../generated/graphql'

export default (facets: any, openApiResults: any): { filters: Array<Filter> } => {
  const filters = formatFilters(facets, openApiResults)

  return {
    filters,
  }
}
