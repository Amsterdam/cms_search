import { articleSearch, publicationSearch, specialSearch } from './cms'
import dataSearch from './data'
import datasetSearch from './datasets'
import datasetFilters from './datasets/filters'

export default {
  Query: {
    articleSearch,
    dataSearch,
    datasetSearch,
    publicationSearch,
    specialSearch,
    datasetFilters,
  },
}
