import Fuse from 'fuse.js'
import querystring, { ParsedUrlQueryInput } from 'querystring'
import { RawMapCollection } from '../generated/map-collection'
import { LegendItem, RawMapLayer } from '../generated/map-layer'
import { RawTheme } from '../generated/theme'

const DEFAULT_MIN_ZOOM = 8
const DEFAULT_MAX_ZOOM = 16

export interface ComposedMapCollection extends RawMapCollection {
  mapLayers: ComposedMapLayer[]
}

export interface ComposedMapLayer extends Omit<RawMapLayer, 'params'> {
  themes: RawTheme[]
  legendItems?: MixedLegendItem[]
  minZoom: number
  maxZoom: number
  params?: string
}

enum LegendItemType {
  MapLayer = 'MAP_LAYER',
  Standalone = 'STANDALONE',
}

export interface MapLayerLegendItem extends RawMapLayer {
  legendType: LegendItemType.MapLayer
  notSelectable: boolean
}

export interface StandaloneLegendItem extends LegendItem {
  legendType: LegendItemType.Standalone
  notSelectable: boolean
}

type MixedLegendItem = MapLayerLegendItem | StandaloneLegendItem

const rawMapCollections: RawMapCollection[] = require('../../assets/map-collections.config.json')
const rawMapLayers: RawMapLayer[] = require('../../assets/map-layers.config.json')
const rawThemes: RawTheme[] = require('../../assets/themes.config.json')

const composedMapLayers = composeMapLayers(rawMapLayers, rawThemes)
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

/**
 * Finds the parent of a layer, meaning that it's one of the parent's legend items.
 * Note that since a single layer can belong to multiple parents it will find the first best result.
 *
 * @param childLayer The layer to find the parent for.
 */
export function findParentLayer(childLayer: ComposedMapLayer) {
  const match = composedMapLayers.find(layer =>
    (layer.legendItems ?? []).some(({ id }) => id?.split('-').pop() === childLayer.id),
  )

  return match ?? null
}

/**
 * Finds the closest collection that a layers to.
 *
 * @param layer The layer to find the collection for
 */
export function findNearestCollection(layer: ComposedMapLayer) {
  const match = composedMapCollections.find(collection =>
    collection.mapLayers.some(({ id }) => id.split('-').pop() === layer.id),
  )

  return match ?? null
}

function composeMapLayers(layers: RawMapLayer[], themes: RawTheme[]): ComposedMapLayer[] {
  return layers.map(layer => composeMapLayer(layer, layers, themes))
}

function composeMapLayer(
  layer: RawMapLayer,
  layers: RawMapLayer[],
  themes: RawTheme[],
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
    params,
  }
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
        ...composeMapLayer(mapLayer, layers, themes),
        // Overwrite fields from layer with collection layer fields where applicable.
        title: collectionLayer.title ?? mapLayer.title,
        // The ID of the map layer when defined as a collection layer, is a combination of the IDs of the collection and the map layer to prevent duplication when it is selected.
        id: composeId(collection.id, mapLayer.id),
      }
    })

    return {
      ...collection,
      mapLayers: collectionLayers,
    }
  })
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
      return {
        ...mapLayer,
        legendType: LegendItemType.MapLayer,
        notSelectable,
        // Overwrite fields from layer with legend fields where applicable.
        imageRule: legendItem.imageRule ?? mapLayer.imageRule,
        title: legendItem.title ?? mapLayer.title,
        // The ID of the map layer when defined as legend item, is a combination of the IDs of the map layer and the parent map layer it's used in to prevent duplication when it is selected.
        id: composeId(parentId, legendItem.id),
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
