import { Context } from '../../config'
import { composeMapCollections, normalizeMapLayers } from './normalize'

// TODO: Handle this more efficiently with Dataloader
const mapLayers = require('../../../../config/map-layers.config.json')
const mapCollections = require('../../../../config/map-collections.config.json')

const mapCollectionSearch = (_: any, {}, {}: Context) => {
  // TODO: Add pagination, add search functionality
  const results = composeMapCollections(mapCollections, mapLayers)

  return {
    results,
  }
}

export const mapLayerSearch = (_: any, {}, {}: Context) => {
  // TODO: Add pagination, add search functionality
  const results = normalizeMapLayers(mapLayers)

  return {
    results,
  }
}

export default mapCollectionSearch
