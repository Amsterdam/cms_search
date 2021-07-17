/* eslint-disable @typescript-eslint/no-var-requires */
import Fuse from 'fuse.js'
import querystring, { ParsedUrlQueryInput } from 'querystring'
import { MapGroup, MapGroupLegendItem } from '../generated/graphql'
import { RawMapCollection } from '../generated/map-collection'
import { LegendItem, RawMapGroup } from '../generated/map-group'
import { Theme } from '../generated/theme'
import { RawMapLegend } from '../generated/map-legend'

const DEFAULT_MIN_ZOOM = 7

const rawMapCollections: RawMapCollection[] = require('../../assets/map-collections.config.json')
const rawMapGroups: RawMapGroup[] = require('../../assets/map-groups.config.json')
const rawLegends: RawMapLegend[] = require('../../assets/map-legends.config.json')
const themes: Theme[] = require('../../assets/themes.config.json')

const composedMapGroups = rawLegends.map((legend) => {
  // Find group if legend has no children.
  const parentLayer = findParentLayer(legend, rawMapGroups)
  // Find the collection the layer belongs to.
  const collection = findNearestCollection(parentLayer ?? legend, rawMapCollections)

  if (!collection) {
    throw new Error(
      `Unable to find collection with for map layer with id ${(parentLayer ?? legend).id}.`,
    )
  }

  return composeMapLegend(legend, collection.id)
})

const composedMapCollections = rawMapCollections.map((collection) => {
  const collectionLayers: MapGroup[] = collection.mapLayers.map((collectionLayer) => {
    const mapLegend = rawLegends.find(({ id }) => id === collectionLayer.id)
    const mapGroup = rawMapGroups.find(({ id }) => id === collectionLayer.id)
    let layers
    if (mapGroup) {
      layers = composeMapGroup(mapGroup, collection.id)
    } else if (mapLegend) {
      layers = composeMapLegend(mapLegend, collection.id)
    } else {
      throw Error(`id not found: ${collectionLayer.id}`)
    }
    return {
      ...layers,
      // Overwrite fields from layer with collection layer fields where applicable.
      title: collectionLayer.title ?? mapGroup?.title ?? mapLegend?.title ?? '',
      id: composeId(collection.id, mapGroup?.id ?? mapLegend?.id ?? ''),
    }
  })

  return {
    ...collection,
    mapLayers: collectionLayers,
    href: createMapCollectionHref(collection, [...rawMapGroups, ...rawLegends]),
    meta: {
      ...collection.meta,
      themes: filterBy(themes, 'id', collection.meta.themes),
    },
  }
})

const sortedComposedMapCollections = composedMapCollections.sort((a, b) => {
  if (a.title < b.title) {
    return -1
  }
  if (a.title > b.title) {
    return 1
  }
  return 0
})

const commonOptions = {
  shouldSort: true,
  threshold: 0.4,
  findAllMatches: true,
}

/**
 * Gets a list of all map collections, including it's related fields.
 */
export function getAllMapCollections() {
  return sortedComposedMapCollections
}

/**
 * Gets a list of all map layers, including it's related fields.
 */
export function getAllMapLayers() {
  return composedMapGroups
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
  return new Fuse(sortedComposedMapCollections, { ...commonOptions, keys })
}

/**
 * Creates a Fuse instance that can be used to search the map layers.
 *
 * @param keys The keys of the fields to match.
 */
export function createMapLayersFuse(keys: string[]) {
  return new Fuse(composedMapGroups, { ...commonOptions, keys })
}

export function composeMapGroup(mapGroup: RawMapGroup, collectionId: string): MapGroup {
  const params = mapGroup.params ? querystring.stringify(mapGroup.params as any) : undefined

  // Find parent layer if layer has no children.
  const parentLayer = findParentLayer(mapGroup, rawMapGroups)

  return {
    ...mapGroup,
    title: parentLayer?.title ? `${parentLayer.title} - ${mapGroup.title}` : mapGroup.title,
    legendItems: mapGroup.legendItems?.map((legendItem) =>
      normalizeLegendItem(collectionId, legendItem, mapGroup),
    ),
    minZoom: mapGroup.minZoom ?? DEFAULT_MIN_ZOOM,
    noDetail: !mapGroup.detailUrl,
    notSelectable: false,
    params,
    href: createMapLayerHref(mapGroup, rawMapGroups, collectionId),
    meta: {
      ...mapGroup.meta,
      themes: filterBy(themes, 'id', mapGroup.meta.themes),
    },
    legendIconURI:
      // eslint-disable-next-line no-nested-ternary
      'legendItems' in mapGroup && mapGroup?.legendItems?.length
        ? undefined
        : getLegendIcon(mapGroup?.layers?.[0] ?? '', mapGroup?.title ?? '', mapGroup.url ?? ''),
  }
}

export function composeMapLegend(mapLegend: RawMapLegend, collectionId: string): MapGroup {
  const params = mapLegend.params
    ? querystring.stringify(mapLegend.params as ParsedUrlQueryInput)
    : undefined

  // Find parent layer if layer has no children.
  const parentLayer = findParentLayer(mapLegend, rawMapGroups)

  return {
    ...mapLegend,
    title: parentLayer?.title ? `${parentLayer.title} - ${mapLegend.title}` : mapLegend.title,
    minZoom: mapLegend.minZoom ?? DEFAULT_MIN_ZOOM,
    noDetail: !mapLegend.detailUrl,
    notSelectable: mapLegend.notSelectable ?? false,
    params,
    href: createMapLayerHref(mapLegend, rawMapGroups, collectionId),
    meta: {
      ...mapLegend.meta,
      themes: filterBy(themes, 'id', mapLegend.meta.themes),
    },
    legendIconURI: mapLegend.iconUrl
      ? mapLegend?.iconUrl
      : getLegendIcon(
          mapLegend?.layers?.[0] ?? '',
          mapLegend?.imageRule ?? mapLegend?.title ?? '',
          mapLegend.url ?? '',
        ),
  }
}

function createMapLayerHref(
  layer: RawMapGroup | RawMapLegend,
  layers: Array<RawMapGroup | RawMapLegend>,
  collectionId: string,
) {
  // Find parent layer if layer has no children.
  const parentLayer = findParentLayer(layer, layers)

  // Build the selection for the parent layer or the layer itself.
  const layerIds = buildSelectionIds(collectionId, parentLayer ?? layer)
  // If there is a parent layer only the child has to be enabled, otherwise all layers.
  const enabledLayers = parentLayer ? buildSelectionIds(collectionId, layer) : layerIds

  return buildMapUrl(layerIds, enabledLayers)
}

function createMapCollectionHref(
  collection: RawMapCollection,
  layers: Array<RawMapGroup | RawMapLegend>,
) {
  const layerIds = collection.mapLayers
    .map((layer) => findBy(layers, 'id', layer.id))
    .map((layer) => buildSelectionIds(collection.id, layer))
    .flat()

  return buildMapUrl(layerIds)
}

function getLegendIcon(layer: string, imageRule: string, imageUrl: string) {
  const searchParams = new URLSearchParams({
    version: '1.3.0',
    service: 'WMS',
    request: 'GetLegendGraphic',
    sld_version: '1.1.0',
    layer,
    format: 'image/svg+xml',
    rule: imageRule,
  })

  return `${imageUrl}?${searchParams.toString()}`
}

function normalizeLegendItem(
  collectionId: string,
  groupLegend: LegendItem,
  group: RawMapGroup,
): MapGroupLegendItem & { legendIconURI?: string } {
  const mapLegend = groupLegend.id ? findBy(rawLegends, 'id', groupLegend.id) : null

  const layer = groupLegend.id ? mapLegend?.layers?.[0] ?? '' : group?.layers?.[0] ?? ''
  // Todo: legacy code. Remove this logic when map groups and legends are restructured in JSON files
  const imageRule =
    mapLegend?.imageRule || groupLegend.imageRule || groupLegend.title || mapLegend?.title || ''

  const imageUrl = mapLegend?.url ?? group?.url ?? ''
  const legendIconURI =
    groupLegend.iconUrl || mapLegend?.iconUrl
      ? groupLegend.iconUrl ?? mapLegend?.iconUrl
      : getLegendIcon(layer, imageRule, imageUrl)

  // Return a MapLayer if an ID is specified
  if (groupLegend.id && mapLegend) {
    const params = mapLegend.params
      ? querystring.stringify(mapLegend.params as ParsedUrlQueryInput)
      : undefined

    return {
      __typename: 'MapGroup', // Set the typename to handle inline fragments for union type MapLayerLegendItem
      // Set these fields hardcoded to prevent type errors
      type: mapLegend.type,
      url: mapLegend.url,
      layers: mapLegend.layers,
      iconUrl: mapLegend.iconUrl,
      notSelectable: groupLegend.notSelectable || mapLegend.notSelectable || false,
      // Overwrite fields from layer with legend fields where applicable.
      imageRule: groupLegend.imageRule ?? mapLegend.imageRule,
      title: groupLegend.title ?? mapLegend.title,
      id: composeId(collectionId, groupLegend.id),
      minZoom: mapLegend.minZoom ?? DEFAULT_MIN_ZOOM,
      noDetail: !mapLegend.detailUrl,
      params,
      href: createMapLayerHref(mapLegend, rawLegends, collectionId),
      legendIconURI,
      meta: {
        themes: filterBy(themes, 'id', mapLegend.meta.themes),
      },
    }
  }

  // Otherwise return the plain legendItem
  return {
    __typename: 'LegendItem', // Set the typename to handle inline fragments for union type MapLayerLegendItem
    title: groupLegend?.title || '',
    id: composeId(collectionId, groupLegend?.title ?? ''),
    imageRule: groupLegend.imageRule,
    iconUrl: groupLegend.iconUrl,
    notSelectable: true,
    legendIconURI,
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
function findParentLayer(
  childLayer: RawMapGroup | RawMapLegend,
  mapLayers: Array<RawMapGroup | RawMapLegend>,
) {
  const match = mapLayers.find((layer) =>
    ('legendItems' in layer ? layer.legendItems ?? [] : []).some(({ id }) => id === childLayer.id),
  )

  return match ?? null
}

/**
 * Finds the closest collection that a layer corresponds to.
 *
 * @param layer The layer to find the collection for
 * @param mapCollections The collections to search.
 */
function findNearestCollection(
  layer: RawMapGroup | RawMapLegend,
  mapCollections: RawMapCollection[],
) {
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
 * @param collectionId The collection the layer corresponds to.
 * @param layer The layer of which to build the selection.
 */
function buildSelectionIds(collectionId: string, layer: RawMapGroup | RawMapLegend): string[] {
  const legendIds = (('legendItems' in layer && layer.legendItems) || [])
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

  return `/data/?${searchParams.toString()}`
}
