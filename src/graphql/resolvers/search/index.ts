import cmsResolver from './cmsResolver'
import dataResolver from './dataResolver'
import datasetSearch from './datasets'

export default {
  Query: {
    cmsSearch: cmsResolver,
    dataSearch: dataResolver,
    datasetSearch,
  },
}
