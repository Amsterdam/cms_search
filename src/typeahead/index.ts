import { getCmsFromElasticSearch, getValuesFromES } from '../es/cms'
import { LABELS, CmsTypes } from '../graphql/search/cms/config'

export default async ({ query }: any, res: any) => {
  const { q = '' } = query
  const types = [CmsTypes.Article, CmsTypes.Publication]

  const { results, totalCount } = await getCmsFromElasticSearch({ q, types })

  const formattedResults: Array<any> = results.map(({ _source: result }: any) => {
    const { title, field_short_title: shortTitle, type, uuid } = getValuesFromES(result) as any

    return {
      _display: shortTitle || title,
      uri: `${process.env.CMS_URL}/jsonapi/node/${type}/${uuid}`,
      type,
    }
  })

  return res.send(
    types.map(type => ({
      total_resuls: totalCount,
      label: LABELS[type],
      content: formattedResults.filter(({ type: resultType }) => type === resultType),
    })),
  )
}
