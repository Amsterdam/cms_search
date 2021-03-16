import { THEME_FILTER } from '../../../map/graphql'
import { Context } from '../../config'
import { getThemeFilters } from '../cms/filters'
import { DCAT_ENDPOINTS } from '../datasets/config'
import { combineFilters } from './utils'
import CustomError from '../../utils/CustomError'
import { formatFilters } from '../datasets/normalize'

export default async (_: any, {}, { loaders }: Context) => {
  // Get the drupal theme taxonomy from the DataLoader
  const cmsThemeTaxonomy = await loaders.cms.load(
    `${process.env.CMS_URL}/jsonapi/taxonomy_term/themes`,
  )

  if (cmsThemeTaxonomy.status === 'rejected') {
    throw new CustomError(cmsThemeTaxonomy.reason, 'cms', 'CMS Theme Taxonomy')
  }

  const cmsThemeFilters = getThemeFilters(cmsThemeTaxonomy.value) // And construct the filters

  // Get the openapi taxonomy from the DataLoader
  const openApiTaxonomy = await loaders.openAPI.load(DCAT_ENDPOINTS['openapi'])

  if (openApiTaxonomy.status === 'rejected') {
    throw new CustomError(openApiTaxonomy.reason, 'openapi', 'OpenAPI')
  }

  const [datasetsThemeFilters] = formatFilters(openApiTaxonomy.value)

  return combineFilters([cmsThemeFilters, datasetsThemeFilters, THEME_FILTER])
}
