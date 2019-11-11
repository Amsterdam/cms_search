export default (q: string, limit?: number, types?: Array<string>) => ({
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
  from: 0,
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
