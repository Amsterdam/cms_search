import { Client } from '@elastic/elasticsearch'
import cmsSchema from './es.schema'
import config from '../config'

const client = new Client({
  node: `http://${process.env.ELASTIC_HOST}:9200`,
})

export function ElasticSearchClient(body: object) {
  // perform the actual search passing in the index, the search query and the type
  return client.search({ index: config.es.cms.index, body: body })
}

export async function getFromElasticSearch(q: any, limit: any = false, types: any = false) {
  const { defaultSize, defaultTypes } = config.es.cms

  limit = limit || defaultSize
  types =  types || defaultTypes

  const results: Array<object> = await ElasticSearchClient(cmsSchema(q, limit, types)).then(
    r => r.body.hits.hits,
  )

  return results;
}

/**
 * Quick fix for now: values from ES are Arrays with one entry, which is the only thing we need.
 * @param object
 */
export const getValuesFromES = (object: object): object =>
  Object.entries(object).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value && value.length ? value[0] : value,
    }),
    {},
  )

export default function ElasticSearchMiddelware(req: any, res: any) {
  ElasticSearchClient(cmsSchema(req.query.q || ''))
    .then(r => {
      res.send(r.body.hits.hits)
    })
    .catch(e => {
      console.error(e)
      res.send([])
    })
}
