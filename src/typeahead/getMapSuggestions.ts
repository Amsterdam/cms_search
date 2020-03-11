import Fuse from 'fuse.js'
import { TypeAheadSuggestion, TypeAheadSuggestionContent } from '.'
import { MapCollection } from '../generated/map-collection'
import { MapLayer } from '../generated/map-layer'
import { Theme } from '../generated/theme'

const mapLayers: MapLayer[] = require('../../assets/map-layers.config.json')
const mapCollections: MapCollection[] = require('../../assets/map-collections.config.json')
const themes: Theme[] = require('../../assets/themes.config.json')

const layersById = mapLayers.reduce(
  (map, layer) => map.set(layer.id, layer),
  new Map<string, MapLayer>(),
)
const themesById = themes.reduce((map, theme) => map.set(theme.id, theme), new Map<string, Theme>())

const enrichedMapCollections = enrichMapCollections(mapCollections)
const enrichedMapLayers = enrichMapLayers(mapLayers)

const commonOptions = {
  shouldSort: true,
  threshold: 0.5,
}

const mapLayersFuse = new Fuse(enrichedMapLayers, {
  ...commonOptions,
  keys: ['title', 'meta.description', 'themes.title'],
})

const mapCollectionsFuse = new Fuse(enrichedMapCollections, {
  ...commonOptions,
  keys: ['title', 'mapLayers.title', 'mapLayers.meta.description', 'mapLayers.themes.title'],
})

export async function getMapSuggestions(
  query: string,
  limit: number,
): Promise<TypeAheadSuggestion[]> {
  const mapLayerResults = mapLayersFuse.search(query)
  const mapCollectionResults = mapCollectionsFuse.search(query)

  return [
    {
      label: 'Kaartlagen',
      total_results: mapLayerResults.length,
      content: mapLayerResults.map(result => mapLayerToContent(result)).slice(0, limit),
    },
    {
      label: 'Kaartcollecties',
      total_results: mapCollectionResults.length,
      content: mapCollectionResults.map(result => mapCollectionToContent(result)).slice(0, limit),
    },
  ]
}

function mapLayerToContent(layer: EnrichedMapLayer): TypeAheadSuggestionContent {
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

function mapCollectionToContent(collection: EnrichedMapCollection): TypeAheadSuggestionContent {
  const selectionIds = collection.mapLayers
    .map(layer => buildSelectionIds(layer, collection))
    .flat()

  return buildSuggestion('map-collection', collection.title, selectionIds)
}

interface EnrichedMapCollection extends MapCollection {
  mapLayers: EnrichedMapLayer[]
}

/**
 * Enriches map collections with additional data for layers.
 *
 * @param collections The collections to enrich with additional data.
 */
function enrichMapCollections(collections: MapCollection[]): EnrichedMapCollection[] {
  return collections.map(collection => {
    const layerIds = collection.mapLayers.map(layer => layer.id)
    const matchedLayers: MapLayer[] = []

    for (let layerId of layerIds) {
      const matchingLayer = layersById.get(layerId)

      if (matchingLayer) {
        matchedLayers.push(matchingLayer)
      } else {
        console.error(
          `Unable to find matching layer with id '${layerId}' for map collection with id ${collection.id}.`,
        )
      }
    }

    return {
      ...collection,
      mapLayers: enrichMapLayers(matchedLayers),
    }
  })
}

interface EnrichedMapLayer extends MapLayer {
  themes: Theme[]
}

/**
 * Enriches map layers with additional data for themes.
 *
 * @param layers The layers to enrich with additional data.
 */
function enrichMapLayers(layers: MapLayer[]): EnrichedMapLayer[] {
  return layers.map(layer => {
    const themeIds = layer.meta?.themes || []
    const matchedThemes: Theme[] = []

    for (let themeId of themeIds) {
      const matchingTheme = themesById.get(themeId)

      if (matchingTheme) {
        matchedThemes.push(matchingTheme)
      } else {
        console.error(
          `Unable to find matching theme with id '${themeId}' for map layer with id ${layer.id}.`,
        )
      }
    }

    return {
      ...layer,
      themes: matchedThemes,
    }
  })
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
  layer: EnrichedMapLayer,
  collection: EnrichedMapCollection | null = null,
): string[] {
  // Retrieve the ids of the legend items if present.
  const selectionIds = (layer.legendItems ?? [])
    .map(item => item.id)
    .filter((id): id is string => !!id)

  // If a layer has no legend items, return the combined id of the layer and the collection.
  if (selectionIds.length === 0) {
    return [collection ? `${collection.id}-${layer.id}` : layer.id]
  }

  // Otherwise return the combined id of the legend items and the collection.
  return selectionIds.map(id => (collection ? `${collection.id}-${id}` : id))
}

/**
 * Finds the parent of a layer, meaning that it's one of the parent's legend items.
 *
 * @param childLayer The layer to find the parent for.
 */
function findParentLayer(childLayer: EnrichedMapLayer) {
  const match = enrichedMapLayers.find(layer =>
    (layer.legendItems ?? []).some(({ id }) => id === childLayer.id),
  )

  return match ?? null
}

/**
 * Finds the closest collection that a layers to.
 *
 * @param layer The layer to find the collection for
 */
function findNearestCollection(layer: EnrichedMapLayer) {
  const match = enrichedMapCollections.find(collection =>
    collection.mapLayers.some(({ id }) => id === layer.id),
  )

  return match ?? null
}
