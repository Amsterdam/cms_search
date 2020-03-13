import { TypeAheadSuggestion, TypeAheadSuggestionContent } from '.'
import { getCmsFromElasticSearch, getValuesFromES } from '../es/cms'
import { CmsType, LABELS } from '../graphql/search/cms/config'

export async function getCmsSuggestions(
  query: string,
  limit: number,
): Promise<TypeAheadSuggestion[]> {
  const types = [CmsType.Article, CmsType.Publication, CmsType.Collection]
  const { results, totalCount } = await getCmsFromElasticSearch({ q: query, types })

  const formattedResults = results.map(({ _source: result }) => {
    const { title, field_short_title: shortTitle, type, uuid } = getValuesFromES(result) as any

    return {
      _display: shortTitle || title,
      uri: `${process.env.CMS_URL}/jsonapi/node/${type}/${uuid}`,
      type,
    } as TypeAheadSuggestionContent
  })

  return types.map(type => ({
    label: LABELS[type],
    total_results: totalCount,
    content: formattedResults.filter(result => result.type === type).slice(0, limit),
  }))
}
