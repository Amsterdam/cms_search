import { Client } from '@elastic/elasticsearch'
import { DEFAULT_LIMIT } from '../../graphql/config'
import cmsSchema, { ElasticSearchArgs, getSubTypeValues } from './es.schema'

export interface ThemeFilterCount {
  key: number
  count: number
}

export interface SubTypeFilterCount {
  key: string
  count: number
}

export interface CmsElasticSearchResult {
  results: Array<CmsElasticSearchFields>
  totalCount: number
  filterCount: {
    theme: Array<ThemeFilterCount>
    subType: Array<SubTypeFilterCount>
  }
}

export interface CmsElasticSearchFields {
  _source: any
}

const CMS_ES_INDEX = 'elasticsearch_index_cms_articles_index'

const client = new Client({
  node: `http://${process.env.ELASTIC_HOST ?? ''}:9200`,
})

export function ElasticSearchClient(body: Record<string, unknown>) {
  // perform the actual search passing in the index, the search query and the type
  return client.search({ index: CMS_ES_INDEX, body })
}

export async function getCmsSubTypesFromElasticSearch(type: string, field: string) {
  const { buckets } = await ElasticSearchClient(getSubTypeValues(type, field)).then(
    (r) => r.body.aggregations[`unique_${field}`],
  )

  return buckets
}

export async function getCmsFromElasticSearch({
  q,
  limit = DEFAULT_LIMIT,
  from = 0,
  types,
  filters,
  sort,
  subType,
}: ElasticSearchArgs): Promise<CmsElasticSearchResult> {
  const results = await ElasticSearchClient(
    cmsSchema({ q, limit, from, types, filters, sort, subType }),
  ).then((r) => r.body)

  const countResults = Object.entries(results.aggregations).reduce((acc, [key, value]) => {
    // @ts-ignore
    const { buckets } = value.count
    return {
      ...acc,
      [key]: buckets.map(({ doc_count, key: k }: any) => ({
        key: k,
        count: doc_count,
      })),
    }
  }, {})

  // @ts-ignore
  const totalCount: number = countResults.type.reduce(
    (acc: number, { count }: { count: number }) => acc + count,
    0,
  )

  return {
    results: results.hits.hits,
    totalCount,
    // @ts-ignore
    filterCount: { ...countResults },
  }
}

/**
 * Quick fix for now: values from ES are Arrays with one entry, which is the only thing we need.
 * @param object
 */
export const getValuesFromES = (object: Record<string, unknown[]>): any =>
  Object.entries(object).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value && value.length ? value[0] : value,
    }),
    {},
  )
