import ElasticSearch from 'elasticsearch'
import cmsSchema from './es.schema'
import config from '../config'

const client = new ElasticSearch.Client({
  hosts: [process.env.ES_HOST],
})

client.ping(
  {
    requestTimeout: 30000,
  },
  (error: any) => {
    error ? console.error('ElasticSearch cluster is down!') : console.log('ElasticSearch is ok')
  },
)

export function ElasticSearchClient(body: object) {
  // perform the actual search passing in the index, the search query and the type
  return client.search({ index: config.es.cms.index, body: body })
}

export default (req: any, res: any) => {
  ElasticSearchClient(cmsSchema(req.query.q || ''))
    .then(r => {
      res.send(r['hits']['hits'])
    })
    .catch(e => {
      console.error(e)
      res.send([])
    })
}
