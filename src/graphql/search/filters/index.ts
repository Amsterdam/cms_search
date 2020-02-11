import { Filter } from '../../../generated/graphql'
import { Context } from '../../config'
import getCmsFilters from '../cms/filters'
import { DCAT_ENDPOINTS } from '../datasets/config'
import getDatasetsFilters from '../datasets/filters'
import { combineFilters } from './utils'

export default async (_: any, {}, { loaders }: Context): Promise<Filter[]> => {
  try {
    // Get the drupal theme taxonomy from the DataLoader
    const cmsThemeTaxonomy: { value: any } = await loaders.cms.load(
      `${process.env.CMS_URL}/jsonapi/taxonomy_term/themes`,
    )

    const [cmsThemeFilters] = getCmsFilters(cmsThemeTaxonomy.value) // And construct the filters

    // Get the openapi taxonomy from the DataLoader
    const openApiTaxonomy: any = await loaders.datasets.load(DCAT_ENDPOINTS['openapi'])
    const [datasetsThemeFilters] = getDatasetsFilters(openApiTaxonomy.value)

    return combineFilters([cmsThemeFilters, datasetsThemeFilters])
  } catch (e) {
    return e
  }
}
