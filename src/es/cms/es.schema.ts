import { CmsSearchInput } from '../../generated/graphql'
import { getSearchQuery, getThemeFilter, getDateFilter } from './utils'

export type ElasticSearchArgs = {
  q: string | null | undefined
  from?: number
} & CmsSearchInput

export default ({ q, limit, from, types = null, filters, sort }: ElasticSearchArgs) => {
  let shouldQuery: Array<object> = []
  let dateFilter: Array<object> = []
  let sorting: Array<object | string> = ['_score'] // default sorting on score

  let themeFilter: Object | null = null

  if (q && q.length > 0) {
    shouldQuery = getSearchQuery(q)
  }

  if (filters && filters.length > 0) {
    dateFilter = getDateFilter(types, filters)
    themeFilter = getThemeFilter(filters)
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
            must: [...dateFilter],
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
      theme: {
        filter: {
          bool: {
            // The themeFilter should affect the totalCount
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
