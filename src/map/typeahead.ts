import {
  ComposedMapCollection,
  ComposedMapLayer,
  createMapCollectionsFuse,
  createMapLayersFuse,
  findNearestCollection,
  findParentLayer,
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
  const selectionIds = collection.mapLayers.flatMap(layer => buildSelectionIds(layer, collection))

  return buildSuggestion('map-collection', collection.title, selectionIds)
}

function mapLayerToContent(layer: ComposedMapLayer): TypeAheadSuggestionContent {
  // Find parent layer if layer has no children.
  const parentLayer = !layer.legendItems ? findParentLayer(layer) : null
  // Find the collection the layer belongs to.
  const collection = findNearestCollection(parentLayer ?? layer)

  if (!collection) {
    console.error(
      `Unable to find collection with for map layer with id ${(parentLayer ?? layer).id}.`,
    )
  }

  // Build the selection for the parent layer or the layer itself.
  const selectionIds = buildSelectionIds(parentLayer ?? layer, collection)
  // If there is a parent layer only the child has to be enabled, otherwise all layers.
  const enabledSelection = parentLayer ? buildSelectionIds(layer, collection) : selectionIds

  return buildSuggestion('map-layer', layer.title, selectionIds, enabledSelection)
}

/**
 * Builds a suggestion with all corresponding fields.
 *
 * @param type The type of suggestion (e.g `'map-collection' or `'map-layer'`)
 * @param title The title to display for this suggestion.
 * @param layerIds The map layers which belong to this suggestion, used to build a deep link.
 * @param enabledLayers The map layers that should be enabled, if not specified all map layers will be enabled.
 */
function buildSuggestion(
  type: string,
  title: string,
  layerIds: string[],
  enabledLayers = layerIds,
): TypeAheadSuggestionContent {
  const layers = layerIds.map(id => `${id}:${enabledLayers.includes(id) ? '1' : '0'}`).join('|')
  const searchParams = new URLSearchParams({
    modus: 'kaart',
    lagen: layers,
    legenda: 'true',
  })

  return {
    _display: title,
    type,
    uri: '/data/?' + searchParams.toString(),
  }
}

/**
 * Builds the ids for selection based on a layer and it's 'legend items'.
 *
 * Legend items are a reference to another layer if they have an 'id' field specified.
 * If a legend item has no 'id' but it does have a 'title' it's a standalone legend item which cannot be toggled.
 *
 * @param layer The layer of which to build the selection.
 * @param collection The collection the layer corresponds to.
 */
function buildSelectionIds(
  layer: ComposedMapLayer,
  collection: ComposedMapCollection | null = null,
): string[] {
  // If a layer has no legend items, return the combined id of the layer and the collection.
  if (!layer.legendItems) {
    return [collection ? `${collection.id}-${layer.id}` : layer.id]
  }

  // Otherwise return the combined id of the legend items and the collection.
  return layer.legendItems
    .map(item => item.id?.split('-').pop())
    .filter((id): id is string => !!id)
    .map(id => (collection ? `${collection.id}-${id}` : id))
}

function isSelectable(layer: ComposedMapLayer) {
  return layer.notSelectable === undefined || !layer.notSelectable
}
