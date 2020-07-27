import Fuse from 'fuse.js'
import querystring, { ParsedUrlQueryInput } from 'querystring'
import { RawMapCollection } from '../generated/map-collection'
import { LegendItem as RawLegendItem, RawMapLayer } from '../generated/map-layer'
import { Theme } from '../generated/theme'
import { MapLayer, MapCollection, MapLayerLegendItem } from '../generated/graphql'

const DEFAULT_MIN_ZOOM = 7
const DEFAULT_MAX_ZOOM = 16

const rawMapCollections: RawMapCollection[] = require('../../assets/map-collections.config.json')
const rawMapLayers: RawMapLayer[] = require('../../assets/map-layers.config.json')
const themes: Theme[] = require('../../assets/themes.config.json')

const composedMapLayers = composeMapLayers(rawMapLayers, themes, rawMapCollections)
const composedMapCollections = composeMapCollections(rawMapCollections, rawMapLayers, themes)

const commonOptions = {
  shouldSort: true,
  threshold: 0.4,
  findAllMatches: true,
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
 * Gets a list of all themes.
 */
export function getAllThemes() {
  return themes
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
  themes: Theme[],
  collections: RawMapCollection[],
): MapLayer[] {
  return layers.map((layer) => {
    // Find parent layer if layer has no children.
    const parentLayer = findParentLayer(layer, layers)
    // Find the collection the layer belongs to.
    const collection = findNearestCollection(parentLayer ?? layer, collections)

    if (!collection) {
      throw new Error(
        `Unable to find collection with for map layer with id ${(parentLayer ?? layer).id}.`,
      )
    }

    return composeMapLayer(layer, layers, themes, collection.id)
  })
}

export function composeMapLayer(
  layer: RawMapLayer,
  layers: RawMapLayer[],
  themes: Theme[],
  collectionId: string,
): MapLayer {
  const params = layer.params
    ? querystring.stringify(layer.params as ParsedUrlQueryInput)
    : undefined

  // Find parent layer if layer has no children.
  const parentLayer = findParentLayer(layer, layers)

  return {
    ...layer,
    title: parentLayer?.title ? `${parentLayer.title} - ${layer.title}` : layer.title,
    legendItems: layer.legendItems
      ? layer.legendItems.map((legendItem) => normalizeLegendItem(collectionId, legendItem, layers))
      : undefined,
    minZoom: layer.minZoom ?? DEFAULT_MIN_ZOOM,
    maxZoom: DEFAULT_MAX_ZOOM,
    noDetail: !layer.detailUrl,
    notSelectable: layer.notSelectable || false,
    params,
    href: createMapLayerHref(layer, layers, collectionId),
    meta: {
      ...layer.meta,
      themes: filterBy(themes, 'id', layer.meta.themes),
    },
  }
}

function createMapLayerHref(layer: RawMapLayer, layers: RawMapLayer[], collectionId: string) {
  // Find parent layer if layer has no children.
  const parentLayer = findParentLayer(layer, layers)

  // Build the selection for the parent layer or the layer itself.
  const layerIds = buildSelectionIds(collectionId, parentLayer ?? layer)
  // If there is a parent layer only the child has to be enabled, otherwise all layers.
  const enabledLayers = parentLayer ? buildSelectionIds(collectionId, layer) : layerIds

  return buildMapUrl(layerIds, enabledLayers)
}

function composeMapCollections(
  collections: RawMapCollection[],
  layers: RawMapLayer[],
  themes: Theme[],
): MapCollection[] {
  return collections.map((collection) => {
    const collectionLayers: MapLayer[] = collection.mapLayers.map((collectionLayer) => {
      const mapLayer = findBy(layers, 'id', collectionLayer.id)
      return {
        ...composeMapLayer(mapLayer, layers, themes, collection.id),
        // Overwrite fields from layer with collection layer fields where applicable.
        imageRule: mapLayer.imageRule ?? mapLayer.title, // !important: the title is used as imageRule, if the title is overriden from the collection the title or imageRule from the maplayer must be used
        title: collectionLayer.title ?? mapLayer.title,
        id: composeId(collection.id, mapLayer.id),
      }
    })

    return {
      ...collection,
      mapLayers: collectionLayers,
      href: createMapCollectionHref(collection, layers),
      meta: {
        ...collection.meta,
        themes: filterBy(themes, 'id', collection.meta.themes),
      },
    }
  })
}

function createMapCollectionHref(collection: RawMapCollection, layers: RawMapLayer[]) {
  const layerIds = collection.mapLayers
    .map((layer) => findBy(layers, 'id', layer.id))
    .map((layer) => buildSelectionIds(collection.id, layer))
    .flat()

  return buildMapUrl(layerIds)
}

function normalizeLegendItem(
  collectionId: string,
  legendItem: RawLegendItem,
  layers: RawMapLayer[],
): MapLayerLegendItem {
  const mapLayer = legendItem.id ? findBy(layers, 'id', legendItem.id) : null

  // Return a MapLayer if an ID is specified
  if (legendItem.id && mapLayer) {
    const params = mapLayer.params
      ? querystring.stringify(mapLayer.params as ParsedUrlQueryInput)
      : undefined

    return {
      __typename: 'MapLayer', // Set the typename to handle inline fragments for union type MapLayerLegendItem
      // Set these fields hardcoded to prevent type errors
      type: mapLayer.type,
      url: mapLayer.url,
      layers: mapLayer.layers,
      iconUrl: mapLayer.iconUrl,
      notSelectable: legendItem.notSelectable || mapLayer.notSelectable || false,
      // Overwrite fields from layer with legend fields where applicable.
      imageRule: legendItem.imageRule ?? mapLayer.imageRule,
      title: legendItem.title ?? mapLayer.title,
      id: composeId(collectionId, legendItem.id),
      minZoom: mapLayer.minZoom ?? DEFAULT_MIN_ZOOM,
      maxZoom: DEFAULT_MAX_ZOOM,
      noDetail: !mapLayer.detailUrl,
      params,
      href: createMapLayerHref(mapLayer, layers, collectionId),
      meta: {
        themes: filterBy(themes, 'id', mapLayer.meta.themes),
      },
    }
  }

  // Otherwise return the plain legendItem
  return {
    __typename: 'LegendItem', // Set the typename to handle inline fragments for union type MapLayerLegendItem
    title: legendItem?.title || '',
    imageRule: legendItem.imageRule,
    notSelectable: true,
  }
}

function findBy<T, K extends keyof T>(items: T[], key: K, value: T[K]) {
  const match = items.find((item) => item[key] === value)

  if (!match) {
    throw new Error('Unable to find matching item.')
  }

  return match
}

function filterBy<T, K extends keyof T>(items: T[], key: K, values: T[K][]) {
  const matches = items.filter((item) => values.includes(item[key]))

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
  const match = mapLayers.find((layer) =>
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
  const match = mapCollections.find((collection) =>
    collection.mapLayers.some(({ id }) => id === layer.id),
  )

  if (!match) {
    throw new Error(`Unable to find collection with for map layer with id ${layer.id}.`)
  }

  return match
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
function buildSelectionIds(collectionId: string, layer: RawMapLayer): string[] {
  const legendIds = (layer.legendItems ?? [])
    .map((item) => item.id)
    .filter((id): id is string => !!id)
    .map((id) => `${collectionId}-${id}`)

  // If a layer has legend items with ids, return the combined id of the legend items and the collection.
  if (legendIds.length > 0) {
    return legendIds
  }

  // Otherwise return the combined id of the layer and the collection.
  return [`${collectionId}-${layer.id}`]
}

function buildMapUrl(layerIds: string[], enabledLayers = layerIds) {
  const serializedSelection = layerIds
    .map((id) => `${id}:${enabledLayers.includes(id) ? '1' : '0'}`)
    .join('|')
  const searchParams = new URLSearchParams({
    modus: 'kaart',
    lagen: serializedSelection,
    legenda: 'true',
  })

  return '/data/?' + searchParams.toString()
}
