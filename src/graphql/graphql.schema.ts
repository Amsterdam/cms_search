// Just to enable IDE hints
const gql = (input: any) => input

const schema = gql`
  interface SearchResult {
    totalCount: Int!
    results: [SearchResultType!]!
  }

  interface SearchResultType {
    count: Int!
    type: String
    label: String
  }

  interface Result {
    id: ID
    type: String!
    label: String
  }

  input SearchInput {
    limit: Int
    from: Int
    types: [String!]
  }

  type DataSearchResult implements SearchResult {
    totalCount: Int!
    results: [DataSearchResultType!]!
  }

  type CMSSearchResult implements SearchResult {
    totalCount: Int!
    results: [CMSSearchResultType!]!
  }

  type CMSLink {
    uri: String!
  }

  type CMSResult implements Result {
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
    dateLocale: String
    link: CMSLink
  }

  type DataSearchResultType implements SearchResultType {
    count: Int!
    type: String
    label: String
    results: [DataResult!]
  }

  type DataResult implements Result {
    id: ID
    type: String!
    label: String
    subtype: String
    dataset: String
  }

  type CMSSearchResultType implements SearchResultType {
    count: Int!
    type: String
    label: String
    results: [CMSResult!]
  }

  type Query {
    dataSearch(q: String!, input: SearchInput!): DataSearchResult
    cmsSearch(q: String!, input: SearchInput!): CMSSearchResult
  }
`

export default schema
