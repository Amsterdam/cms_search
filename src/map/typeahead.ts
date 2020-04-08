import {
  ComposedMapCollection,
  ComposedMapLayer,
  createMapCollectionsFuse,
  createMapLayersFuse,
} from '../map/data'
import { TypeAheadSuggestion, TypeAheadSuggestionContent } from '../typeahead'
import { DEFAULT_LIMIT } from '../typeahead/config'
import fromFuseResult from '../utils/from-fuse-result'
import { LABELS, MapType } from './config'

const mapCollectionsFuse = createMapCollectionsFuse(['title'])
const mapLayersFuse = createMapLayersFuse(['title'])

export async function getMapLayerSuggestion(query: string): Promise<TypeAheadSuggestion> {
  const mapLayers = fromFuseResult(mapLayersFuse.search(query))
    .filter((layer) => isSelectable(layer))
    .slice(0, DEFAULT_LIMIT)

  return {
    label: LABELS.MAP_LAYERS,
    total_results: mapLayers.length,
    content: mapLayers.map((result) => mapLayerToContent(result)),
  }
}

export async function getMapCollectionSuggestion(query: string): Promise<TypeAheadSuggestion> {
  const mapCollections = fromFuseResult(mapCollectionsFuse.search(query, { limit: DEFAULT_LIMIT }))

  return {
    label: LABELS.MAP_COLLECTIONS,
    total_results: mapCollections.length,
    content: mapCollections.map((result) => mapCollectionToContent(result)),
  }
}

function mapCollectionToContent(collection: ComposedMapCollection): TypeAheadSuggestionContent {
  return {
    _display: collection.title,
    type: MapType.Collection,
    uri: collection.href,
  }
}

function mapLayerToContent(layer: ComposedMapLayer): TypeAheadSuggestionContent {
  return {
    _display: layer.title,
    type: MapType.Layer,
    uri: layer.href,
  }
}

function isSelectable(layer: ComposedMapLayer) {
  return layer.notSelectable === undefined || !layer.notSelectable
}
