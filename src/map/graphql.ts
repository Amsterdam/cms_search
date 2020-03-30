import {
  MapCollectionSearchResult,
  MapLayerSearchResult,
  QueryMapCollectionSearchArgs,
  QueryMapLayerSearchArgs,
  ResolverFn,
} from '../generated/graphql'
import { DEFAULT_LIMIT } from '../graphql/config'
import getPageInfo from '../graphql/utils/getPageInfo'
import paginate from '../utils/paginate'
import {
  createMapCollectionsFuse,
  createMapLayersFuse,
  getAllMapCollections,
  getAllMapLayers,
} from './data'

const mapCollectionsFuse = createMapCollectionsFuse([
  'title',
  'mapLayers.title',
  'mapLayers.meta.description',
  'mapLayers.themes.title',
])

const mapLayersFuse = createMapLayersFuse(['title', 'meta.description', 'themes.title'])

export const mapCollectionSearch: ResolverFn<
  MapCollectionSearchResult,
  {},
  any,
  QueryMapCollectionSearchArgs
> = (_, { q: query, input }): MapCollectionSearchResult => {
  const page = input?.page ?? 1
  const limit = input?.limit ?? DEFAULT_LIMIT
  const results = query ? mapCollectionsFuse.search(query) : getAllMapCollections()
  const paginatedResults = paginate(results, page, limit)

  return {
    totalCount: results.length,
    results: paginatedResults,
    pageInfo: getPageInfo(results.length, page, limit),
  }
}

export const mapLayerSearch: ResolverFn<MapLayerSearchResult, {}, any, QueryMapLayerSearchArgs> = (
  _,
  { q: query, input },
): MapLayerSearchResult => {
  const page = input?.page ?? 1
  const limit = input?.limit ?? DEFAULT_LIMIT
  const results = query ? mapLayersFuse.search(query) : getAllMapLayers()
  const paginatedResults = paginate(results, page, limit)

  return {
    totalCount: results.length,
    results: paginatedResults,
    pageInfo: getPageInfo(results.length, page, limit),
  }
}

export default mapCollectionSearch
