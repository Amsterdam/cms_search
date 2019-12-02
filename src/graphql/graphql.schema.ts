// Just to enable IDE hints
const gql = (input: any) => input

const schema = gql`
  union Results = DatasetSearchResultType | CMSSearchResultType | DataSearchResultType

  interface SearchResult {
    totalCount: Int!
    results: [Results!]!
  }

  interface SearchResultType {
    count: Int!
    type: String
    label: String
  }

  input DataSearchInput {
    limit: Int
    from: Int
    types: [String!]
  }

  input CMSSearchInput {
    limit: Int
    from: Int
    types: [String!]
  }

  input DatasetSearchInput {
    from: Int
    limit: Int
    filters: [DatasetSearchFilter!]
  }

  input DatasetSearchFilter {
    type: String!
    values: [String!]!
  }

  type DataSearchResult implements SearchResult {
    totalCount: Int!
    results: [DataSearchResultType!]!
  }

  type DatasetSearchResult implements SearchResult {
    totalCount: Int!
    results: [DatasetSearchResultType!]!
    filters: [DatasetFilter!]
  }

  type CMSSearchResult implements SearchResult {
    totalCount: Int!
    results: [CMSSearchResultType!]!
    themeCount: [CMSThemeCount]
  }

  type DatasetFilter {
    type: String!
    label: String!
    options: [DatasetFilterOptions!]!
  }

  type DatasetFilterOptions {
    id: String!
    label: String!
    count: Int!
  }

  type CMSThemeCount {
    key: String
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
    dataset: String
  }

  type CMSSearchResultType implements SearchResultType {
    count: Int!
    totalCount: Int
    type: String
    label: String
    results: [CMSResult!]
  }

  type DatasetSearchResultType {
    header: String!
    description: String!
    modified: String!
    tags: [String!]!
    id: String!
    formats: [DatasetFormats!]!
  }

  type DatasetFormats {
    name: String!
    count: Int!
  }

  type Query {
    dataSearch(q: String!, input: DataSearchInput!): DataSearchResult
    datasetSearch(q: String!, input: DatasetSearchInput!): DatasetSearchResult
    cmsSearch(q: String!, input: CMSSearchInput!): CMSSearchResult
  }
`

export default schema
