import { Client } from '@elastic/elasticsearch'
import { SearchResponse } from 'elasticsearch'
import cmsSchema, { ElasticSearchArgs } from './es.schema'
import config from '../config'

const client = new Client({
  node: `http://${process.env.ELASTIC_HOST}:9200`,
})

export function ElasticSearchClient(body: object) {
  // perform the actual search passing in the index, the search query and the type
  return client.search({ index: config.es.cms.index, body: body })
}

export async function getCmsFromElasticSearch({ q, limit, from, types, filters }: ElasticSearchArgs) {
  const { defaultSize } = config.es.cms

  limit = limit || defaultSize
  from = from || 0
  types = types

  const themeFilter = filters && filters.find(filter => filter.type === 'theme')
  const themeFilterValues =  themeFilter && themeFilter.values && themeFilter.values.map(value => value.split(':').pop())

  const results: SearchResponse<any> = await ElasticSearchClient(
    cmsSchema({ q, limit, from, types, filters: themeFilterValues }),
  ).then(r => r.body)
  const countResults: any = Object.entries(results.aggregations).reduce((acc, [key, value]) => {
    // @ts-ignore
    const { buckets } = value
    return {
      ...acc,
      [key]: buckets.map(({ doc_count, key }: any) => ({
        key,
        count: doc_count,
      })),
    }
  }, {})

  const totalCount = countResults.count_by_type.reduce(
    (acc: number, { count }: any) => acc + count,
    0,
  )

  return {
    results: results.hits.hits,
    totalCount,
    filterCount: { theme: countResults.count_by_theme },
  }
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
