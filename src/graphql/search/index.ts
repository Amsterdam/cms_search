import { IResolvers } from 'graphql-tools'
import { QueryResolvers, Resolvers } from '../../generated/graphql'
import { mapCollectionSearch, mapLayerSearch, mapSearch } from '../../map/graphql'
import { articleSearch, collectionSearch, publicationSearch, specialSearch } from './cms'
import dataSearch from './data'
import datasetSearch from './datasets'
import filters from './filters'

const queryResolvers: QueryResolvers = {
  articleSearch,
  dataSearch,
  datasetSearch,
  publicationSearch,
  specialSearch,
  collectionSearch,
  mapCollectionSearch,
  mapLayerSearch,
  mapSearch,
  filters,
}

const resolversMap: Resolvers = {
  Query: queryResolvers,
  // resolveType is used by GraphQL to handle inline fragments that determine which fields must be returned for this type
  MapLayerLegendItem: {
    // eslint-disable-next-line no-underscore-dangle
    __resolveType(obj) {
      // eslint-disable-next-line no-underscore-dangle
      return obj.__typename ?? 'LegendItem' // a typename must always be returned
    },
  },
}

export default resolversMap as IResolvers
