import { articleSearch, publicationSearch, specialSearch } from './cms'
import dataResolver from './dataResolver'
import datasetSearch from './datasets'

export default {
  Query: {
    articleSearch,
    dataSearch: dataResolver,
    datasetSearch,
    publicationSearch,
    specialSearch,
  },
}
