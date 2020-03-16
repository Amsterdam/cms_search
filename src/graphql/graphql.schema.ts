// Just to enable IDE hints
const gql = (input: any) => input

const schema = gql`
  union Results = DatasetSearchResultType | CMSSearchResultType | DataSearchResultType

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

  type MetaInformation {
    description: String
    themes: [Float]
    datasetIds: [Float]
    thumbnail: String
    date: String
  }

  interface MapLayer {
    id: String
    title: String
    layers: [String]
    url: String
    params: String
    external: Boolean
    imageRule: String
    iconUrl: String
    type: String
    detailUrl: String
    detailItem: String
    detailIsShape: Boolean
  }

  type MapLayerResult {
    id: String!
    title: String!
    layers: [String!]
    url: String!
    params: String!
    external: Boolean
    legendItems: [LegendItemMapLayer]
    imageRule: String
    iconUrl: String
    type: String
    noDetail: Boolean
    detailUrl: String
    detailItem: String
    detailIsShape: Boolean
    authScope: String
    meta: MetaInformation
  }

  type MapCollectionLayer implements MapLayer {
    id: String!
    title: String
    layers: [String]
    url: String
    params: String
    external: Boolean
    legendItems: [LegendItemMapLayer]
    imageRule: String
    iconUrl: String
    type: String
    noDetail: Boolean
    detailUrl: String
    detailItem: String
    detailIsShape: Boolean
    minZoom: Float
    maxZoom: Float
    authScope: String
    meta: MetaInformation
  }

  type LegendItemMapLayer implements MapLayer {
    id: String
    title: String
    layers: [String]
    url: String
    params: String
    external: Boolean
    imageRule: String
    iconUrl: String
    type: String
    noDetail: Boolean
    detailUrl: String
    detailItem: String
    detailIsShape: Boolean
    notSelectable: Boolean
  }

  type MapCollection {
    id: String!
    title: String!
    mapLayers: [MapCollectionLayer!]!
    meta: MetaInformation!
  }

  type MapCollectionSearchResult {
    results: [MapCollection]
  }

  type MapLayerSearchResult {
    results: [MapLayerResult]
  }

  type Query {
    articleSearch(q: String, input: CMSSearchInput): CMSSearchResult
    dataSearch(q: String, input: DataSearchInput): DataSearchResult
    datasetSearch(q: String, input: DatasetSearchInput): DatasetSearchResult
    publicationSearch(q: String, input: CMSSearchInput): CMSSearchResult
    specialSearch(q: String, input: CMSSearchInput): CMSSearchResult
    collectionSearch(q: String, input: CMSSearchInput): CMSSearchResult
    mapCollectionSearch: MapCollectionSearchResult
    mapLayerSearch: MapLayerSearchResult
    filters: [Filter]
  }
`

export default schema
