import fetch from 'node-fetch'
import {
  QueryDataSearchArgs,
  DataSearchResultType,
  DataSearchResult,
  FilterOptions,
  Maybe,
  DataResult,
} from '../../../../generated/graphql'
import { getUserScopes } from '../../../utils/jwt'

const AUTH_SCOPES = {
  HR: 'HR/R',
  BRK: 'BRK/RS',
  BRKPLUS: 'BRK/RSN',
}

const DEFAULT_FROM = 0
const DEFAULT_LIMIT = 10

const ROLES = {
  EMPLOYEE: 'employee',
  EMPLOYEE_PLUS: 'employee_plus',
}

type DataSearchType = {
  endpoint: string[]
  type: string
  label: string
  labelSingular: string
  params?: {
    subtype: string
  }
  authScope: Array<{
    role: string
    scope: string
  }>
}

const DATA_SEARCH_CONFIG: DataSearchType[] = [
  {
    endpoint: ['atlas/search/openbareruimte'],
    type: 'straatnamen',
    label: 'Straatnamen',
    labelSingular: 'Straatnaam',
    params: {
      subtype: 'weg',
    },
    authScope: [],
  },
  {
    endpoint: ['atlas/search/adres'],
    type: 'adressen',
    labelSingular: 'Adres',
    label: 'Adressen',
    authScope: [],
  },
  {
    endpoint: ['atlas/search/openbareruimte'],
    type: 'openbare_ruimtes',
    label: 'Openbare ruimtes',
    labelSingular: 'Openbare ruimte',
    params: {
      subtype: 'not_weg',
    },
    authScope: [],
  },
  {
    endpoint: ['atlas/search/pand'],
    type: 'panden',
    label: 'Panden',
    labelSingular: 'Pand',
    authScope: [],
  },
  {
    endpoint: ['atlas/search/gebied'],
    type: 'gebieden',
    label: 'Gebieden',
    labelSingular: 'Gebied',
    authScope: [],
  },
  {
    endpoint: ['handelsregister/search/vestiging'],
    type: 'vestigingen',
    label: 'Vestigingen',
    labelSingular: 'Vestiging',
    authScope: [{ role: ROLES.EMPLOYEE, scope: AUTH_SCOPES.HR }],
  },
  {
    endpoint: ['handelsregister/search/maatschappelijkeactiviteit'],
    type: 'maatschappelijkeactiviteit',
    label: 'Maatschappelijke activiteiten',
    labelSingular: 'Maatschappelijke activiteit',
    authScope: [{ role: ROLES.EMPLOYEE, scope: AUTH_SCOPES.HR }],
  },
  {
    endpoint: ['atlas/search/kadastraalobject'],
    type: 'kadastrale_objecten',
    labelSingular: 'Kadastraal object',
    label: 'Kadastrale objecten',
    authScope: [],
  },
  {
    endpoint: ['atlas/search/kadastraalsubject'],
    type: 'kadastrale_subjecten',

    labelSingular: 'Kadastraal subject',
    label: 'Kadastrale subjecten',
    authScope: [
      { role: ROLES.EMPLOYEE, scope: AUTH_SCOPES.BRK },
      { role: ROLES.EMPLOYEE_PLUS, scope: AUTH_SCOPES.BRKPLUS },
    ],
  },
  {
    endpoint: ['meetbouten/search'],
    type: 'meetbouten',
    labelSingular: 'Meetbout',
    label: 'Meetbouten',
    authScope: [],
  },
  {
    endpoint: ['monumenten/search'],
    type: 'monumenten',
    labelSingular: 'Monument',
    label: 'Monumenten',
    authScope: [],
  },
]

const DATA_SEARCH_FILTER = { type: 'types', label: 'Types' }

export const normalizeData = ({ _links, _display, type, ...otherField }: any): DataResult => ({
  id: _links && _links.self ? _links.self.href.match(/([^\/]*)\/*$/)[1] : null,
  label: _display,
  type,
  ...otherField,
})

export const getEndpoints = (
  config: Array<object>,
  token: string,
  q: string,
  limit: Maybe<number> = DEFAULT_LIMIT,
  from: Maybe<number> = DEFAULT_FROM,
): Array<Array<string>> => {
  const pages = (limit && from ? Math.ceil((limit + from) / 100) : 0) + 1

  return config.map((api: any) =>
    Array.from(Array(pages).keys())
      .slice(pages > 1 ? 1 : 0)
      .map(number => {
        const query = new URLSearchParams({
          q,
          ...(number > 1
            ? {
                page: number,
              }
            : {}),
          ...(api.params ? { ...api.params } : {}),
        }).toString()
        return `${process.env.API_ROOT}${api.endpoint[0]}/?${query}`
      }),
  )
}

export const buildRequestPromises = (
  endpoints: Array<Array<string>>,
  token: string,
): Array<Promise<any>> => {
  return endpoints.map(urlArray =>
    Promise.all(
      urlArray.map(url =>
        fetch(
          url,
          token
            ? {
                headers: {
                  Authorization: token,
                },
              }
            : {},
        ).then((res: any) =>
          res.status !== 200
            ? {
                count: 0,
                results: [],
              }
            : res.json(),
        ),
      ),
    ),
  )
}

export const buildResults = (
  validResponses: object[],
  limit: number,
  from: number,
  scopes: string[],
): Array<DataSearchResultType> =>
  validResponses.map(
    (result: any, i): DataSearchResultType => {
      const { count } = result[0] // Since we expect count will not change on other pages, we just use it from the first page.
      let results = result.reduce(
        (acc: object[], { results }: any) => [...acc, ...(Array.isArray(results) ? results : [])],
        [],
      )

      const resultCount = count || 0
      // totalCount = totalCount + resultCount

      // Compare the scopes from the users token with the scopes as defined for this data type
      const userIsAuthorized =
        DATA_SEARCH_CONFIG[i].authScope && DATA_SEARCH_CONFIG[i].authScope.length > 0
          ? DATA_SEARCH_CONFIG[i].authScope.find(({ scope }) => scopes.includes(scope))
          : true

      // Return an error when the user isnt authorized to view this information, therefore the field `results` must be nullable in the schema
      results = userIsAuthorized
        ? (results &&
            results.slice(from, limit + from).map((result: any) => normalizeData(result))) ||
          []
        : new Error(`Not authorized to view ${DATA_SEARCH_CONFIG[i].label}`)

      return {
        count: resultCount,
        label: count === 1 ? DATA_SEARCH_CONFIG[i].labelSingular : DATA_SEARCH_CONFIG[i].label,
        type: DATA_SEARCH_CONFIG[i].type,
        results,
      }
    },
  )

const dataResolver = async (
  _: any,
  { q, input }: QueryDataSearchArgs,
  context: any,
): Promise<DataSearchResult> => {
  const { types } = input
  const { token } = await context()
  let { limit, from } = input
  limit = limit || DEFAULT_LIMIT
  from = from || DEFAULT_FROM

  const apiEndpoints = getEndpoints(DATA_SEARCH_CONFIG, token, q, limit, from)
  const promiseArray = buildRequestPromises(apiEndpoints, token)

  // Todo: error handling
  const responses = await Promise.all(
    promiseArray.map(p =>
      p.catch(e => {
        console.warn(e)
        return e
      }),
    ),
  )

  const validResponses = responses.filter(result => !(result instanceof Error))

  // Decode the token (if there is one) to get the scopes and do a soft validate on the expiration time
  const scopes = getUserScopes(token)

  let results = buildResults(validResponses, limit, from, scopes)

  const totalCount = results.reduce((acc: number, { count }: { count: number }) => acc + count, 0)

  const filters = [
    {
      type: DATA_SEARCH_FILTER.type,
      label: DATA_SEARCH_FILTER.label,
      options: results.map(
        (result: DataSearchResultType): FilterOptions => ({
          id: result.type || '',
          label: result.label || '',
          count: result.count,
        }),
      ),
    },
  ]

  // Todo: Add Dataloader to cache the previous results and prevent too much data being retrieved when just a single type is requested
  if (types) {
    results = results.filter(
      (result: DataSearchResultType) => result.type && types.includes(result.type),
    )
  }

  return {
    totalCount,
    filters,
    results,
  }
}

export default dataResolver
