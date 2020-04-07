import { getCmsFromElasticSearch, getCmsSubTypesFromElasticSearch } from '../../../es/cms'
import { CmsSearchResult, Filter } from '../../../generated/graphql'
import { Context, DEFAULT_LIMIT } from '../../config'
import getPageInfo from '../../utils/getPageInfo'
import { CmsType } from './config'
import getFormattedResults, { QueryCmsSearchArgs, ESFilters } from './normalize'
import { getThemeFilters, getDateFilters, getSubTypeFilters } from './filters'

const cmsSearch = (type: string) => async (
  _: any,
  { q, input }: QueryCmsSearchArgs,
  { loaders }: Context,
): Promise<CmsSearchResult> => {
  let { page, limit, filters: filterInput, sort } = input || {}

  // Set the subType
  const subType = type === CmsType.Special ? 'field_special_type' : ''

  // Get the page and limit from the input, otherwise use the defaults
  page = page || 1
  limit = limit || DEFAULT_LIMIT

  const from = (page - 1) * limit

  const { results, totalCount, filterCount } = await getCmsFromElasticSearch({
    q,
    limit,
    from,
    types: [type],
    filters: filterInput,
    sort,
    subType,
  })

  const formattedResults = getFormattedResults(results)

  const cmsThemeFilters: any = await loaders.cms.load(
    `${process.env.CMS_URL}/jsonapi/taxonomy_term/themes`,
  )

  let subTypeFilters: Filter | null = null
  if (type === CmsType.Special) {
    const cmsSubTypeFilters: Array<ESFilters> = await getCmsSubTypesFromElasticSearch(
      CmsType.Special,
      subType,
    )

    subTypeFilters = getSubTypeFilters(cmsSubTypeFilters, filterCount?.subType)
  }

  const themeFilters = getThemeFilters(cmsThemeFilters.value, filterCount?.theme)
  const dateFilters = getDateFilters()

  return {
    totalCount,
    results: formattedResults.filter(({ type: resultType }) => type === resultType),
    pageInfo: getPageInfo(totalCount, page, limit), // Get the page info details
    filters: [themeFilters, dateFilters, ...(subTypeFilters ? [subTypeFilters] : [])],
  }
}

const articleSearch = cmsSearch(CmsType.Article)

const publicationSearch = cmsSearch(CmsType.Publication)

const specialSearch = cmsSearch(CmsType.Special)

const collectionSearch = cmsSearch(CmsType.Collection)

export { articleSearch, publicationSearch, specialSearch, collectionSearch }
