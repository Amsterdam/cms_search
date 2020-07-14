import {
  CombinedMapResult,
  Filter,
  FilterInput,
  MapCollectionSearchResult,
  MapLayerSearchResult,
  MapResult,
  MapSearchInput,
  MapSearchResult,
  QueryMapCollectionSearchArgs,
  QueryMapLayerSearchArgs,
  QueryMapSearchArgs,
  ResolverFn,
} from '../generated/graphql'
import { Theme } from '../generated/theme'
import { DEFAULT_LIMIT, FilterType } from '../graphql/config'
import { FILTERS } from '../graphql/search/cms/config'
import getPageInfo from '../graphql/utils/getPageInfo'
import fromFuseResult from '../utils/from-fuse-result'
import paginate from '../utils/paginate'
import { LABELS, MapType } from './config'
import {
  createMapCollectionsFuse,
  createMapLayersFuse,
  getAllMapCollections,
  getAllMapLayers,
  getAllThemes,
} from './data'

const mapCollectionsFuse = createMapCollectionsFuse([
  'title',
  'mapLayers.title',
  'mapLayers.meta.description',
  'mapLayers.meta.themes.title',
])

const mapLayersFuse = createMapLayersFuse(['title', 'meta.description', 'meta.themes.title'])

const MAP_TYPE_FILTER: Filter = {
  type: 'map-type',
  label: 'Soorten',
  filterType: FilterType.Radio,
  options: [
    {
      id: MapType.Layer,
      label: LABELS.MAP_LAYERS,
    },
    {
      id: MapType.Collection,
      label: LABELS.MAP_COLLECTIONS,
    },
  ],
}

export const THEME_FILTER: Filter = {
  ...FILTERS.THEME,
  options: getAllThemes().map((theme) => ({
    id: `theme:${theme.id}`,
    label: theme.title,
  })),
}

export const mapCollectionSearch: ResolverFn<
  MapCollectionSearchResult,
  {},
  any,
  QueryMapCollectionSearchArgs
> = (_, { q: query, input }): MapCollectionSearchResult => {
  const { page, limit, filters } = parseInput(input)
  const results = filterResults(
    query ? fromFuseResult(mapCollectionsFuse.search(query)) : getAllMapCollections(),
    filters,
  )
  const paginatedResults = paginate(results, page, limit)

  return {
    totalCount: results.length,
    results: paginatedResults,
    filters: [THEME_FILTER],
    pageInfo: getPageInfo(results.length, page, limit),
  }
}

export const mapLayerSearch: ResolverFn<MapLayerSearchResult, {}, any, QueryMapLayerSearchArgs> = (
  _,
  { q: query, input },
): MapLayerSearchResult => {
  const { page, limit, filters } = parseInput(input)
  const results = filterResults(
    query ? fromFuseResult(mapLayersFuse.search(query)) : getAllMapLayers(),
    filters,
  )
  const paginatedResults = paginate(results, page, limit)

  return {
    totalCount: results.length,
    results: paginatedResults,
    filters: [THEME_FILTER],
    pageInfo: getPageInfo(results.length, page, limit),
  }
}

export const mapSearch: ResolverFn<MapSearchResult, {}, any, QueryMapSearchArgs> = (
  _,
  { q: query, input },
) => {
  const { page, limit, selectedType } = parseInput(input)
  const results: CombinedMapResult[] = selectedType
    ? [getCombinedResult(selectedType, query, input)]
    : [
        getCombinedResult(MapType.Layer, query, input),
        getCombinedResult(MapType.Collection, query, input),
      ]

  const totalCount = results.reduce((acc, result) => acc + result.count, 0)

  return {
    totalCount,
    results,
    filters: [MAP_TYPE_FILTER, THEME_FILTER],
    pageInfo: getPageInfo(totalCount, page, limit),
  }
}

function getCombinedResult(
  type: MapType,
  query?: string | null,
  input?: MapSearchInput | null,
): CombinedMapResult {
  const { page, limit, filters } = parseInput(input)
  const results = filterResults(getResultsForType(type, query) as MapResult[], filters)
  const paginatedResults = paginate(results, page, limit)

  return {
    type,
    count: results.length,
    label: getLabelForType(type),
    results: paginatedResults,
  }
}

function getResultsForType(type: MapType, query?: string | null) {
  switch (type) {
    case MapType.Layer:
      return query ? fromFuseResult(mapLayersFuse.search(query)) : getAllMapLayers()
    case MapType.Collection:
      return query ? fromFuseResult(mapCollectionsFuse.search(query)) : getAllMapCollections()
  }
}

function getLabelForType(type: MapType) {
  switch (type) {
    case MapType.Layer:
      return LABELS.MAP_LAYERS
    case MapType.Collection:
      return LABELS.MAP_COLLECTIONS
  }
}

function parseInput(input?: MapSearchInput | null) {
  const mapTypeOption = (input?.filters || []).find(({ type }) => type === MAP_TYPE_FILTER.type)
  const mapType = mapTypeOption?.values[0] ?? null

  return {
    page: input?.page ?? 1,
    limit: input?.limit ?? DEFAULT_LIMIT,
    selectedType: mapType ? determineMapType(mapType) : null,
    filters: input?.filters ?? [],
  }
}

function determineMapType(type: string) {
  switch (type) {
    case MapType.Layer:
      return MapType.Layer
    case MapType.Collection:
      return MapType.Collection
  }

  return null
}

interface Filterable {
  meta: {
    themes: Theme[]
  }
}

function filterResults<T extends Filterable>(results: T[], filters: FilterInput[]) {
  const themeFilter = filters.find(({ type }) => type === FILTERS.THEME.type)

  if (!themeFilter) {
    return results
  }

  const themeIds = themeFilter.values
    .map((id) => id.split(':').pop())
    .filter((id): id is string => typeof id === 'string')

  return results.filter((result) => result.meta.themes.some(({ id }) => themeIds.includes(id)))
}
