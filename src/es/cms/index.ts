import { Client } from '@elastic/elasticsearch'
import { DEFAULT_LIMIT } from '../../graphql/config'
import cmsSchema, { ElasticSearchArgs, getSubTypeValues } from './es.schema'

export type ThemeFilterCount = {
  key: number
  count: number
}

export type SubTypeFilterCount = {
  key: string
  count: number
}

export type CmsElasticSearchResult = {
  results: Array<CmsElasticSearchFields>
  totalCount: number
  filterCount: {
    theme: Array<ThemeFilterCount>
    subType: Array<SubTypeFilterCount>
  }
}

export type CmsElasticSearchFields = {
  _source: any
}

const CMS_ES_INDEX = 'elasticsearch_index_cms_articles_index'

const client = new Client({
  node: `http://${process.env.ELASTIC_HOST}:9200`,
})

export function ElasticSearchClient(body: object) {
  // perform the actual search passing in the index, the search query and the type
  return client.search({ index: CMS_ES_INDEX, body: body })
}

export async function getCmsSubTypesFromElasticSearch(type: string, field: string) {
  const { buckets } = await ElasticSearchClient(getSubTypeValues(type, field)).then(
    (r) => r.body.aggregations[`unique_${field}`],
  )

  return buckets
}

export async function getCmsFromElasticSearch({
  q,
  limit,
  from,
  types,
  filters,
  sort,
  subType,
}: ElasticSearchArgs): Promise<CmsElasticSearchResult> {
  limit = limit || DEFAULT_LIMIT
  from = from || 0

  const results = await ElasticSearchClient(
    cmsSchema({ q, limit, from, types, filters, sort, subType }),
  ).then((r) => r.body)

  const countResults: any = Object.entries(results.aggregations).reduce((acc, [key, value]) => {
    // @ts-ignore
    const { buckets } = value.count
    return {
      ...acc,
      [key]: buckets.map(({ doc_count, key }: any) => ({
        key,
        count: doc_count,
      })),
    }
  }, {})

  const totalCount: number = countResults.type.reduce(
    (acc: number, { count }: any) => acc + count,
    0,
  )

  return {
    results: results.hits.hits,
    totalCount,
    filterCount: { ...countResults },
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
