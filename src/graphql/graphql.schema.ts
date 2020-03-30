// Just to enable IDE hints
const gql = (input: any) => input

const schema = gql`
  union Results =
      DatasetSearchResultType
    | CMSSearchResultType
    | DataSearchResultType
    | MapLayer
    | MapCollection

  interface SearchResult {
    totalCount: Int!
    results: [Results!]
    filters: [Filter!]
    pageInfo: PageInfo!
  }

  interface SearchResultType {
    count: Int!
    type: String
    label: String
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
  }

  input FilterInput {
    type: String!
    values: [String!]!
  }

  type DataSearchResult implements SearchResult {
    totalCount: Int!
    results: [DataSearchResultType!]!
    filters: [Filter!]
    pageInfo: PageInfo!
  }

  type DatasetSearchResult implements SearchResult {
    totalCount: Int!
    results: [DatasetSearchResultType!]
    filters: [Filter!]
    pageInfo: PageInfo!
  }

  type CMSSearchResult implements SearchResult {
    totalCount: Int!
    results: [CMSSearchResultType!]
    filters: [Filter!]
    pageInfo: PageInfo!
  }

  type MapLayerSearchResult {
    totalCount: Int!
    results: [MapLayer!]!
    pageInfo: PageInfo!
  }

  type MapCollectionSearchResult {
    totalCount: Int!
    results: [MapCollection!]!
    pageInfo: PageInfo!
  }

  type Filter {
    type: String!
    label: String!
    options: [FilterOptions!]
    filterType: String
  }

  type FilterOptions {
    id: String!
    label: String!
    count: Int
  }

  type CMSLink {
    uri: String!
  }

  type CMSSearchResultType {
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

  type DataSearchResultType implements SearchResultType {
    count: Int!
    type: String
    label: String
    results: [DataResult!]
  }

  type DataResult {
    id: ID
    type: String!
    label: String
    subtype: String
    endpoint: String
    datasetdataset: String
  }

  type DatasetSearchResultType {
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
  }

  type MapLayer {
    id: ID!
    title: String!
    type: String!
    noDetail: Boolean!
    minZoom: Int!
    maxZoom: Int!
    layers: [String!]
    url: String
    params: String
    detailUrl: String
    detailItem: String
    detailIsShape: Boolean
    iconUrl: String
    imageRule: String
    notSelectable: Boolean
    external: Boolean
    bounds: [[Float!]!]
    authScope: String
    category: String
    legendItems: [LegendItem!]
    themes: [Theme!]!
    meta: Meta!
  }

  type Theme {
    id: ID!
    title: String!
  }

  type Meta {
    description: String
    themes: [String!]!
    datasetIds: [Int]
    thumbnail: String
    date: String
  }

  enum LegendItemType {
    MAP_LAYER
    STANDALONE
  }

  # TODO: Do not copy MapLayer fields here, make the map layer a separate field in the LegendItem.
  type LegendItem {
    id: ID
    title: String
    type: String
    noDetail: Boolean
    layers: [String!]
    url: String
    detailUrl: String
    detailItem: String
    detailIsShape: Boolean
    iconUrl: String
    imageRule: String
    minZoom: Int
    maxZoom: Int
    notSelectable: Boolean!
    external: Boolean
    bounds: [[Float!]!]
    authScope: String
    category: String
    legendType: LegendItemType!
    params: String
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
    filters: [Filter]
  }
`

export default schema
