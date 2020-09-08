// Just to enable IDE hints
const gql = (input: any) => input

const schema = gql`
  union Results =
      DatasetResult
    | CMSResult
    | CombinedDataResult
    | MapLayer
    | MapCollection
    | CombinedMapResult

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

  input CMSSortInput {
    field: String!
    order: String!
  }

  input CMSSearchInput {
    limit: Int
    page: Int
    types: [String!]
    filters: [FilterInput!]
    sort: CMSSortInput
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

  type CMSSearchResult implements SearchResult {
    totalCount: Int!
    results: [CMSResult!]
    filters: [Filter!]
    pageInfo: PageInfo!
  }

  type MapLayerSearchResult implements SearchResult {
    totalCount: Int!
    results: [MapLayer!]!
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

  type CMSLink {
    uri: String!
  }

  type CMSResult {
    id: ID
    type: String!
    label: String
    slug: String
    teaserImage: String
    coverImage: String
    specialType: String
    file: String
    date: String
    body: String
    intro: String
    teaser: String
    dateLocale: String
    link: CMSLink
  }

  # MapResult is a combination of MapLayer and MapCollection
  type MapResult {
    id: ID!
    title: String!
    mapLayers: [MapLayer!]
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
    mapLayers: [MapLayer!]!
    meta: Meta!
    href: String!
  }

  type MapLayer {
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
    legendItems: [MapLayerLegendItem!]
    meta: Meta!
    href: String!
  }

  union MapLayerLegendItem = MapLayer | LegendItem

  type Theme {
    id: ID!
    title: String!
  }

  type Meta {
    description: String
    themes: [Theme!]!
    datasetIds: [Int!]
    thumbnail: String
    date: String
  }

  type DetailParams {
    item: String
    datasets: String
  }

  type LegendItem {
    title: String!
    iconUrl: String
    imageRule: String
    notSelectable: Boolean!
  }

  type Query {
    articleSearch(q: String, input: CMSSearchInput): CMSSearchResult
    dataSearch(q: String, input: DataSearchInput): DataSearchResult
    datasetSearch(q: String, input: DatasetSearchInput): DatasetSearchResult
    publicationSearch(q: String, input: CMSSearchInput): CMSSearchResult
    specialSearch(q: String, input: CMSSearchInput): CMSSearchResult
    collectionSearch(q: String, input: CMSSearchInput): CMSSearchResult
    mapCollectionSearch(q: String, input: MapSearchInput): MapCollectionSearchResult!
    mapLayerSearch(q: String, input: MapSearchInput): MapLayerSearchResult!
    mapSearch(q: String, input: MapSearchInput): MapSearchResult!
    filters: [Filter]
  }
`

export default schema
