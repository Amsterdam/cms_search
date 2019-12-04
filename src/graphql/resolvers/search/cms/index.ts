import { CmsSearchResult } from '../../../../generated/graphql'
import { CMS_TYPES } from '../../../../config'
import getFromCMS, { QueryCmsSearchArgs } from './normalize'

const cmsSearch = (type: string) => async (
  _: any,
  { q, input }: QueryCmsSearchArgs,
): Promise<CmsSearchResult> => await getFromCMS(type, { q, input })

const articleSearch = cmsSearch(CMS_TYPES.ARTICLE)

const publicationSearch = cmsSearch(CMS_TYPES.PUBLICATION)

const specialSearch = cmsSearch(CMS_TYPES.SPECIAL)

export { articleSearch, publicationSearch, specialSearch }
