import { FILTERS } from '../../graphql/resolvers/search/cms/constants'
import { FilterInput } from '../../generated/graphql'

// Constructs an array with the search conditions
function getSearchQuery(q: string) {
  const terms = q.toLowerCase().split(' ')
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
  return [
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

// Constructs the ES query to filter on theme or date
function getFilterQuery(types: Array<string> | null, filters: Array<FilterInput>) {
  const themeFilter = filters && filters.find(filter => filter.type === FILTERS['THEME'].type)
  const themeFilterValues: any =
    themeFilter && themeFilter.values
      ? themeFilter.values.map(value => ({ term: { field_theme_id: value.split(':').pop() } }))
      : []

  const dateFilter = filters && filters.find(filter => filter.type === FILTERS['DATE'].type)
  const dateFilterValues: any =
    dateFilter && dateFilter.values
      ? dateFilter.values.map((value: any) => {
          let filterValue = value.split(':').pop()

          // Only publications have field_publication_date and can be filtered directly
          if (types && types.includes('publication')) {
            // When not filtering on a specific year, the value must be smaller than the last possible year
            if (filterValue.startsWith('older')) {
              return {
                range: {
                  field_publication_year: {
                    lt: filterValue.replace('older-', ''),
                  },
                },
              }
            }
            // Filtering on a specific year returns only results from that year
            return { term: { field_publication_year: filterValue } }
          }

          // Other content than publications is filtered by checking if the unix timestamp of field_publication_date
          // is in range of the beginning and the end of the filtered value

          // When not filtering on a specific year, the value must be smaller than the last possible year
          if (filterValue.startsWith('older')) {
            return {
              range: {
                field_publication_date: {
                  lt: filterValue.replace('older-', ''),
                },
              },
            }
          }

          // Otherwise both the beginning and end of the filtered year must be calculated
          const gte = new Date(filterValue).getTime() / 1000 // Unix first day of the year
          const lte = new Date(filterValue, 12, 1).getTime() / 1000 // Unix last day of the year

          return {
            range: {
              field_publication_date: {
                gte,
                lte,
              },
            },
          }
        })
      : []

  return [
    {
      bool: {
        should: [...themeFilterValues, ...dateFilterValues],
      },
    },
  ]
}

export { getSearchQuery, getFilterQuery }
