import { CmsSearchInput } from '../../generated/graphql'
import { getSearchQuery, getFilterQuery } from './utils'

export type ElasticSearchArgs = {
  q: string | undefined
} & CmsSearchInput

export default ({ q, limit, from, types = null, filters, sort }: ElasticSearchArgs) => {
  let shouldQuery: Array<object> = []
  let filterQuery: Array<object> = []
  let sorting: Array<object | string> = ['_score'] // default sorting on score

  if (q && q.length > 0) {
    shouldQuery = getSearchQuery(q)
  }

  if (filters && filters.length > 0) {
    filterQuery = getFilterQuery(types, filters)
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
        must: [{ term: { field_published: true } }, ...filterQuery],
        must_not: [],
        should: shouldQuery,
        filter: {
          terms: {
            type: types,
          },
        },
        minimum_should_match: shouldQuery.length > 0 ? 1 : 0, // At least one of the should rules must match
      },
    },

    from,
    size: limit,
    sort: [...sorting],
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
