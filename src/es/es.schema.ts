import { CmsSearchInput } from '../generated/graphql'

export type ElasticSearchArgs = {
  q: string
} & CmsSearchInput

export default ({ q, limit, from, types }: ElasticSearchArgs) => {
  let terms = q.split(' ')
  const nrTerms = terms.length

  /** The way the results are indexed by the Drupal ElasticSearch plugin requires us to construct
   * the ES shcema like this, where the query string is transformed to an array and all values
   * from this array are searched as terms except for the last one - this value is
   * prefixed to also find part of words
   **/
  const should = ['', ...terms].reduce((acc, cur, index): any => {
    const queryType = nrTerms === index ? 'prefix' : 'term'

    return [
      ...acc,
      {
        [queryType]: {
          title: {
            value: cur,
            boost: 4.0,
          },
        },
      },
      {
        term: {
          field_intro: {
            value: cur,
            boost: 2.0,
          },
        },
      },
      {
        term: {
          processed: {
            value: cur,
            boost: 1.0,
          },
        },
      },
    ]
  })

  return {
    query: {
      bool: {
        must: [{ term: { field_published: true } }],
        must_not: [],
        should: should,
        filter: {
          terms: { type: types },
        },
        minimum_should_match: nrTerms, // All the terms from the query string must be matched
      },
    },
    from,
    size: limit,
    sort: [
      { field_publication_date: { order: 'desc' } },
      { field_publication_year: { order: 'desc' } },
      { field_publication_month: { order: 'desc' } },
      '_score',
    ],
    aggs: {
      count_by_type: {
        terms: {
          field: 'type',
        },
      },
      count_by_theme: {
        terms: {
          field: 'field_theme_name',
        },
      },
    },
  }
}
