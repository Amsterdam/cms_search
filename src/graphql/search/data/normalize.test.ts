import * as normalize from './normalize'

describe('normalize', () => {
  describe('normalizeTypeResults', () => {
    jest.mock('./config', () => ({
      NORMAL_VBO_STATUSSES: ['special'],
    }))

    const { normalizeTypeResults } = normalize

    let input = {
      _links: {
        self: {
          href: 'https:///url.com/foo/121212',
        },
      },
      _display: 'display',
      type: 'type',
      type_adres: 'Hoofdadres',
      vbo_status: '',
      random_field: 'random',
    }

    it('should return the normalized results', () => {
      const output = normalizeTypeResults(input)

      expect(output).toEqual({
        endpoint: 'https:///url.com/foo/121212',
        id: '121212',
        label: 'display',
        random_field: 'random',
        type: 'type',
      })
    })

    it('should return the normalized results if an item is not the main address', () => {
      jest.mock('./config', () => ({
        DATA_SEARCH_ENDPOINTS: [
          {
            type: 'special',
          },
        ],
      }))

      input = {
        ...input,
        type_adres: 'NOT Hoofdadres',
      }

      const output = normalizeTypeResults(input)

      expect(output).toMatchObject({
        label: 'display (nevenadres)',
      })
    })

    it('should return the normalized results if an item has a special status', () => {
      input = {
        ...input,
        type_adres: 'Hoofdadres',
        vbo_status: 'special',
      }

      const output = normalizeTypeResults(input)

      expect(output).toMatchObject({
        label: 'display (special)',
      })
    })
  })

  describe('combineTypeResults', () => {
    const { combineTypeResults } = normalize

    let input = {
      type: 'type2',
      count: 12,
      status: 200,
      results: [],
      label: 'Types',
      labelSingular: 'Type',
    }

    it('should return the combined normalized results when one type', () => {
      const output = combineTypeResults([input])

      expect(output.length).toBe(1)
      expect(output).toEqual([{ count: 12, label: 'Types', results: [], type: 'type2' }])
    })

    it('should return the combined normalized results when multiple types', () => {
      const output = combineTypeResults([input, input])

      expect(output.length).toBe(2)
    })

    it('should reset the count when there is none provided', () => {
      const output = combineTypeResults([
        {
          ...input,
          count: null,
        },
      ])

      expect(output[0].count).toBe(0)
    })

    it('should use the singular label when the count equals one', () => {
      const output = combineTypeResults([
        {
          ...input,
          count: 1,
        },
      ])

      expect(output[0].label).toBe('Type')
    })

    it('should return all results', () => {
      const mockNormalizedTypeResult = { type: 'foo ' }

      const mockedNormalizeTypeResults = jest
        .spyOn(normalize, 'normalizeTypeResults')
        .mockReturnValue(mockNormalizedTypeResult)

      const output = combineTypeResults([
        {
          ...input,
          results: [1, 2, 3, 4],
        },
      ])

      expect(mockedNormalizeTypeResults).toHaveBeenCalledTimes(4)

      expect(output[0].results && output[0].results.length).toBe(4)
      expect(output[0].results).toEqual([
        mockNormalizedTypeResult,
        mockNormalizedTypeResult,
        mockNormalizedTypeResult,
        mockNormalizedTypeResult,
      ])

      mockedNormalizeTypeResults.mockReset()
    })
  })
})
