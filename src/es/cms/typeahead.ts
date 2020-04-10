import { getCmsFromElasticSearch, getValuesFromES } from '.'
import { CmsType, CMS_TYPE_LABELS } from '../../graphql/search/cms/config'
import { TypeAheadSuggestion, TypeAheadSuggestionContent } from '../../typeahead'
import { DEFAULT_LIMIT } from '../../typeahead/config'

type CmsSuggestion = {
  title: string
  field_short_title?: string
  type: CmsType
  uuid: string
  field_special_type?: string
}

export function formatCmsResults(results: any): Array<TypeAheadSuggestionContent> {
  return results.map(({ _source: result }: any) => {
    const {
      title,
      field_short_title: shortTitle,
      type,
      uuid,
      field_special_type: subType,
    } = getValuesFromES(result) as CmsSuggestion

    let _display = shortTitle || title

    // When the field subType is present, it must be added to the display label
    if (subType) {
      _display += ` (${subType})`
    }

    return {
      _display,
      uri: `${process.env.CMS_URL}/jsonapi/node/${type}/${uuid}`,
      type,
    }
  })
}

export async function getCmsSuggestion(type: CmsType, query: string): Promise<TypeAheadSuggestion> {
  const { results, totalCount } = await getCmsFromElasticSearch({
    q: query,
    types: [type],
    limit: DEFAULT_LIMIT,
  })

  const formattedResults = formatCmsResults(results)

  return {
    label: CMS_TYPE_LABELS[type],
    total_results: totalCount,
    content: formattedResults,
  }
}
