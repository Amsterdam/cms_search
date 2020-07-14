import { composeMapLayer } from './data'
import { RawMapLayer } from '../generated/map-layer'
import { Theme } from '../generated/graphql'

describe('map data', () => {
  describe('should compose the maplayers', () => {
    const MOCK_LAYER: RawMapLayer = {
      id: '1',
      title: 'foo',
      type: 'TYPE',
      meta: {
        description: null,
        themes: ['2'],
        datasetIds: [],
        thumbnail: null,
        date: null,
      },
    }

    const MOCK_PARENT_LAYER: RawMapLayer = {
      id: '1',
      title: 'parent',
      type: 'TYPE',
      legendItems: [MOCK_LAYER],
      meta: {
        description: null,
        themes: ['2'],
        datasetIds: [],
        thumbnail: null,
        date: null,
      },
    }

    const MOCK_THEME: Theme = {
      id: '2',
      title: 'foo_theme',
    }

    const MOCK_COLLECTION_ID = '3'

    it('and sets the theme meta', () => {
      const output = composeMapLayer(MOCK_LAYER, [MOCK_LAYER], [MOCK_THEME], MOCK_COLLECTION_ID)

      expect(output.meta.themes[0]).toBe(MOCK_THEME)
    })

    it('and sets the title', () => {
      let output = composeMapLayer(MOCK_LAYER, [MOCK_LAYER], [MOCK_THEME], MOCK_COLLECTION_ID)
      expect(output.title).toBe(MOCK_LAYER.title)

      // if a parent layer is found the parent layer title is added to the layer title
      output = composeMapLayer(
        MOCK_LAYER,
        [MOCK_LAYER, MOCK_PARENT_LAYER],
        [MOCK_THEME],
        MOCK_COLLECTION_ID,
      )
      expect(output.title.startsWith(MOCK_PARENT_LAYER.title)).toBeTruthy()
    })
  })
})
