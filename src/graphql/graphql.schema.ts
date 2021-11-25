// Just to enable IDE hints
const gql = (input: any) => input

const schema = gql`
  union Results = DatasetResult | CombinedDataResult | MapGroup | MapCollection | CombinedMapResult

  interface SearchResult {
    totalCount: Int!
    # TODO: See if results can be made required.
    results: [Results!]
    filters: [Filter!]
    pageInfo: PageInfo!
  }

  interface CombinedResult {
    count: Int!
    type: String!
    label: String!
  }

  input DataSearchInput {
    limit: Int
    page: Int
    filters: [FilterInput!]
  }

  input DatasetSearchInput {
    limit: Int
    page: Int
    filters: [FilterInput!]
  }

  input MapSearchInput {
    limit: Int
    page: Int
    filters: [FilterInput!]
  }

  input FilterInput {
    type: String!
    values: [String!]!
  }

  type DataSearchResult implements SearchResult {
    totalCount: Int!
    results: [CombinedDataResult!]!
    filters: [Filter!]
    pageInfo: PageInfo!
  }

  type DatasetSearchResult implements SearchResult {
    totalCount: Int!
    results: [DatasetResult!]
    filters: [Filter!]
    pageInfo: PageInfo!
  }

  type MapLayerSearchResult implements SearchResult {
    totalCount: Int!
    results: [MapGroup!]!
    filters: [Filter!]
    pageInfo: PageInfo!
  }

  type MapCollectionSearchResult implements SearchResult {
    totalCount: Int!
    results: [MapCollection!]!
    filters: [Filter!]
    pageInfo: PageInfo!
  }

  type MapSearchResult implements SearchResult {
    totalCount: Int!
    results: [CombinedMapResult!]!
    filters: [Filter!]
    pageInfo: PageInfo!
  }

  type Filter {
    type: String!
    label: String!
    options: [FilterOption!]!
    filterType: String!
  }

  type FilterOption {
    id: String!
    label: String!
    count: Int
  }

  # MapResult is a combination of MapGroups and MapCollection
  type MapResult {
    id: ID!
    title: String!
    mapLayers: [MapGroup!]
    meta: Meta!
    href: String!
    type: String
    noDetail: Boolean
    minZoom: Int
    layers: [String!]
    url: String
    params: String
    detailUrl: String
    detailParams: DetailParams
    detailIsShape: Boolean
    iconUrl: String
    imageRule: String
    notSelectable: Boolean
    external: Boolean
    bounds: [[Float!]!]
    authScope: String
    category: String
    legendItems: [LegendItem!]
  }

  type CombinedDataResult implements CombinedResult {
    count: Int!
    type: String!
    label: String!
    results: [DataResult!]
    reason: String
    status: String
  }

  type CombinedMapResult implements CombinedResult {
    count: Int!
    type: String!
    label: String!
    results: [MapResult!]!
  }

  type DataResult {
    id: ID
    type: String!
    label: String
    subtype: String
    endpoint: String
    datasetdataset: String
  }

  type DatasetResult {
    header: String!
    description: String!
    teaser: String!
    modified: String!
    tags: [String!]!
    id: String!
    formats: [DatasetFormats!]!
    distributionTypes: [String]
  }

  type DatasetFormats {
    name: String!
    count: Int!
  }

  type PageInfo {
    hasNextPage: Boolean!
    totalPages: Int!
    hasLimitedResults: Boolean
  }

  type MapCollection {
    id: ID!
    title: String!
    mapLayers: [MapGroup!]!
    meta: Meta!
    href: String!
  }

  type MapGroup {
    id: ID!
    title: String!
    type: String!
    noDetail: Boolean!
    minZoom: Int!
    layers: [String!]
    url: String
    params: String
    detailUrl: String
    detailParams: DetailParams
    detailIsShape: Boolean
    iconUrl: String
    imageRule: String
    notSelectable: Boolean!
    external: Boolean
    bounds: [[Float!]!]
    authScope: String
    category: String
    legendItems: [MapGroupLegendItem!]
    meta: Meta!
    href: String!
    legendIconURI: String
  }

  union MapGroupLegendItem = MapGroup | LegendItem

  type Theme {
    id: ID!
    title: String!
  }

  type Meta {
    themes: [Theme!]!
  }

  type DetailParams {
    item: String
    datasets: String
  }

  type LegendItem {
    id: ID!
    isVisible: Boolean
    title: String!
    iconUrl: String
    imageRule: String
    url: String
    notSelectable: Boolean!
    legendIconURI: String
  }

  type Query {
    dataSearch(q: String, input: DataSearchInput): DataSearchResult
    datasetSearch(q: String, input: DatasetSearchInput): DatasetSearchResult
    mapCollectionSearch(q: String, input: MapSearchInput): MapCollectionSearchResult!
    mapLayerSearch(q: String, input: MapSearchInput): MapLayerSearchResult!
    mapSearch(q: String, input: MapSearchInput): MapSearchResult!
    filters: [Filter]
  }
`

export default schema
