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

export default (req: any, res: any) => {
  ElasticSearchClient(cmsSchema(req.query.q || ''))
    .then(r => {
      res.send(r.body.hits.hits)
    })
    .catch(e => {
      console.error(e)
      res.send([])
    })
}
