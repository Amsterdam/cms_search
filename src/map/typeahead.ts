import { createMapCollectionsFuse, createMapLayersFuse } from './data'
import { TypeAheadSuggestion, TypeAheadSuggestionContent } from '../typeahead'
import { DEFAULT_LIMIT } from '../typeahead/config'
import fromFuseResult from '../utils/from-fuse-result'
import { LABELS, MapType } from './config'
import { MapLayer, MapCollection } from '../generated/graphql'

const mapCollectionsFuse = createMapCollectionsFuse(['title'])
const mapLayersFuse = createMapLayersFuse(['title'])

// eslint-disable-next-line @typescript-eslint/require-await
export async function getMapLayerSuggestion(query: string): Promise<TypeAheadSuggestion> {
  const mapLayers = fromFuseResult(mapLayersFuse.search(query))
    .filter((layer) => !layer.notSelectable)
    .slice(0, DEFAULT_LIMIT)

  return {
    label: LABELS.MAP_LAYERS,
    total_results: mapLayers.length,
    content: mapLayers.map((result) => mapLayerToContent(result)),
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function getMapCollectionSuggestion(query: string): Promise<TypeAheadSuggestion> {
  const mapCollections = fromFuseResult(mapCollectionsFuse.search(query, { limit: DEFAULT_LIMIT }))

  return {
    label: LABELS.MAP_COLLECTIONS,
    total_results: mapCollections.length,
    content: mapCollections.map((result) => mapCollectionToContent(result)),
  }
}

function mapCollectionToContent(collection: MapCollection): TypeAheadSuggestionContent {
  return {
    _display: collection.title,
    type: MapType.Collection,
    uri: collection.href,
  }
}

function mapLayerToContent(layer: MapLayer): TypeAheadSuggestionContent {
  return {
    _display: layer.title,
    type: MapType.Layer,
    uri: layer.href,
  }
}
