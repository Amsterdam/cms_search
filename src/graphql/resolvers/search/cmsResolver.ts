import { SearchResult, QueryCmsSearchArgs, Result } from '../../../generated/graphql'
import { ElasticSearchClient, getValuesFromES } from '../../../es'
import cmsSchema from '../../../es/es.schema'
import config, { CMS_LABELS } from '../../../config'
import { getFormattedDate } from '../../../normalize'

const cmsResolver = async ({ q, input }: QueryCmsSearchArgs): Promise<SearchResult> => {
  let { limit, types } = input
  const { defaultSize, defaultTypes } = config.es.cms

  limit = limit || defaultSize
  types = types || defaultTypes

  const results: Array<object> = await ElasticSearchClient(cmsSchema(q, limit, types)).then(
    r => r.body.hits.hits,
  )

  const formattedResults: Array<Result> = results.map(({ _source }: any) => {
    const {
      field_short_title,
      field_slug,
      field_link,
      teaser_url,
      field_publication_date,
      field_publication_month,
      field_publication_year,
      field_special_type,
      body,
      field_file,
      media_image_url,
      uuid,
      type,
    } = getValuesFromES(_source) as any
    return {
      id: uuid,
      label: field_short_title,
      slug: field_slug,
      type: type,
      body,
      teaserImage: teaser_url,
      coverImage: media_image_url,
      date: field_publication_date,
      specialType: field_special_type,
      file: field_file,
      link: field_link,
      dateLocale: getFormattedDate(
        field_publication_date,
        field_publication_year,
        field_publication_month,
      ),
    }
  })

  return {
    totalCount: results.length,
    results: types.map((type: string | number) => {
      const results = formattedResults.filter(({ type: resultType }) => type === resultType)
      return {
        count: results.length,
        label: CMS_LABELS[type],
        type: type,
        results,
      }
    }),
  }
}

export default cmsResolver
