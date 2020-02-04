export type DataSearchType = {
  endpoint: string
  type: string
  label: string
  labelSingular: string
  params?: {
    subtype: string
  }
}

// The environment variable DATA_SEARCH_ENDPOINTS gets created by Ansible Playbook while building the project
// using OpenStack. Therefore extra quotes are added that we need to strip out manually here
export const SEARCH_ENDPOINTS = process.env.DATA_SEARCH_ENDPOINTS
  ? JSON.parse(process.env.DATA_SEARCH_ENDPOINTS.replace(/'/gm, ''))
  : {}

export const DATA_SEARCH_ENDPOINTS: Array<DataSearchType> = [
  {
    endpoint: SEARCH_ENDPOINTS['openbareruimte'],
    type: 'straatnamen',
    label: 'Straatnamen',

    labelSingular: 'Straatnaam',
    params: {
      subtype: 'weg',
    },
  },
  {
    endpoint: SEARCH_ENDPOINTS['adressen'],
    type: 'adressen',
    labelSingular: 'Adres',
    label: 'Adressen',
  },
  {
    endpoint: SEARCH_ENDPOINTS['openbareruimte'],
    type: 'openbareruimte',
    label: 'Openbare ruimtes',
    labelSingular: 'Openbare ruimte',
    params: {
      subtype: 'not_weg',
    },
  },
  {
    endpoint: SEARCH_ENDPOINTS['panden'],
    type: 'panden',
    label: 'Panden',
    labelSingular: 'Pand',
  },
  {
    endpoint: SEARCH_ENDPOINTS['gebieden'],
    type: 'gebieden',
    label: 'Gebieden',
    labelSingular: 'Gebied',
  },
  {
    endpoint: SEARCH_ENDPOINTS['vestigingen'],
    type: 'vestigingen',
    label: 'Vestigingen',
    labelSingular: 'Vestiging',
  },
  {
    endpoint: SEARCH_ENDPOINTS['maatschappelijkeactiviteit'],
    type: 'maatschappelijkeactiviteit',
    label: 'Maatschappelijke activiteiten',
    labelSingular: 'Maatschappelijke activiteit',
  },
  {
    endpoint: SEARCH_ENDPOINTS['kadastrale_objecten'],
    type: 'kadastrale_objecten',
    labelSingular: 'Kadastraal object',
    label: 'Kadastrale objecten',
  },
  {
    endpoint: SEARCH_ENDPOINTS['kadastrale_subjecten'],
    type: 'kadastrale_subjecten',

    labelSingular: 'Kadastraal subject',
    label: 'Kadastrale subjecten',
  },
  {
    endpoint: SEARCH_ENDPOINTS['meetbouten'],
    type: 'meetbouten',
    labelSingular: 'Meetbout',
    label: 'Meetbouten',
  },
  {
    endpoint: SEARCH_ENDPOINTS['monumenten'],
    type: 'monumenten',
    labelSingular: 'Monument',
    label: 'Monumenten',
  },
]

export const DATA_SEARCH_FILTER = { type: 'dataTypes', label: 'Types' }

export const DATA_SEARCH_LIMIT = 100
export const DATA_SEARCH_MAX_RESULTS = 1000

export const NORMAL_VBO_STATUSSES = [
  'Verblijfsobject in gebruik (niet ingemeten)',
  'Verblijfsobject in gebruik',
  'Verbouwing verblijfsobject',
]
