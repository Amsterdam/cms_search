import Fuse from 'fuse.js'
import querystring, { ParsedUrlQueryInput } from 'querystring'
import { Meta as CollectionMeta, RawMapCollection } from '../generated/map-collection'
import { LegendItem, RawMapLayer } from '../generated/map-layer'
import { RawTheme } from '../generated/theme'

const DEFAULT_MIN_ZOOM = 8
const DEFAULT_MAX_ZOOM = 16

export interface ComposedMapCollection extends RawMapCollection {
  mapLayers: ComposedMapLayer[]
  href: string
}

export interface ComposedMapLayer extends Omit<RawMapLayer, 'params'> {
  themes: RawTheme[]
  legendItems?: MixedLegendItem[]
  minZoom: number
  maxZoom: number
  noDetail: boolean
  params?: string
  href: string
}

enum LegendItemType {
  MapLayer = 'MAP_LAYER',
  Standalone = 'STANDALONE',
}

export interface MapLayerLegendItem extends Omit<RawMapLayer, 'params'> {
  legendType: LegendItemType.MapLayer
  notSelectable: boolean
  minZoom: number
  maxZoom: number
  noDetail: boolean
  params?: string
}

export interface StandaloneLegendItem extends LegendItem {
  legendType: LegendItemType.Standalone
  notSelectable: boolean
}

type MixedLegendItem = MapLayerLegendItem | StandaloneLegendItem

const rawMapCollections: RawMapCollection[] = require('../../assets/map-collections.config.json')
const rawMapLayers: RawMapLayer[] = require('../../assets/map-layers.config.json')
const rawThemes: RawTheme[] = require('../../assets/themes.config.json')

const composedMapLayers = composeMapLayers(rawMapLayers, rawThemes, rawMapCollections)
const composedMapCollections = composeMapCollections(rawMapCollections, rawMapLayers, rawThemes)

const commonOptions = {
  shouldSort: true,
  threshold: 0.3,
}

/**
 * Gets a list of all map collections, including it's related fields.
 */
export function getAllMapCollections() {
  return composedMapCollections
}

/**
 * Gets a list of all map layers, including it's related fields.
 */
export function getAllMapLayers() {
  return composedMapLayers
}

/**
 * Creates a Fuse instance that can be used to search the map collections.
 *
 * @param keys The keys of the fields to match.
 */
export function createMapCollectionsFuse(keys: string[]) {
  return new Fuse(composedMapCollections, { ...commonOptions, keys })
}

/**
 * Creates a Fuse instance that can be used to search the map layers.
 *
 * @param keys The keys of the fields to match.
 */
export function createMapLayersFuse(keys: string[]) {
  return new Fuse(composedMapLayers, { ...commonOptions, keys })
}

function composeMapLayers(
  layers: RawMapLayer[],
  themes: RawTheme[],
  collections: RawMapCollection[],
): ComposedMapLayer[] {
  return layers.map(layer => composeMapLayer(layer, layers, themes, collections))
}

function composeMapLayer(
  layer: RawMapLayer,
  layers: RawMapLayer[],
  themes: RawTheme[],
  collections: RawMapCollection[],
): ComposedMapLayer {
  const themeIds = layer.meta?.themes ?? []
  const params = layer.params
    ? querystring.stringify(layer.params as ParsedUrlQueryInput)
    : undefined

  return {
    ...layer,
    themes: filterBy(themes, 'id', themeIds),
    legendItems: layer.legendItems
      ? normalizeLegendItems(layer.id, layer.legendItems, layers)
      : undefined,
    minZoom: layer.minZoom ?? DEFAULT_MIN_ZOOM,
    maxZoom: DEFAULT_MAX_ZOOM,
    noDetail: !layer.detailUrl,
    params,
    href: createMapLayerHref(layer, layers, collections),
  }
}

function createMapLayerHref(
  layer: RawMapLayer,
  layers: RawMapLayer[],
  collections: RawMapCollection[],
) {
  // Find parent layer if layer has no children.
  const parentLayer = !layer.legendItems ? findParentLayer(layer, layers) : null
  // Find the collection the layer belongs to.
  const collection = findNearestCollection(parentLayer ?? layer, collections)

  if (!collection) {
    throw new Error(
      `Unable to find collection with for map layer with id ${(parentLayer ?? layer).id}.`,
    )
  }

  // Build the selection for the parent layer or the layer itself.
  const layerIds = buildSelectionIds(collection, parentLayer ?? layer)
  // If there is a parent layer only the child has to be enabled, otherwise all layers.
  const enabledLayers = parentLayer ? buildSelectionIds(collection, layer) : layerIds

  return buildMapUrl(layerIds, enabledLayers)
}

function composeMapCollections(
  collections: RawMapCollection[],
  layers: RawMapLayer[],
  themes: RawTheme[],
): ComposedMapCollection[] {
  return collections.map(collection => {
    const collectionLayers: ComposedMapLayer[] = collection.mapLayers.map(collectionLayer => {
      const mapLayer = findBy(layers, 'id', collectionLayer.id)

      return {
        ...composeMapLayer(mapLayer, layers, themes, collections),
        // Overwrite fields from layer with collection layer fields where applicable.
        title: collectionLayer.title ?? mapLayer.title,
        // The ID of the map layer when defined as a collection layer, is a combination of the IDs of the collection and the map layer to prevent duplication when it is selected.
        id: composeId(collection.id, mapLayer.id),
      }
    })

    const meta: CollectionMeta = {
      ...collection.meta,
      thumbnail: new URL(collection.meta.thumbnail, process.env.CMS_URL).toString(),
    }

    return {
      ...collection,
      mapLayers: collectionLayers,
      meta,
      href: createMapCollectionHref(collection, layers),
    }
  })
}

function createMapCollectionHref(collection: RawMapCollection, layers: RawMapLayer[]) {
  const layerIds = collection.mapLayers
    .map(layer => findBy(layers, 'id', layer.id))
    .map(layer => buildSelectionIds(collection, layer))
    .flat()

  return buildMapUrl(layerIds)
}

function normalizeLegendItems(
  parentId: string,
  legendItems: LegendItem[],
  layers: RawMapLayer[],
): MixedLegendItem[] {
  return legendItems.map(legendItem => {
    const mapLayer = legendItem.id ? findBy(layers, 'id', legendItem.id) : null
    const notSelectable = legendItem.notSelectable || !legendItem.id // Legend items with an id are always selectable, unless specified otherwise.

    // Merge the legend item with the map layer if found.
    if (legendItem.id && mapLayer) {
      const params = mapLayer.params
        ? querystring.stringify(mapLayer.params as ParsedUrlQueryInput)
        : undefined

      return {
        ...mapLayer,
        legendType: LegendItemType.MapLayer,
        notSelectable,
        // Overwrite fields from layer with legend fields where applicable.
        imageRule: legendItem.imageRule ?? mapLayer.imageRule,
        title: legendItem.title ?? mapLayer.title,
        // The ID of the map layer when defined as legend item, is a combination of the IDs of the map layer and the parent map layer it's used in to prevent duplication when it is selected.
        id: composeId(parentId, legendItem.id),
        minZoom: mapLayer.minZoom ?? DEFAULT_MIN_ZOOM,
        maxZoom: DEFAULT_MAX_ZOOM,
        noDetail: !mapLayer.detailUrl,
        params,
      }
    }

    // Otherwise use the plain legend item.
    return {
      ...legendItem,
      legendType: LegendItemType.Standalone,
      notSelectable,
    }
  })
}

function findBy<T, K extends keyof T>(items: T[], key: K, value: T[K]) {
  const match = items.find(item => item[key] === value)

  if (!match) {
    throw new Error('Unable to find matching item.')
  }

  return match
}

function filterBy<T, K extends keyof T>(items: T[], key: K, values: T[K][]) {
  const matches = items.filter(item => values.includes(item[key]))

  if (matches.length !== values.length) {
    throw new Error('Unable to find all matching items.')
  }

  return matches
}

function composeId(parentId: string, childId: string) {
  return `${parentId}-${childId}`
}

/**
 * Finds the parent of a layer, meaning that it's one of the parent's legend items.
 * Note that since a single layer can belong to multiple parents it will find the first best result.
 *
 * @param childLayer The layer to find the parent for.
 * @param mapLayers The layers to find the parent layer in.
 */
function findParentLayer(childLayer: RawMapLayer, mapLayers: RawMapLayer[]) {
  const match = mapLayers.find(layer =>
    (layer.legendItems ?? []).some(({ id }) => id === childLayer.id),
  )

  return match ?? null
}

/**
 * Finds the closest collection that a layer corresponds to.
 *
 * @param layer The layer to find the collection for
 * @param mapCollections The collections to search.
 */
function findNearestCollection(layer: RawMapLayer, mapCollections: RawMapCollection[]) {
  const match = mapCollections.find(collection =>
    collection.mapLayers.some(({ id }) => id === layer.id),
  )

  return match ?? null
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
function buildSelectionIds(collection: RawMapCollection, layer: RawMapLayer): string[] {
  // If a layer has no legend items, return the combined id of the layer and the collection.
  if (!layer.legendItems) {
    return [`${collection.id}-${layer.id}`]
  }

  // Otherwise return the combined id of the legend items and the collection.
  return layer.legendItems
    .map(item => item.id)
    .filter((id): id is string => !!id)
    .map(id => `${collection.id}-${id}`)
}

function buildMapUrl(layerIds: string[], enabledLayers = layerIds) {
  const serializedSelection = layerIds
    .map(id => `${id}:${enabledLayers.includes(id) ? '1' : '0'}`)
    .join('|')
  const searchParams = new URLSearchParams({
    modus: 'kaart',
    lagen: serializedSelection,
    legenda: 'true',
  })

  return '/data/?' + searchParams.toString()
}
