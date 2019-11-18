import { SearchInput } from '../generated/graphql'

export type ElasticSearchArgs = {
  q: string
} & SearchInput

export default ({ q, limit, from, types }: ElasticSearchArgs) => ({
  query: {
    bool: {
      must: [],
      must_not: [],
      should: [
        {
          prefix: {
            title: {
              value: q,
              boost: 4.0,
            },
          },
        },
        {
          prefix: {
            field_intro: {
              value: q,
              boost: 2.0,
            },
          },
        },
        {
          prefix: {
            processed: {
              value: q,
              boost: 1.0,
            },
          },
        },
      ],
      filter: {
        terms: { type: types },
      },
      minimum_should_match: 1,
    },
  },
  from,
  size: limit,
  sort: [
    '_score',
    { field_publication_date: { order: 'desc' } },
    { field_publication_year: { order: 'desc' } },
    { field_publication_month: { order: 'desc' } },
  ],
  aggs: {
    count_by_type: {
      terms: {
        field: 'type',
      },
    },
  },
})
