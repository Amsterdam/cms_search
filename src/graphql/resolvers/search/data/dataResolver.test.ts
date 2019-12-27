import * as dataResolver from './dataResolver'

describe('dataResolver', () => {
  const mockedEndpoint = `${process.env.API_ROOT}endpoint`
  describe('getEndpoints', () => {
    it('should return an array of urls based on a config file', () => {
      const result = dataResolver.getEndpoints(
        [
          { endpoint: ['endpoint/foo'] },
          { endpoint: ['endpoint/bar'], params: { some: 'params' } },
        ],
        '',
        'dam',
      )
      expect(result).toEqual([
        [`${mockedEndpoint}/foo/?q=dam`],
        [`${mockedEndpoint}/bar/?q=dam&some=params`],
      ])
    })

    it('should add an endpoint with a pagination parameter when limit + from > 100', () => {
      expect(
        dataResolver.getEndpoints([{ endpoint: ['endpoint/foo'] }], '', 'dam', 100, 10),
      ).toEqual([[`${mockedEndpoint}/foo/?q=dam`, `${mockedEndpoint}/foo/?q=dam&page=2`]])
      expect(
        dataResolver.getEndpoints([{ endpoint: ['endpoint/foo'] }], '', 'dam', 81, 120),
      ).toEqual([
        [
          `${mockedEndpoint}/foo/?q=dam`,
          `${mockedEndpoint}/foo/?q=dam&page=2`,
          `${mockedEndpoint}/foo/?q=dam&page=3`,
        ],
      ])
    })
  })

  describe('buildRequestPromises', () => {
    it('should return an array of fetch-promises', () => {
      expect(
        dataResolver.buildRequestPromises(
          [
            [`${mockedEndpoint}/foo/?q=dam`, `${mockedEndpoint}/foo/?q=dam`],
            [`${mockedEndpoint}/foo/?q=dam`],
          ],
          '',
        ),
      ).toEqual([new Promise(jest.fn), new Promise(jest.fn)])
    })
  })

  describe('buildResults', () => {
    const normalizeDataMock = jest
      .spyOn(dataResolver, 'normalizeData')
      .mockImplementation(value => value)

    it('should return an array with aggregated results, count, type and label', () => {
      const result = dataResolver.buildResults(
        [
          [
            {
              count: 4,
              results: ['foo', 'foo'],
            },
            {
              count: 4,
              results: ['foo', 'foo'],
            },
          ],
        ],
        10,
        0,
        [],
      )
      expect(result).toEqual([
        {
          count: 4,
          results: ['foo', 'foo', 'foo', 'foo'],
          label: 'Straatnamen',
          type: 'straatnamen',
        },
      ])
      expect(normalizeDataMock).toHaveBeenCalledTimes(4)
    })

    it('should slice the array according the given limit and from values', () => {
      const tests = [
        {
          limit: 10,
          from: 0,
          expectation: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
        {
          limit: 7,
          from: 5,
          expectation: [6, 7, 8, 9, 10, 11],
        },
        {
          limit: 0,
          from: 0,
          expectation: [],
        },
        {
          limit: 100,
          from: 100,
          expectation: [],
        },
        {
          limit: 100,
          from: 10,
          expectation: [11],
        },
      ]

      tests.forEach(({ limit, from, expectation }) => {
        expect(
          dataResolver.buildResults(
            [
              [
                {
                  count: 11,
                  results: [1, 2, 3, 4, 5, 6],
                },
                {
                  count: 11,
                  results: [7, 8, 9, 10, 11],
                },
              ],
            ],
            limit,
            from,
            [],
          ),
        ).toEqual([
          {
            count: 11,
            results: expectation,
            label: 'Straatnamen',
            type: 'straatnamen',
          },
        ])
      })
    })
  })
})
