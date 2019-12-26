import { CmsSearchResult } from '../../../../generated/graphql'
import { CMS_TYPES } from '../../../../config'
import getFormattedResults, { QueryCmsSearchArgs } from './normalize'
import getCmsFilters from './filters'
import { getCmsFromElasticSearch } from '../../../../es'

const cmsSearch = (type: string) => async (
  _: any,
  { q, input }: QueryCmsSearchArgs,
): Promise<CmsSearchResult> => {


  const { from, limit, filters: inputFilters } = input

  const { results, totalCount, filterCount } = await getCmsFromElasticSearch({
    q,
    limit,
    from,
    types: [type],
    filters: inputFilters
  })

  const formattedResults = getFormattedResults(results)
  const filters = await getCmsFilters(filterCount)

  return {
    totalCount,
    results: formattedResults.filter(({ type: resultType }) => type === resultType),
    ...filters
  }
}

const articleSearch = cmsSearch(CMS_TYPES.ARTICLE)

const publicationSearch = cmsSearch(CMS_TYPES.PUBLICATION)

const specialSearch = cmsSearch(CMS_TYPES.SPECIAL)

export { articleSearch, publicationSearch, specialSearch }
