import { Context } from '../../config'
import { composeMapCollections, normalizeMapLayers } from './normalize'
import { MapLayer } from '../../../generated/graphql'

// TODO: Handle this more efficiently with Dataloader
const mapLayers = require('../../../map/source/map-layers.config.json')
const mapCollections = require('../../../map/source/map-collections.config.json')

const mapCollectionSearch = (_: any, {}, {}: Context) => {
  // TODO: Add pagination, add search functionality
  const results = composeMapCollections(mapCollections, mapLayers)

  return {
    results,
  }
}

export const mapLayerSearch = (_: any, {}, {}: Context) => {
  // TODO: Add pagination, add search functionality
  const results = normalizeMapLayers(mapLayers) as Array<MapLayer>

  return {
    results,
  }
}

export default mapCollectionSearch
