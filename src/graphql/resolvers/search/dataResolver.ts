import fetch from 'node-fetch'
import {
  QueryDataSearchArgs,
  DataSearchResultType,
  DataSearchResult,
  FilterOptions
} from '../../../generated/graphql'
import { getUserScopes } from '../utils/jwt'

const AUTH_SCOPES = {
  HR: 'HR/R',
  BRK: 'BRK/RS',
  BRKPLUS: 'BRK/RSN',
}

const ROLES = {
  EMPLOYEE: 'employee',
  EMPLOYEE_PLUS: 'employee_plus',
}

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
    type: 'openbare_ruimtes',
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

const normalizeData = ({ _links, _display, type, ...otherField }: any): DataSearchResult => ({
  id: _links && _links.self ? _links.self.href.match(/([^\/]*)\/*$/)[1] : null,
  label: _display,
  type,
  ...otherField,
})

const dataResolver = async (
  _: any,
  { q, input }: QueryDataSearchArgs,
  context: any,
): Promise<DataSearchResult> => {
  const { limit, types } = input
  const { token } = await context()
  let filteredDataSearchConfig = DATA_SEARCH_CONFIG

  const promiseArray = filteredDataSearchConfig.map((api: any) => {
    const query = new URLSearchParams({
      q,
      ...(api.params ? { ...api.params } : {}),
    }).toString()
    const url = `${process.env.API_ROOT}${api.endpoint}/?${query}`
    return fetch(url, {
      headers: {
        Authorization: token || '',
      },
    }).then((res: any) => {
      if (res.status !== 200) {
        return {
          count: 0,
          results: [],
        }
      }

      return res.json()
    })
  })

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

  let totalCount = 0
  let results = validResponses.map(
    ({ results, count }: any, i): DataSearchResultType => {
      const resultCount = count ? count : 0
      totalCount = totalCount + resultCount

      // Compare the scopes from the users token with the scopes as defined for this data type
      const userIsAuthorized =
        filteredDataSearchConfig[i].authScope && filteredDataSearchConfig[i].authScope.length > 0
          ? filteredDataSearchConfig[i].authScope.find(({ scope }) => scopes.includes(scope))
          : true

      // Return an error when the user isnt authorized to view this information, therefore the field `results` must be nullable in the schema
      results = userIsAuthorized
        ? (results && results.slice(0, limit).map((result: any) => normalizeData(result))) || []
        : new Error(`Not authorized to view ${filteredDataSearchConfig[i].label}`)

      return {
        count: resultCount,
        label:
          count === 1
            ? filteredDataSearchConfig[i].labelSingular
            : filteredDataSearchConfig[i].label,
        type: filteredDataSearchConfig[i].type,
        results,
      }
    },
  )

  const filters = [
    {
      type: DATA_SEARCH_FILTER.type,
      label: DATA_SEARCH_FILTER.label,
      options: results.map((result: DataSearchResultType): FilterOptions => ({
        id: result.type || '',
        label: result.label || '',
        count: result.count,
      })),
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
