import { CmsSearchResult } from '../../../generated/graphql'
import { TYPES } from './config'
import getFormattedResults, { QueryCmsSearchArgs } from './normalize'
import getCmsFilters from './filters'
import { getCmsFromElasticSearch } from '../../../es/cms'

const cmsSearch = (type: string) => async (
  _: any,
  { q, input }: QueryCmsSearchArgs,
): Promise<CmsSearchResult> => {
  const { from, limit, filters: inputFilters, sort } = input || {}

  const { results, totalCount, filterCount } = await getCmsFromElasticSearch({
    q,
    limit,
    from,
    types: [type],
    filters: inputFilters,
    sort,
  })

  const formattedResults = getFormattedResults(results)
  const filters = await getCmsFilters(filterCount)

  return {
    totalCount,
    results: formattedResults.filter(({ type: resultType }) => type === resultType),
    ...filters,
  }
}

const articleSearch = cmsSearch(TYPES.ARTICLE)

const publicationSearch = cmsSearch(TYPES.PUBLICATION)

const specialSearch = cmsSearch(TYPES.SPECIAL)

export { articleSearch, publicationSearch, specialSearch }
