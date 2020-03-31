import {
  ComposedMapCollection,
  ComposedMapLayer,
  createMapCollectionsFuse,
  createMapLayersFuse,
} from '../map/data'
import { TypeAheadSuggestion, TypeAheadSuggestionContent } from '../typeahead'
import { DEFAULT_LIMIT } from '../typeahead/config'

const mapCollectionsFuse = createMapCollectionsFuse(['title'])
const mapLayersFuse = createMapLayersFuse(['title'])

export async function getMapSuggestions(query: string): Promise<TypeAheadSuggestion[]> {
  const mapCollections = mapCollectionsFuse.search(query, { limit: DEFAULT_LIMIT })
  const mapLayers = mapLayersFuse
    .search(query)
    .filter(layer => isSelectable(layer))
    .slice(0, DEFAULT_LIMIT)

  return [
    {
      label: 'Kaartcollecties',
      total_results: mapCollections.length,
      content: mapCollections.map(result => mapCollectionToContent(result)),
    },
    {
      label: 'Kaartlagen',
      total_results: mapLayers.length,
      content: mapLayers.map(result => mapLayerToContent(result)),
    },
  ]
}

function mapCollectionToContent(collection: ComposedMapCollection): TypeAheadSuggestionContent {
  return {
    _display: collection.title,
    type: 'map-collection',
    uri: collection.href,
  }
}

function mapLayerToContent(layer: ComposedMapLayer): TypeAheadSuggestionContent {
  return {
    _display: layer.title,
    type: 'map-layer',
    uri: layer.href,
  }
}

function isSelectable(layer: ComposedMapLayer) {
  return layer.notSelectable === undefined || !layer.notSelectable
}
