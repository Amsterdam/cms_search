import { CmsSearchInput } from '../../generated/graphql'
import { getSearchQuery, getThemeFilter, getDateFilter, getSubTypeFilter } from './utils'

export type ElasticSearchArgs = {
  q: string | null | undefined
  from?: number
  subType?: string
} & CmsSearchInput

export const getSubTypeValues = (type: string, field: string) => {
  return {
    query: {
      bool: {
        must: [
          {
            terms: {
              type: [type],
            },
          },
        ],
      },
    },
    size: 9999,
    aggs: {
      [`unique_${field}`]: {
        terms: { field },
      },
    },
  }
}

export default ({ q, limit, from, types = null, filters, sort, subType }: ElasticSearchArgs) => {
  let shouldQuery: Array<object> = []
  let dateFilter: Array<object> = []
  let subTypeFilter: Array<object> = []
  let sorting: Array<object | string> = ['_score'] // default sorting on score

  let themeFilter: Object | null = null

  if (q && q.length > 0) {
    shouldQuery = getSearchQuery(q)
  }

  if (filters && filters.length > 0) {
    dateFilter = getDateFilter(types, filters)
    themeFilter = getThemeFilter(filters)
    subTypeFilter = getSubTypeFilter(filters)
  }

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
    }
  }

  return {
    query: {
      bool: {
        must: [
          { term: { field_published: true } },
          {
            terms: {
              type: types,
            },
          },
        ],
        must_not: [],
        should: shouldQuery,
        filter: {
          bool: {
            must: [...dateFilter, ...subTypeFilter],
          },
        },
        minimum_should_match: shouldQuery.length > 0 ? 1 : 0, // At least one of the should rules must match
      },
    },

    from,
    size: limit,
    sort: [...sorting],
    aggs: {
      type: {
        filter: {
          bool: {
            // The themeFilter should affect the totalCount
            must: [...(themeFilter ? [themeFilter] : [])],
          },
        },
        aggs: {
          count: {
            terms: {
              field: 'type',
            },
          },
        },
      },
      ...(subType // Get the count for subType as well if a field is provided
        ? {
            subType: {
              filter: {
                bool: {
                  // No filters are set, but this is added to maintain consistency
                  must: [],
                },
              },
              aggs: {
                count: {
                  terms: {
                    field: subType,
                  },
                },
              },
            },
          }
        : {}),
      theme: {
        filter: {
          bool: {
            // No filters are set, but this is added to maintain consistency
            must: [],
          },
        },
        aggs: {
          count: {
            terms: {
              field: 'field_theme_id',
            },
          },
        },
      },
    },
    post_filter: {
      // The themeFilter should not change the count of the `field_theme_id`
      bool: {
        must: [...(themeFilter ? [themeFilter] : [])],
      },
    },
  }
}
