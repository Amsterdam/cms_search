import { THEME_FILTER } from '../../../map/graphql'
import { Context } from '../../config'
import { DCAT_ENDPOINTS } from '../datasets/config'
import { combineFilters } from './utils'
import CustomError from '../../utils/CustomError'
import { formatFilters } from '../datasets/normalize'

// eslint-disable-next-line no-empty-pattern
export default async (_: any, {}, { loaders }: Context) => {
  // Get the openapi taxonomy from the DataLoader
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const openApiTaxonomy = await loaders.openAPI.load(DCAT_ENDPOINTS.openapi)

  if (openApiTaxonomy.status === 'rejected') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    throw new CustomError(openApiTaxonomy.reason, 'openapi', 'OpenAPI')
  }

  const [datasetsThemeFilters] = formatFilters(openApiTaxonomy.value)

  return combineFilters([datasetsThemeFilters, THEME_FILTER])
}
