import * as normalize from './normalize'
import { DataType } from './config'

describe('normalize', () => {
  describe('composeLabel', () => {
    jest.mock('./config', () => ({
      NORMAL_VBO_STATUSSES: ['special'],
    }))

    const { composeLabel } = normalize

    let input = {
      type: 'type',
      type_adres: 'Hoofdadres',
      _display: 'display',
      subtype: '',
      vbo_status: '',
      random_field: 'random',
    }

    it('should return the composed label', () => {
      const output = composeLabel(input.type, input.subtype, input)

      expect(output).toEqual('display')
    })

    it('should return the composed label if an item is not the main address', () => {
      input = {
        ...input,
        type_adres: 'NOT Hoofdadres',
      }

      const output = composeLabel(input.type, input.subtype, input)

      expect(output).toEqual('display (nevenadres)')
    })

    it('should return the composed label if an item has a subtype that needs displaying', () => {
      input = {
        ...input,
        type: 'openbare_ruimte',
        subtype: 'ligplaats',
      }

      let output = composeLabel(input.type, input.subtype, input)

      // subtype 'ligplaats' should be displayed
      expect(output).toContain(`(${input.subtype})`)

      input = {
        ...input,
        subtype: 'weg',
      }

      output = composeLabel(input.type, input.subtype, input)

      // subtype 'weg' should NOT be displayed
      expect(output).not.toContain(`(${input.subtype})`)
    })

    it('should return the composed label if an item has a special status', () => {
      input = {
        ...input,
        type_adres: 'Hoofdadres',
        vbo_status: 'special',
      }

      const output = composeLabel(input.type, input.subtype, input)

      // subtype 'weg' should NOT be displayed
      expect(output).toContain(`(${input.vbo_status})`)
    })

    it('should return the composed label if an item is a construction file', () => {
      const constructionFileInput = {
        _display: 'display',
        dossiernr: '121212',
        stadsdeel: 'VO',
        datering: '2012-01-12',
        dossier_type: 'random',
      }

      const output = composeLabel(DataType.ConstructionFiles, input.subtype, constructionFileInput)

      const { dossiernr, stadsdeel, dossier_type: dossierType } = constructionFileInput

      expect(output).toEqual(`${stadsdeel}${dossiernr} 2012 ${dossierType}`)
    })
  })
  describe('normalizeResults', () => {
    jest.mock('./config', () => ({
      NORMAL_VBO_STATUSSES: ['special'],
    }))

    const MOCK_LABEL = 'display'
    const MOCK_ID = '121212'

    const { normalizeResults } = normalize

    // Spy on these functions and return mock response as they're tested seperately
    beforeEach(() => {
      jest.spyOn(normalize, 'composeLabel').mockReturnValueOnce(MOCK_LABEL)
    })

    const _links = {
      self: {
        href: `https:///url.com/foo/${MOCK_ID}`,
      },
    }

    let input = {
      _display: 'display',
      type: 'type',
      type_adres: 'Hoofdadres',
      subtype: '',
      vbo_status: '',
      random_field: 'random',
    }

    it('should return the normalized results', () => {
      const output = normalizeResults({ _links, ...input }, input.type)

      expect(output).toEqual({
        ...input,
        id: MOCK_ID,
        endpoint: 'https:///url.com/foo/121212',
        label: MOCK_LABEL,
      })
    })
  })
})
