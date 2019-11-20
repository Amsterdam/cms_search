import { getFromElasticSearch, getValuesFromES } from '../es'
import { CMS_LABELS } from '../config'

export default async function TypeAheadMiddelware({ query }: any, res: any) {
  const { q = '' } = query
  const types = ['article', 'publication']

  const results = await getFromElasticSearch({ q, types })

  const formattedResults: Array<any> = results.map(({ _source: result }: any) => {
    const { title, field_short_title: shortTitle, type, uuid } = getValuesFromES(result) as any

    return {
      _display: shortTitle || title,
      uri: `${process.env.CMS_URL}/jsonapi/node/${type}/${uuid}`,
      type,
    }
  })

  return res.send(
    types.map(type => {
      const results = formattedResults.filter(({ type: resultType }) => type === resultType)
      return {
        total_resuls: results.length,
        label: CMS_LABELS[type],
        content: results,
      }
    }),
  )
}
