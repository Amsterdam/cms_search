export interface DataSearchType {
  endpoint: string
  type: string
  label: string
  labelSingular: string
  searchParam: string
  queryFormatter?: RegExp
  queryMatcher?: RegExp
  params?: {
    subtype: string
  }
}

export interface DataIndexType {
  endpoint: string
  type: string
}

export enum DataType {
  Address = 'adressen',
  Streets = 'straatnamen',
  PublicSpace = 'openbareruimte',
  Buildings = 'panden',
  Regions = 'gebieden',
  Branches = 'vestigingen',
  SocialActivity = 'maatschappelijkeactiviteit',
  CadastralProperties = 'kadastrale_objecten',
  CadastralSubject = 'kadastrale_subjecten',
  MeasuringBolt = 'meetbouten',
  Monument = 'monumenten',
  ConstructionFiles = 'bouwdossiers',
}

// The environment variable DATA_SEARCH_ENDPOINTS gets created by Ansible Playbook while building the project
// using OpenStack. Therefore extra quotes are added that we need to strip out manually here
export const SEARCH_ENDPOINTS = process.env.DATA_SEARCH_ENDPOINTS
  ? JSON.parse(process.env.DATA_SEARCH_ENDPOINTS.replace(/'/gm, ''))
  : {}

export const INDEX_ENDPOINTS = process.env.DATA_INDEX_ENDPOINTS
  ? JSON.parse(process.env.DATA_INDEX_ENDPOINTS.replace(/'/gm, ''))
  : {}

export const DATA_SEARCH_ENDPOINTS: Array<DataSearchType> = [
  {
    endpoint: SEARCH_ENDPOINTS[DataType.PublicSpace],
    type: DataType.Streets,
    label: 'Straatnamen',
    labelSingular: 'Straatnaam',
    searchParam: 'q',
    params: {
      subtype: 'weg',
    },
  },
  {
    endpoint: SEARCH_ENDPOINTS[DataType.Address],
    type: DataType.Address,
    labelSingular: 'Adres',
    label: 'Adressen',
    searchParam: 'q',
  },
  {
    endpoint: SEARCH_ENDPOINTS[DataType.PublicSpace],
    type: DataType.PublicSpace,
    label: 'Openbare ruimtes',
    labelSingular: 'Openbare ruimte',
    searchParam: 'q',
    params: {
      subtype: 'not_weg',
    },
  },
  {
    endpoint: SEARCH_ENDPOINTS[DataType.Buildings],
    type: DataType.Buildings,
    label: 'Panden',
    labelSingular: 'Pand',
    searchParam: 'q',
  },
  {
    endpoint: SEARCH_ENDPOINTS[DataType.Regions],
    type: DataType.Regions,
    label: 'Gebieden',
    labelSingular: 'Gebied',
    searchParam: 'q',
  },
  {
    endpoint: SEARCH_ENDPOINTS[DataType.Branches],
    type: DataType.Branches,
    label: 'Vestigingen',
    labelSingular: 'Vestiging',
    searchParam: 'q',
  },
  {
    endpoint: SEARCH_ENDPOINTS[DataType.SocialActivity],
    type: DataType.SocialActivity,
    label: 'Maatschappelijke activiteiten',
    labelSingular: 'Maatschappelijke activiteit',
    searchParam: 'q',
  },
  {
    endpoint: SEARCH_ENDPOINTS[DataType.CadastralProperties],
    type: DataType.CadastralProperties,
    labelSingular: 'Kadastraal object',
    label: 'Kadastrale objecten',
    searchParam: 'q',
  },
  {
    endpoint: SEARCH_ENDPOINTS[DataType.CadastralSubject],
    type: DataType.CadastralSubject,
    labelSingular: 'Kadastraal subject',
    label: 'Kadastrale subjecten',
    searchParam: 'q',
  },
  {
    endpoint: SEARCH_ENDPOINTS[DataType.MeasuringBolt],
    type: DataType.MeasuringBolt,
    labelSingular: 'Meetbout',
    label: 'Meetbouten',
    searchParam: 'q',
  },
  {
    endpoint: SEARCH_ENDPOINTS[DataType.Monument],
    type: DataType.Monument,
    labelSingular: 'Monument',
    label: 'Monumenten',
    searchParam: 'q',
  },
  {
    endpoint: SEARCH_ENDPOINTS[DataType.ConstructionFiles],
    type: DataType.ConstructionFiles,
    labelSingular: 'Bouw- en omgevingsdossier',
    label: 'Bouw- en omgevingsdossiers',
    searchParam: 'dossier',
    queryMatcher: /^[A-Z]{2,3}\d/,
  },
  {
    endpoint: SEARCH_ENDPOINTS[DataType.ConstructionFiles],
    type: DataType.ConstructionFiles,
    labelSingular: 'Bouw- en omgevingsdossier',
    label: 'Bouw- en omgevingsdossiers',
    searchParam: 'olo_liaan_nummer',
    queryMatcher: /^OLO\d/,
    queryFormatter: /^OLO/,
  },
]

export const DATA_INDEX_ENDPOINTS: Array<DataIndexType> = [
  {
    endpoint: INDEX_ENDPOINTS[DataType.Branches],
    type: DataType.Branches,
  },
  {
    endpoint: INDEX_ENDPOINTS[DataType.MeasuringBolt],
    type: DataType.MeasuringBolt,
  },
  {
    endpoint: INDEX_ENDPOINTS[DataType.SocialActivity],
    type: DataType.SocialActivity,
  },
]

export const DATA_SEARCH_FILTER = { type: 'dataTypes', label: 'Soorten' }

export const DATA_SEARCH_LIMIT = 100
export const DATA_SEARCH_MAX_RESULTS = 1000

export const NORMAL_VBO_STATUSSES = [
  'Verblijfsobject in gebruik (niet ingemeten)',
  'Verblijfsobject in gebruik',
  'Verbouwing verblijfsobject',
]
