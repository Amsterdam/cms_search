import { FILTERS } from '../../graphql/search/cms/config'
import { FilterInput } from '../../generated/graphql'
import { DRUPAL_THEME_FILTER_IDS } from '../../generated/drupal'

// Constructs an array with the search conditions
function getSearchQuery(q: string) {
  const terms = q.toLowerCase().split(' ')
  const nrTerms = terms.length

  /** The way the results are indexed by the Drupal ElasticSearch plugin requires us to construct
   * the ES schema like this, where the query string is transformed to an array and all values
   * from this array are searched. The value for "minimum_should_match" is set to 1, so at least
   * one of the shoudl rules must match:
   *
   * 1) In all scenarios: the complete search term is used in the title
   * 2) With one search term: each search term is used in the title OR in the intro
   * 3) With multiple search terms: all search terms are used in the title OR at least one search
   *    term is used in the title and at least one of the other search terms are used in the intro
   **/
  return [
    {
      bool: {
        // The entire term must be used in the title standalone
        must: [
          {
            match: {
              title: {
                query: q, // match the entire search term
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

// Constructs the ES query to filter on theme
function getThemeFilter(filters: Array<FilterInput>) {
  const themeFilter = filters.find(filter => filter.type === FILTERS['THEME'].type)

  if (!themeFilter) {
    return null
  }

  const themeFilterValues: Array<number | null> = themeFilter.values.map(value => {
    const filterKey = value.split(':').pop()
    const [, id] = [...DRUPAL_THEME_FILTER_IDS].find(([key]) => key === filterKey) || []

    return id || null
  })

  if (!themeFilterValues.some(filterValue => filterValue === null)) {
    return {
      terms: { field_theme_id: themeFilterValues },
    }
  }

  return null
}

// Constructs the ES query to filter on date
function getDateFilter(types: Array<string> | null, filters: Array<FilterInput>) {
  const dateFilter = filters.find(filter => filter.type === FILTERS['DATE'].type)

  if (dateFilter && dateFilter.values) {
    return dateFilter.values.map((value: any) => {
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
      const lte = new Date(filterValue, 12, 1).getTime() / 1000 - 1 // Unix last day of the year at 23:59

      return {
        range: {
          field_publication_date: {
            gte,
            lte,
          },
        },
      }
    })
  }

  return []
}

export { getSearchQuery, getThemeFilter, getDateFilter }
