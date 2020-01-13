import fetch from 'node-fetch'
import AbortController from 'abort-controller'
import {
  QueryDataSearchArgs,
  DataSearchResultType,
  DataSearchResult,
  FilterOptions,
} from '../../../../generated/graphql'
import { getUserScopes } from '../../../utils/jwt'
import { AUTH_SCOPES, DEFAULT_FROM, DEFAULT_LIMIT, ROLES } from '../../../../config'
import { normalizeDataResults } from './normalize'
import DataError from '../../../utils/DataError'

type DataSearchType = {
  endpoint: string
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

const DATA_SEARCH_API_MAX_RESULTS = 100

const DATA_SEARCH_CONFIG: DataSearchType[] = [
  {
    endpoint: 'atlas/search/openbareruimte',
    type: 'straatnamen',
    label: 'Straatnamen',
    labelSingular: 'Straatnaam',
    params: {
      subtype: 'weg',
    },
    authScope: [],
  },
  {
    endpoint: 'atlas/search/adres',
    type: 'adressen',
    labelSingular: 'Adres',
    label: 'Adressen',
    authScope: [],
  },
  {
    endpoint: 'atlas/search/openbareruimte',
    type: 'openbareruimte',
    label: 'Openbare ruimtes',
    labelSingular: 'Openbare ruimte',
    params: {
      subtype: 'not_weg',
    },
    authScope: [],
  },
  {
    endpoint: 'atlas/search/pand',
    type: 'panden',
    label: 'Panden',
    labelSingular: 'Pand',
    authScope: [],
  },
  {
    endpoint: 'atlas/search/gebied',
    type: 'gebieden',
    label: 'Gebieden',
    labelSingular: 'Gebied',
    authScope: [],
  },
  {
    endpoint: 'handelsregister/search/vestiging',
    type: 'vestigingen',
    label: 'Vestigingen',
    labelSingular: 'Vestiging',
    authScope: [{ role: ROLES.EMPLOYEE, scope: AUTH_SCOPES.HR }],
  },
  {
    endpoint: 'handelsregister/search/maatschappelijkeactiviteit',
    type: 'maatschappelijkeactiviteit',
    label: 'Maatschappelijke activiteiten',
    labelSingular: 'Maatschappelijke activiteit',
    authScope: [{ role: ROLES.EMPLOYEE, scope: AUTH_SCOPES.HR }],
  },
  {
    endpoint: 'atlas/search/kadastraalobject',
    type: 'kadastrale_objecten',
    labelSingular: 'Kadastraal object',
    label: 'Kadastrale objecten',
    authScope: [],
  },
  {
    endpoint: 'atlas/search/kadastraalsubject',
    type: 'kadastrale_subjecten',

    labelSingular: 'Kadastraal subject',
    label: 'Kadastrale subjecten',
    authScope: [
      { role: ROLES.EMPLOYEE, scope: AUTH_SCOPES.BRK },
      { role: ROLES.EMPLOYEE_PLUS, scope: AUTH_SCOPES.BRKPLUS },
    ],
  },
  {
    endpoint: 'meetbouten/search',
    type: 'meetbouten',
    labelSingular: 'Meetbout',
    label: 'Meetbouten',
    authScope: [],
  },
  {
    endpoint: 'monumenten/search',
    type: 'monumenten',
    labelSingular: 'Monument',
    label: 'Monumenten',
    authScope: [],
  },
]

const DATA_SEARCH_FILTER = { type: 'types', label: 'Types' }

/**
 * Builds an array of array's that might contain more than one endpoint (string).
 * First we check if we need to fetch from one or more pages, by checking if the given limit + from
 * is greater than the max results the API's gives us. If this is the case, add the endpoints with a
 * ?page=n parameter to the array, so we can aggregate the results later, slice them and return them
 * to the user so that we have pagination functionality.
 */
export const getEndpoints = (
  config: Array<object>,
  token: string,
  q: string,
  limit: number,
  from: number,
): Array<Array<string>> => {
  const pages = (limit && from ? Math.ceil((limit + from) / DATA_SEARCH_API_MAX_RESULTS) : 0) + 1

  return config.map((api: any) =>
    Array.from(Array(pages).keys())
      .slice(pages > 1 ? 1 : 0)
      .map(number => {
        const query = new URLSearchParams({
          q,
          page: number || 1,
          ...(api.params ? { ...api.params } : {}),
        }).toString()
        return `${process.env.API_ROOT}${api.endpoint}/?${query}`
      }),
  )
}

export const buildRequestPromises = (
  endpoints: Array<Array<string>>,
  token: string,
): Array<Promise<any>> =>
  endpoints.map(urlArray =>
    Promise.all(
      urlArray.map(url => {
        const controller = new AbortController()

        // Abort the fetch request when it takes too long
        const timeout = setTimeout(() => {
          console.warn('ABORTED', url) // For logging in Sentry
          controller.abort()

          // TODO: replace with a proper error message
          return Promise.resolve({
            count: 0,
            results: [],
          })
        }, 500)

        return fetch(url, {
          signal: controller.signal,
          ...(token
            ? {
                headers: {
                  Authorization: token,
                },
              }
            : {}),
        }).then((res: any) => {
          clearTimeout(timeout) // The data is on its way, so clear the timeout

          // Todo: error handling when endpoint returns something other than OK
          return res.status !== 200
            ? {
                count: 0,
                results: [],
              }
            : res.json()
        })
      }),
    ),
  )

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
        (acc: object[], { results }: { results: undefined | object[] }) => [
          ...acc,
          ...(Array.isArray(results) ? results : []),
        ],
        [],
      )

      const resultCount = count || 0
      // totalCount = totalCount + resultCount

      const type = DATA_SEARCH_CONFIG[i].type
      const label = count === 1 ? DATA_SEARCH_CONFIG[i].labelSingular : DATA_SEARCH_CONFIG[i].label

      // Compare the scopes from the users token with the scopes as defined for this data type
      const userIsAuthorized =
        DATA_SEARCH_CONFIG[i].authScope && DATA_SEARCH_CONFIG[i].authScope.length > 0
          ? DATA_SEARCH_CONFIG[i].authScope.find(({ scope }) => scopes.includes(scope))
          : true

      // Return an error when the user isnt authorized to view this information, therefore the field `results` must be nullable in the schema
      results = userIsAuthorized
        ? results.slice(from, limit + from).map((result: object) => normalizeDataResults(result))
        : new DataError({
            message: `Not authorized to view ${label}`,
            code: 'UNAUTHORIZED',
            type,
            label,
          })

      return {
        count: resultCount,
        label,
        type,
        results,
      }
    },
  )

const index = async (
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

export default index
