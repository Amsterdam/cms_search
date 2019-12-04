import {
  CmsSearchResult
} from '../../../../generated/graphql'
import { CMS_TYPES } from '../../../../config'
import getFromCMS, { QueryCmsSearchArgs } from './normalize'

async function articleSearch(_: any, { q, input }: QueryCmsSearchArgs): Promise<CmsSearchResult> {
  return await getFromCMS(CMS_TYPES.ARTICLE, { q, input })
}

async function publicationSearch(_: any, { q, input }: QueryCmsSearchArgs): Promise<CmsSearchResult> {
  return await getFromCMS(CMS_TYPES.PUBLICATION, { q, input })
}

async function specialSearch(_: any, { q, input }: QueryCmsSearchArgs): Promise<CmsSearchResult> {
  return await getFromCMS(CMS_TYPES.SPECIAL, { q, input })
}

export { articleSearch, publicationSearch, specialSearch }
