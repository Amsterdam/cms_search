import { CmsSearchInput } from '../../generated/graphql'

export type ElasticSearchArgs = {
  q: string
} & CmsSearchInput

export default ({ q, limit, from, types, filters: themeFilters, sort }: ElasticSearchArgs) => {
  let should: Array<object> = []
  let sorting: Array<object> = []

  if (q && q.length > 0) {
    const searchQuery = q.toLowerCase()
    const terms = searchQuery.split(' ')
    const nrTerms = terms.length

    /** The way the results are indexed by the Drupal ElasticSearch plugin requires us to construct
     * the ES schema like this, where the query string is transformed to an array and all values
     * from this array are searched. The value for "minimum_should_match" is set to 1, so at least
     * one of the shoudl rules must match:
     *
     * 1) With one search term: the search term is used in the title OR in the intro
     * 2) With multiple search terms: all search terms are used in the title OR at least one search
     *    term is used in the title and at least one of the other search terms are used in the intro
     **/
    should = [
      {
        bool: {
          // The entire term must be used in the title standalone
          must: [
            {
              match: {
                title: {
                  query: searchQuery,
                  boost: 4.0,
                },
              },
            },
          ],
        },
      },
      {
        bool: {
          // The term must be used in the title standalone, as prefix or as suffix
          must: terms.map((term: string) => ({
            wildcard: {
              title: {
                value: `*${term}*`,
                boost: 2.0,
              },
            },
          })),
        },
      },
      ...terms.map((term: string) => {
        // If there's only one search term, this term must be used inside the intro
        if (nrTerms === 1) {
          return {
            bool: {
              should: [
                {
                  term: {
                    field_intro: {
                      value: terms[0],
                      boost: 1.0,
                    },
                  },
                },
              ],
            },
          }
        }

        // When there are multiple search terms at least one must match in the title, and at least one
        // of the other search terms must match in the intro
        return {
          bool: {
            minimum_should_match: nrTerms - 1,
            must: [
              {
                wildcard: {
                  title: {
                    value: `*${term}*`,
                    boost: 2.0,
                  },
                },
              },
            ],
            should: terms
              .filter(shouldTerm => shouldTerm !== term)
              .map((shouldTerm: string) => {
                return {
                  term: {
                    field_intro: {
                      value: shouldTerm,
                      boost: 1.0,
                    },
                  },
                }
              }),
          },
        }
      }),
    ]
  }

  const filters =
    themeFilters && themeFilters.map(themeFilter => ({ term: { field_theme_id: themeFilter } }))

  if (sort) {
    const { order } = sort
    switch (sort.field) {
      case 'title':
        sorting = [{ title_string: order }]
        break

      case 'date':
        sorting = [
          { field_publication_date: { order } },
          { field_publication_year: { order } },
          { field_publication_month: { order } },
        ]
        break

      default:
        sorting = []
    }
  }

  return {
    query: {
      bool: {
        must: [
          { term: { field_published: true } },
          ...(filters
            ? [
                {
                  bool: {
                    should: filters,
                  },
                },
              ]
            : []),
        ],
        must_not: [],
        should,
        filter: {
          terms: {
            type: types,
          },
        },
        minimum_should_match: should.length > 0 ? 1 : 0, // At least one of the should rules must match
      },
    },
    from,
    size: limit,
    sort: [...sorting, '_score'],
    aggs: {
      count_by_type: {
        terms: {
          field: 'type',
        },
      },
      count_by_theme: {
        terms: {
          field: 'field_theme_id',
        },
      },
    },
  }
}
