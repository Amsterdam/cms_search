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
}

export default resolversMap as IResolvers
