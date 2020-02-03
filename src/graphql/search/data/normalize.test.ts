import * as normalize from './normalize'

describe('normalize', () => {
  describe('normalizeResults', () => {
    jest.mock('./config', () => ({
      NORMAL_VBO_STATUSSES: ['special'],
    }))

    const { normalizeResults } = normalize

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
      const output = normalizeResults(input)

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

      const output = normalizeResults(input)

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

      const output = normalizeResults(input)

      expect(output).toMatchObject({
        label: 'display (special)',
      })
    })
  })
})
