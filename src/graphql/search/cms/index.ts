import { CmsSearchResult } from '../../../generated/graphql'
import { TYPES } from './config'
import getFormattedResults, { QueryCmsSearchArgs } from './normalize'
import getCmsFilters from './filters'
import { getCmsFromElasticSearch } from '../../../es/cms'
import { DEFAULT_LIMIT } from '../../config'
import getPageInfo from '../../utils/getPageInfo'

const cmsSearch = (type: string) => async (
  _: any,
  { q, input }: QueryCmsSearchArgs,
): Promise<CmsSearchResult> => {
  let { page, limit, filters: filterInput, sort } = input || {}

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
  })

  const formattedResults = getFormattedResults(results)
  const filters = await getCmsFilters(filterCount)

  // Get the page info details
  const pageInfo = getPageInfo(totalCount, page, limit)

  return {
    totalCount,
    results: formattedResults.filter(({ type: resultType }) => type === resultType),
    ...filters,
    ...pageInfo,
  }
}

const articleSearch = cmsSearch(TYPES.ARTICLE)

const publicationSearch = cmsSearch(TYPES.PUBLICATION)

const specialSearch = cmsSearch(TYPES.SPECIAL)

export { articleSearch, publicationSearch, specialSearch }
