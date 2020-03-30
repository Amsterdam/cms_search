import { getCmsFromElasticSearch, getValuesFromES } from '.'
import { CmsType } from '../../graphql/search/cms/config'
import { TypeAheadSuggestion, TypeAheadSuggestionContent } from '../../typeahead'
import { DEFAULT_LIMIT } from '../../typeahead/config'

const LABELS = {
  [CmsType.Article]: 'Artikelen',
  [CmsType.Publication]: 'Publicaties',
  [CmsType.Special]: 'Specials',
  [CmsType.Collection]: 'Dossiers',
}

export async function getCmsSuggestions(query: string): Promise<TypeAheadSuggestion[]> {
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
    content: formattedResults.filter(result => result.type === type).slice(0, DEFAULT_LIMIT),
  }))
}
