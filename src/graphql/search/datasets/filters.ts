import { formatFilters } from './normalize'
import { Filter } from '../../../generated/graphql'

export default (openApiResults: any, facets?: any): Array<Filter> =>
  formatFilters(openApiResults, facets)
