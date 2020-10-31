import { IResolvers } from 'graphql-tools'
import { QueryResolvers, Resolvers } from '../../generated/graphql'
import { mapCollectionSearch, mapLayerSearch, mapSearch } from '../../map/graphql'
import { articleSearch, collectionSearch, publicationSearch, specialSearch } from './cms'
import dataSearch from './data'
import datasetSearch from './datasets'
import filters from './filters'
import { covid19MunicipalityCumulative } from '../other/rivm'

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
  covid19MunicipalityCumulative,
}

const resolversMap: Resolvers = {
  Query: queryResolvers,
  // resolveType is used by GraphQL to handle inline fragments that determine which fields must be returned for this type
  MapLayerLegendItem: {
    __resolveType(obj) {
      return obj.__typename ?? 'LegendItem' // a typename must always be returned
    },
  },
}

export default resolversMap as IResolvers
