import { GraphQLResolveInfo } from 'graphql'
export type Maybe<T> = T | null
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
  { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type CmsLink = {
  __typename?: 'CMSLink'
  uri: Scalars['String']
}

export type CmsResult = {
  __typename?: 'CMSResult'
  id?: Maybe<Scalars['ID']>
  type: Scalars['String']
  label?: Maybe<Scalars['String']>
  slug?: Maybe<Scalars['String']>
  teaserImage?: Maybe<Scalars['String']>
  coverImage?: Maybe<Scalars['String']>
  specialType?: Maybe<Scalars['String']>
  file?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['String']>
  body?: Maybe<Scalars['String']>
  intro?: Maybe<Scalars['String']>
  teaser?: Maybe<Scalars['String']>
  dateLocale?: Maybe<Scalars['String']>
  link?: Maybe<CmsLink>
}

export type CmsSearchInput = {
  limit?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
  types?: Maybe<Array<Scalars['String']>>
  filters?: Maybe<Array<FilterInput>>
  sort?: Maybe<CmsSortInput>
}

export type CmsSearchResult = SearchResult & {
  __typename?: 'CMSSearchResult'
  totalCount: Scalars['Int']
  results?: Maybe<Array<CmsResult>>
  filters?: Maybe<Array<Filter>>
  pageInfo: PageInfo
}

export type CmsSortInput = {
  field: Scalars['String']
  order: Scalars['String']
}

export type CombinedDataResult = CombinedResult & {
  __typename?: 'CombinedDataResult'
  count: Scalars['Int']
  type: Scalars['String']
  label: Scalars['String']
  results?: Maybe<Array<DataResult>>
}

export type CombinedMapResult = CombinedResult & {
  __typename?: 'CombinedMapResult'
  count: Scalars['Int']
  type: Scalars['String']
  label: Scalars['String']
  results: Array<MapResult>
}

export type CombinedResult = {
  count: Scalars['Int']
  type: Scalars['String']
  label: Scalars['String']
}

export type DataResult = {
  __typename?: 'DataResult'
  id?: Maybe<Scalars['ID']>
  type: Scalars['String']
  label?: Maybe<Scalars['String']>
  subtype?: Maybe<Scalars['String']>
  endpoint?: Maybe<Scalars['String']>
  datasetdataset?: Maybe<Scalars['String']>
}

export type DataSearchInput = {
  limit?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
  filters?: Maybe<Array<FilterInput>>
}

export type DataSearchResult = SearchResult & {
  __typename?: 'DataSearchResult'
  totalCount: Scalars['Int']
  results: Array<CombinedDataResult>
  filters?: Maybe<Array<Filter>>
  pageInfo: PageInfo
}

export type DatasetFormats = {
  __typename?: 'DatasetFormats'
  name: Scalars['String']
  count: Scalars['Int']
}

export type DatasetResult = {
  __typename?: 'DatasetResult'
  header: Scalars['String']
  description: Scalars['String']
  teaser: Scalars['String']
  modified: Scalars['String']
  tags: Array<Scalars['String']>
  id: Scalars['String']
  formats: Array<DatasetFormats>
  distributionTypes?: Maybe<Array<Maybe<Scalars['String']>>>
}

export type DatasetSearchInput = {
  limit?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
  filters?: Maybe<Array<FilterInput>>
}

export type DatasetSearchResult = SearchResult & {
  __typename?: 'DatasetSearchResult'
  totalCount: Scalars['Int']
  results?: Maybe<Array<DatasetResult>>
  filters?: Maybe<Array<Filter>>
  pageInfo: PageInfo
}

export type Filter = {
  __typename?: 'Filter'
  type: Scalars['String']
  label: Scalars['String']
  options: Array<FilterOption>
  filterType: Scalars['String']
}

export type FilterInput = {
  type: Scalars['String']
  values: Array<Scalars['String']>
}

export type FilterOption = {
  __typename?: 'FilterOption'
  id: Scalars['String']
  label: Scalars['String']
  count?: Maybe<Scalars['Int']>
}

/** TODO: Do not copy MapLayer fields here, make the map layer a separate field in the LegendItem. */
export type LegendItem = {
  __typename?: 'LegendItem'
  id?: Maybe<Scalars['ID']>
  title?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  noDetail?: Maybe<Scalars['Boolean']>
  layers?: Maybe<Array<Scalars['String']>>
  url?: Maybe<Scalars['String']>
  detailUrl?: Maybe<Scalars['String']>
  detailItem?: Maybe<Scalars['String']>
  detailIsShape?: Maybe<Scalars['Boolean']>
  iconUrl?: Maybe<Scalars['String']>
  imageRule?: Maybe<Scalars['String']>
  minZoom?: Maybe<Scalars['Int']>
  maxZoom?: Maybe<Scalars['Int']>
  notSelectable: Scalars['Boolean']
  external?: Maybe<Scalars['Boolean']>
  bounds?: Maybe<Array<Array<Scalars['Float']>>>
  authScope?: Maybe<Scalars['String']>
  category?: Maybe<Scalars['String']>
  legendType: LegendItemType
  params?: Maybe<Scalars['String']>
}

export enum LegendItemType {
  MapLayer = 'MAP_LAYER',
  Standalone = 'STANDALONE',
}

export type MapCollection = {
  __typename?: 'MapCollection'
  id: Scalars['ID']
  title: Scalars['String']
  mapLayers: Array<MapLayer>
  themes: Array<Theme>
  meta: Meta
  href: Scalars['String']
}

export type MapCollectionSearchResult = SearchResult & {
  __typename?: 'MapCollectionSearchResult'
  totalCount: Scalars['Int']
  results: Array<MapCollection>
  filters?: Maybe<Array<Filter>>
  pageInfo: PageInfo
}

export type MapLayer = {
  __typename?: 'MapLayer'
  id: Scalars['ID']
  title: Scalars['String']
  type: Scalars['String']
  noDetail: Scalars['Boolean']
  minZoom: Scalars['Int']
  maxZoom: Scalars['Int']
  layers?: Maybe<Array<Scalars['String']>>
  url?: Maybe<Scalars['String']>
  params?: Maybe<Scalars['String']>
  detailUrl?: Maybe<Scalars['String']>
  detailItem?: Maybe<Scalars['String']>
  detailIsShape?: Maybe<Scalars['Boolean']>
  iconUrl?: Maybe<Scalars['String']>
  imageRule?: Maybe<Scalars['String']>
  notSelectable?: Maybe<Scalars['Boolean']>
  external?: Maybe<Scalars['Boolean']>
  bounds?: Maybe<Array<Array<Scalars['Float']>>>
  authScope?: Maybe<Scalars['String']>
  category?: Maybe<Scalars['String']>
  legendItems?: Maybe<Array<LegendItem>>
  themes: Array<Theme>
  meta: Meta
  href: Scalars['String']
}

export type MapLayerSearchResult = SearchResult & {
  __typename?: 'MapLayerSearchResult'
  totalCount: Scalars['Int']
  results: Array<MapLayer>
  filters?: Maybe<Array<Filter>>
  pageInfo: PageInfo
}

/** MapResult is a combination of MapLayer and MapCollection */
export type MapResult = {
  __typename?: 'MapResult'
  id: Scalars['ID']
  title: Scalars['String']
  mapLayers?: Maybe<Array<MapLayer>>
  meta: Meta
  href: Scalars['String']
  type?: Maybe<Scalars['String']>
  noDetail?: Maybe<Scalars['Boolean']>
  minZoom?: Maybe<Scalars['Int']>
  maxZoom?: Maybe<Scalars['Int']>
  layers?: Maybe<Array<Scalars['String']>>
  url?: Maybe<Scalars['String']>
  params?: Maybe<Scalars['String']>
  detailUrl?: Maybe<Scalars['String']>
  detailItem?: Maybe<Scalars['String']>
  detailIsShape?: Maybe<Scalars['Boolean']>
  iconUrl?: Maybe<Scalars['String']>
  imageRule?: Maybe<Scalars['String']>
  notSelectable?: Maybe<Scalars['Boolean']>
  external?: Maybe<Scalars['Boolean']>
  bounds?: Maybe<Array<Array<Scalars['Float']>>>
  authScope?: Maybe<Scalars['String']>
  category?: Maybe<Scalars['String']>
  legendItems?: Maybe<Array<LegendItem>>
  themes: Array<Theme>
}

export type MapSearchInput = {
  limit?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
  filters?: Maybe<Array<FilterInput>>
}

export type MapSearchResult = SearchResult & {
  __typename?: 'MapSearchResult'
  totalCount: Scalars['Int']
  results: Array<CombinedMapResult>
  filters?: Maybe<Array<Filter>>
  pageInfo: PageInfo
}

export type Meta = {
  __typename?: 'Meta'
  description?: Maybe<Scalars['String']>
  themes: Array<Scalars['String']>
  datasetIds?: Maybe<Array<Scalars['Int']>>
  thumbnail?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['String']>
}

export type PageInfo = {
  __typename?: 'PageInfo'
  hasNextPage: Scalars['Boolean']
  totalPages: Scalars['Int']
  hasLimitedResults?: Maybe<Scalars['Boolean']>
}

export type Query = {
  __typename?: 'Query'
  articleSearch?: Maybe<CmsSearchResult>
  dataSearch?: Maybe<DataSearchResult>
  datasetSearch?: Maybe<DatasetSearchResult>
  publicationSearch?: Maybe<CmsSearchResult>
  specialSearch?: Maybe<CmsSearchResult>
  collectionSearch?: Maybe<CmsSearchResult>
  mapCollectionSearch: MapCollectionSearchResult
  mapLayerSearch: MapLayerSearchResult
  mapSearch: MapSearchResult
  filters?: Maybe<Array<Maybe<Filter>>>
}

export type QueryArticleSearchArgs = {
  q?: Maybe<Scalars['String']>
  input?: Maybe<CmsSearchInput>
}

export type QueryDataSearchArgs = {
  q?: Maybe<Scalars['String']>
  input?: Maybe<DataSearchInput>
}

export type QueryDatasetSearchArgs = {
  q?: Maybe<Scalars['String']>
  input?: Maybe<DatasetSearchInput>
}

export type QueryPublicationSearchArgs = {
  q?: Maybe<Scalars['String']>
  input?: Maybe<CmsSearchInput>
}

export type QuerySpecialSearchArgs = {
  q?: Maybe<Scalars['String']>
  input?: Maybe<CmsSearchInput>
}

export type QueryCollectionSearchArgs = {
  q?: Maybe<Scalars['String']>
  input?: Maybe<CmsSearchInput>
}

export type QueryMapCollectionSearchArgs = {
  q?: Maybe<Scalars['String']>
  input?: Maybe<MapSearchInput>
}

export type QueryMapLayerSearchArgs = {
  q?: Maybe<Scalars['String']>
  input?: Maybe<MapSearchInput>
}

export type QueryMapSearchArgs = {
  q?: Maybe<Scalars['String']>
  input?: Maybe<MapSearchInput>
}

export type Results =
  | DatasetResult
  | CmsResult
  | CombinedDataResult
  | MapLayer
  | MapCollection
  | CombinedMapResult

export type SearchResult = {
  totalCount: Scalars['Int']
  /** TODO: See if results can be made required. */
  results?: Maybe<Array<Results>>
  filters?: Maybe<Array<Filter>>
  pageInfo: PageInfo
}

export type Theme = {
  __typename?: 'Theme'
  id: Scalars['ID']
  title: Scalars['String']
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type isTypeOfResolverFn<T = {}> = (
  obj: T,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']>
  CMSSearchInput: CmsSearchInput
  Int: ResolverTypeWrapper<Scalars['Int']>
  FilterInput: FilterInput
  CMSSortInput: CmsSortInput
  CMSSearchResult: ResolverTypeWrapper<CmsSearchResult>
  SearchResult:
    | ResolversTypes['CMSSearchResult']
    | ResolversTypes['DataSearchResult']
    | ResolversTypes['DatasetSearchResult']
    | ResolversTypes['MapCollectionSearchResult']
    | ResolversTypes['MapLayerSearchResult']
    | ResolversTypes['MapSearchResult']
  Results:
    | ResolversTypes['DatasetResult']
    | ResolversTypes['CMSResult']
    | ResolversTypes['CombinedDataResult']
    | ResolversTypes['MapLayer']
    | ResolversTypes['MapCollection']
    | ResolversTypes['CombinedMapResult']
  DatasetResult: ResolverTypeWrapper<DatasetResult>
  DatasetFormats: ResolverTypeWrapper<DatasetFormats>
  CMSResult: ResolverTypeWrapper<CmsResult>
  ID: ResolverTypeWrapper<Scalars['ID']>
  CMSLink: ResolverTypeWrapper<CmsLink>
  CombinedDataResult: ResolverTypeWrapper<CombinedDataResult>
  CombinedResult: ResolversTypes['CombinedDataResult'] | ResolversTypes['CombinedMapResult']
  DataResult: ResolverTypeWrapper<DataResult>
  MapLayer: ResolverTypeWrapper<MapLayer>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Float: ResolverTypeWrapper<Scalars['Float']>
  LegendItem: ResolverTypeWrapper<LegendItem>
  LegendItemType: LegendItemType
  Theme: ResolverTypeWrapper<Theme>
  Meta: ResolverTypeWrapper<Meta>
  MapCollection: ResolverTypeWrapper<MapCollection>
  CombinedMapResult: ResolverTypeWrapper<CombinedMapResult>
  MapResult: ResolverTypeWrapper<MapResult>
  Filter: ResolverTypeWrapper<Filter>
  FilterOption: ResolverTypeWrapper<FilterOption>
  PageInfo: ResolverTypeWrapper<PageInfo>
  DataSearchInput: DataSearchInput
  DataSearchResult: ResolverTypeWrapper<DataSearchResult>
  DatasetSearchInput: DatasetSearchInput
  DatasetSearchResult: ResolverTypeWrapper<DatasetSearchResult>
  MapSearchInput: MapSearchInput
  MapCollectionSearchResult: ResolverTypeWrapper<MapCollectionSearchResult>
  MapLayerSearchResult: ResolverTypeWrapper<MapLayerSearchResult>
  MapSearchResult: ResolverTypeWrapper<MapSearchResult>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {}
  String: Scalars['String']
  CMSSearchInput: CmsSearchInput
  Int: Scalars['Int']
  FilterInput: FilterInput
  CMSSortInput: CmsSortInput
  CMSSearchResult: CmsSearchResult
  SearchResult:
    | ResolversParentTypes['CMSSearchResult']
    | ResolversParentTypes['DataSearchResult']
    | ResolversParentTypes['DatasetSearchResult']
    | ResolversParentTypes['MapCollectionSearchResult']
    | ResolversParentTypes['MapLayerSearchResult']
    | ResolversParentTypes['MapSearchResult']
  Results:
    | ResolversParentTypes['DatasetResult']
    | ResolversParentTypes['CMSResult']
    | ResolversParentTypes['CombinedDataResult']
    | ResolversParentTypes['MapLayer']
    | ResolversParentTypes['MapCollection']
    | ResolversParentTypes['CombinedMapResult']
  DatasetResult: DatasetResult
  DatasetFormats: DatasetFormats
  CMSResult: CmsResult
  ID: Scalars['ID']
  CMSLink: CmsLink
  CombinedDataResult: CombinedDataResult
  CombinedResult:
    | ResolversParentTypes['CombinedDataResult']
    | ResolversParentTypes['CombinedMapResult']
  DataResult: DataResult
  MapLayer: MapLayer
  Boolean: Scalars['Boolean']
  Float: Scalars['Float']
  LegendItem: LegendItem
  LegendItemType: LegendItemType
  Theme: Theme
  Meta: Meta
  MapCollection: MapCollection
  CombinedMapResult: CombinedMapResult
  MapResult: MapResult
  Filter: Filter
  FilterOption: FilterOption
  PageInfo: PageInfo
  DataSearchInput: DataSearchInput
  DataSearchResult: DataSearchResult
  DatasetSearchInput: DatasetSearchInput
  DatasetSearchResult: DatasetSearchResult
  MapSearchInput: MapSearchInput
  MapCollectionSearchResult: MapCollectionSearchResult
  MapLayerSearchResult: MapLayerSearchResult
  MapSearchResult: MapSearchResult
}

export type CmsLinkResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CMSLink'] = ResolversParentTypes['CMSLink']
> = {
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type CmsResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CMSResult'] = ResolversParentTypes['CMSResult']
> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  teaserImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  coverImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  specialType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  file?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  intro?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  teaser?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  dateLocale?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  link?: Resolver<Maybe<ResolversTypes['CMSLink']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type CmsSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CMSSearchResult'] = ResolversParentTypes['CMSSearchResult']
> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  results?: Resolver<Maybe<Array<ResolversTypes['CMSResult']>>, ParentType, ContextType>
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type CombinedDataResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CombinedDataResult'] = ResolversParentTypes['CombinedDataResult']
> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  results?: Resolver<Maybe<Array<ResolversTypes['DataResult']>>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type CombinedMapResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CombinedMapResult'] = ResolversParentTypes['CombinedMapResult']
> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  results?: Resolver<Array<ResolversTypes['MapResult']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type CombinedResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CombinedResult'] = ResolversParentTypes['CombinedResult']
> = {
  __resolveType: TypeResolveFn<'CombinedDataResult' | 'CombinedMapResult', ParentType, ContextType>
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}

export type DataResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DataResult'] = ResolversParentTypes['DataResult']
> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  subtype?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  endpoint?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  datasetdataset?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type DataSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DataSearchResult'] = ResolversParentTypes['DataSearchResult']
> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  results?: Resolver<Array<ResolversTypes['CombinedDataResult']>, ParentType, ContextType>
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type DatasetFormatsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DatasetFormats'] = ResolversParentTypes['DatasetFormats']
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type DatasetResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DatasetResult'] = ResolversParentTypes['DatasetResult']
> = {
  header?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  teaser?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  modified?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  formats?: Resolver<Array<ResolversTypes['DatasetFormats']>, ParentType, ContextType>
  distributionTypes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type DatasetSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DatasetSearchResult'] = ResolversParentTypes['DatasetSearchResult']
> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  results?: Resolver<Maybe<Array<ResolversTypes['DatasetResult']>>, ParentType, ContextType>
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type FilterResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Filter'] = ResolversParentTypes['Filter']
> = {
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  options?: Resolver<Array<ResolversTypes['FilterOption']>, ParentType, ContextType>
  filterType?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type FilterOptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FilterOption'] = ResolversParentTypes['FilterOption']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type LegendItemResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LegendItem'] = ResolversParentTypes['LegendItem']
> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  noDetail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  layers?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailItem?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailIsShape?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  imageRule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  minZoom?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  maxZoom?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  notSelectable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  external?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  bounds?: Resolver<Maybe<Array<Array<ResolversTypes['Float']>>>, ParentType, ContextType>
  authScope?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  legendType?: Resolver<ResolversTypes['LegendItemType'], ParentType, ContextType>
  params?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MapCollectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapCollection'] = ResolversParentTypes['MapCollection']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  mapLayers?: Resolver<Array<ResolversTypes['MapLayer']>, ParentType, ContextType>
  themes?: Resolver<Array<ResolversTypes['Theme']>, ParentType, ContextType>
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MapCollectionSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapCollectionSearchResult'] = ResolversParentTypes['MapCollectionSearchResult']
> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  results?: Resolver<Array<ResolversTypes['MapCollection']>, ParentType, ContextType>
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MapLayerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapLayer'] = ResolversParentTypes['MapLayer']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  noDetail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  minZoom?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  maxZoom?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  layers?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  params?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailItem?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailIsShape?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  imageRule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  notSelectable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  external?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  bounds?: Resolver<Maybe<Array<Array<ResolversTypes['Float']>>>, ParentType, ContextType>
  authScope?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  legendItems?: Resolver<Maybe<Array<ResolversTypes['LegendItem']>>, ParentType, ContextType>
  themes?: Resolver<Array<ResolversTypes['Theme']>, ParentType, ContextType>
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MapLayerSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapLayerSearchResult'] = ResolversParentTypes['MapLayerSearchResult']
> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  results?: Resolver<Array<ResolversTypes['MapLayer']>, ParentType, ContextType>
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MapResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapResult'] = ResolversParentTypes['MapResult']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  mapLayers?: Resolver<Maybe<Array<ResolversTypes['MapLayer']>>, ParentType, ContextType>
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  noDetail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  minZoom?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  maxZoom?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  layers?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  params?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailItem?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailIsShape?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  imageRule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  notSelectable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  external?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  bounds?: Resolver<Maybe<Array<Array<ResolversTypes['Float']>>>, ParentType, ContextType>
  authScope?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  legendItems?: Resolver<Maybe<Array<ResolversTypes['LegendItem']>>, ParentType, ContextType>
  themes?: Resolver<Array<ResolversTypes['Theme']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MapSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapSearchResult'] = ResolversParentTypes['MapSearchResult']
> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  results?: Resolver<Array<ResolversTypes['CombinedMapResult']>, ParentType, ContextType>
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MetaResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Meta'] = ResolversParentTypes['Meta']
> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  themes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  datasetIds?: Resolver<Maybe<Array<ResolversTypes['Int']>>, ParentType, ContextType>
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type PageInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']
> = {
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  hasLimitedResults?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  articleSearch?: Resolver<
    Maybe<ResolversTypes['CMSSearchResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryArticleSearchArgs, never>
  >
  dataSearch?: Resolver<
    Maybe<ResolversTypes['DataSearchResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryDataSearchArgs, never>
  >
  datasetSearch?: Resolver<
    Maybe<ResolversTypes['DatasetSearchResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryDatasetSearchArgs, never>
  >
  publicationSearch?: Resolver<
    Maybe<ResolversTypes['CMSSearchResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryPublicationSearchArgs, never>
  >
  specialSearch?: Resolver<
    Maybe<ResolversTypes['CMSSearchResult']>,
    ParentType,
    ContextType,
    RequireFields<QuerySpecialSearchArgs, never>
  >
  collectionSearch?: Resolver<
    Maybe<ResolversTypes['CMSSearchResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryCollectionSearchArgs, never>
  >
  mapCollectionSearch?: Resolver<
    ResolversTypes['MapCollectionSearchResult'],
    ParentType,
    ContextType,
    RequireFields<QueryMapCollectionSearchArgs, never>
  >
  mapLayerSearch?: Resolver<
    ResolversTypes['MapLayerSearchResult'],
    ParentType,
    ContextType,
    RequireFields<QueryMapLayerSearchArgs, never>
  >
  mapSearch?: Resolver<
    ResolversTypes['MapSearchResult'],
    ParentType,
    ContextType,
    RequireFields<QueryMapSearchArgs, never>
  >
  filters?: Resolver<Maybe<Array<Maybe<ResolversTypes['Filter']>>>, ParentType, ContextType>
}

export type ResultsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Results'] = ResolversParentTypes['Results']
> = {
  __resolveType: TypeResolveFn<
    | 'DatasetResult'
    | 'CMSResult'
    | 'CombinedDataResult'
    | 'MapLayer'
    | 'MapCollection'
    | 'CombinedMapResult',
    ParentType,
    ContextType
  >
}

export type SearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']
> = {
  __resolveType: TypeResolveFn<
    | 'CMSSearchResult'
    | 'DataSearchResult'
    | 'DatasetSearchResult'
    | 'MapCollectionSearchResult'
    | 'MapLayerSearchResult'
    | 'MapSearchResult',
    ParentType,
    ContextType
  >
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  results?: Resolver<Maybe<Array<ResolversTypes['Results']>>, ParentType, ContextType>
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
}

export type ThemeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Theme'] = ResolversParentTypes['Theme']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type Resolvers<ContextType = any> = {
  CMSLink?: CmsLinkResolvers<ContextType>
  CMSResult?: CmsResultResolvers<ContextType>
  CMSSearchResult?: CmsSearchResultResolvers<ContextType>
  CombinedDataResult?: CombinedDataResultResolvers<ContextType>
  CombinedMapResult?: CombinedMapResultResolvers<ContextType>
  CombinedResult?: CombinedResultResolvers
  DataResult?: DataResultResolvers<ContextType>
  DataSearchResult?: DataSearchResultResolvers<ContextType>
  DatasetFormats?: DatasetFormatsResolvers<ContextType>
  DatasetResult?: DatasetResultResolvers<ContextType>
  DatasetSearchResult?: DatasetSearchResultResolvers<ContextType>
  Filter?: FilterResolvers<ContextType>
  FilterOption?: FilterOptionResolvers<ContextType>
  LegendItem?: LegendItemResolvers<ContextType>
  MapCollection?: MapCollectionResolvers<ContextType>
  MapCollectionSearchResult?: MapCollectionSearchResultResolvers<ContextType>
  MapLayer?: MapLayerResolvers<ContextType>
  MapLayerSearchResult?: MapLayerSearchResultResolvers<ContextType>
  MapResult?: MapResultResolvers<ContextType>
  MapSearchResult?: MapSearchResultResolvers<ContextType>
  Meta?: MetaResolvers<ContextType>
  PageInfo?: PageInfoResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Results?: ResultsResolvers
  SearchResult?: SearchResultResolvers
  Theme?: ThemeResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>
