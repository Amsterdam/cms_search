import fetch from 'node-fetch'
import dataSearchConfig from './config'
import {
  DataSearchResult,
  QueryDataSearchArgs,
  SearchResult,
  SearchResultType,
} from '../generated/graphql'

const globalNormalize = ({ _links, _display, type, ...otherField }: any): SearchResult => ({
  id: _links && _links.self ? _links.self.href.match(/([^\/]*)\/*$/)[1] : null,
  directLink: _links && _links.self ? _links.self.href : null,
  label: _display,
  type,
  ...otherField,
})

const resolvers = {
  dataSearch: async ({ q, input }: QueryDataSearchArgs): Promise<DataSearchResult> => {
    const { limit, types } = input
    let filteredDataSearchConfig = dataSearchConfig

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
      ({ results, count }: any, i): SearchResultType => {
        const resultCount = count ? count : 0
        totalCount = totalCount + resultCount
        return {
          count: resultCount,
          label: filteredDataSearchConfig[i].label,
          type: filteredDataSearchConfig[i].type,
          results:
            results && results.slice(0, limit || -1).map((result: any) => globalNormalize(result)),
        }
      },
    )

    return {
      totalCount,
      results,
    }
  },
}

export default resolvers
