import { SearchResult, QueryCmsSearchArgs, Result } from '../../../generated/graphql'
import { getValuesFromES, getFromElasticSearch } from '../../../es'
import { CMS_LABELS, CMS_TYPES } from '../../../config'
import { getFormattedDate } from '../../../normalize'

async function cmsResolver({ q, input }: QueryCmsSearchArgs): Promise<SearchResult> {
  let { limit, types } = input

  // Make sure that there's a value for types
  types = types || CMS_TYPES

  const results = await getFromElasticSearch(q, limit, types)

  const formattedResults: Array<Result> = results.map(({ _source: result }: any) => {
    const {
      title,
      field_short_title,
      field_slug,
      field_link,
      teaser_url,
      field_publication_date,
      field_publication_month,
      field_publication_year,
      field_special_type,
      field_intro,
      body,
      field_file,
      media_image_url,
      uuid,
      type,
    } = getValuesFromES(result) as any    

    return {
      id: uuid,
      label: field_short_title || title,
      slug: field_slug,
      type: type,
      body,
      teaserImage: teaser_url,
      coverImage: media_image_url,
      date: field_publication_date,
      specialType: field_special_type,
      file: field_file,
      intro: field_intro,
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
    results: types.map((type: any) => {
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
