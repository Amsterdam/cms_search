import { getCmsFromElasticSearch, getValuesFromES } from '.'
import { CmsType, CMS_TYPE_LABELS } from '../../graphql/search/cms/config'
import { TypeAheadSuggestion, TypeAheadSuggestionContent } from '../../typeahead'
import { DEFAULT_LIMIT } from '../../typeahead/config'

export async function getCmsSuggestion(type: CmsType, query: string): Promise<TypeAheadSuggestion> {
  const { results, totalCount } = await getCmsFromElasticSearch({
    q: query,
    types: [type],
    limit: DEFAULT_LIMIT,
  })

  const formattedResults = results.map(({ _source: result }) => {
    const { title, field_short_title: shortTitle, type, uuid } = getValuesFromES(result) as any

    return {
      _display: shortTitle || title,
      uri: `${process.env.CMS_URL}/jsonapi/node/${type}/${uuid}`,
      type,
    } as TypeAheadSuggestionContent
  })

  return {
    label: CMS_TYPE_LABELS[type],
    total_results: totalCount,
    content: formattedResults,
  }
}
