import { articleSearch, publicationSearch, specialSearch, collectionSearch } from './cms'
import dataSearch from './data'
import datasetSearch from './datasets'
import mapCollectionSearch, { mapLayerSearch } from './map'
import filters from './filters'

export default {
  Query: {
    articleSearch,
    dataSearch,
    datasetSearch,
    publicationSearch,
    specialSearch,
    collectionSearch,
    mapCollectionSearch,
    mapLayerSearch,
    filters,
  },
}
