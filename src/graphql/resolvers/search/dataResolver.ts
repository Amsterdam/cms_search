import fetch from 'node-fetch'
import { SearchResult, QueryDataSearchArgs, DataSearchResultType } from '../../../generated/graphql'
import { normalizeData } from '../../../normalize'

const DATA_SEARCH_CONFIG = [
  {
    endpoint: 'atlas/search/openbareruimte',
    type: 'openbare_ruimte_weg',
    label: 'Openbare Ruimte (Weg)',
    params: {
      subtype: 'weg',
    },
  },
  {
    endpoint: 'atlas/search/adres',
    type: 'adres',
    label: 'Adres',
  },
  {
    endpoint: 'atlas/search/openbareruimte',
    type: 'openbare_ruimte',
    label: 'Openbare Ruimte',
    params: {
      subtype: 'not_weg',
    },
  },
  {
    endpoint: 'atlas/search/kadastraalobject',
    type: 'kadastraal_object',
    label: 'Kadastraal object',
  },
  {
    endpoint: 'meetbouten/search',
    type: 'meetbouten',
    label: 'Meetbouten',
  },
  {
    endpoint: 'monumenten/search',
    type: 'monumenten',
    label: 'Monumenten',
  },
]

const dataResolver = async ({ q, input }: QueryDataSearchArgs, context: any): Promise<SearchResult> => {
  const { limit, types } = input
  const { token } = await context()
  let filteredDataSearchConfig = DATA_SEARCH_CONFIG


console.log('token', token);


  if (types) {
    filteredDataSearchConfig = filteredDataSearchConfig.filter((api: any) =>
      types.includes(api.type),
    )
  }

  const responses = await Promise.all(
    filteredDataSearchConfig.map((api: any) => {
      const query = new URLSearchParams({
        q,
        ...(api.params ? { ...api.params } : {}),
      }).toString()
      const url = `${process.env.API_ROOT}${api.endpoint}/?${query}`
      return fetch(url).then((res: any) => res.json())
    }),
  )

  let totalCount = 0
  const results = responses.map(
    ({ results, count }: any, i): DataSearchResultType => {
      const resultCount = count ? count : 0
      totalCount = totalCount + resultCount
      return {
        count: resultCount,
        label: filteredDataSearchConfig[i].label,
        type: filteredDataSearchConfig[i].type,
        results:
          results && results.slice(0, limit || -1).map((result: any) => normalizeData(result)),
      }
    },
  )

  return {
    totalCount,
    results,
  }
}

export default dataResolver
