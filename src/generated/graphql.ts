import { GraphQLResolveInfo } from 'graphql'
export type Maybe<T> = T | null
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
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
  results?: Maybe<Array<CmsSearchResultType>>
  filters?: Maybe<Array<Filter>>
  pageInfo: PageInfo
}

export type CmsSearchResultType = {
  __typename?: 'CMSSearchResultType'
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

export type CmsSortInput = {
  field: Scalars['String']
  order: Scalars['String']
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
  results: Array<DataSearchResultType>
  filters?: Maybe<Array<Filter>>
  pageInfo: PageInfo
}

export type DataSearchResultType = SearchResultType & {
  __typename?: 'DataSearchResultType'
  count: Scalars['Int']
  type?: Maybe<Scalars['String']>
  label?: Maybe<Scalars['String']>
  results?: Maybe<Array<DataResult>>
}

export type DatasetFormats = {
  __typename?: 'DatasetFormats'
  name: Scalars['String']
  count: Scalars['Int']
}

export type DatasetSearchInput = {
  limit?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
  filters?: Maybe<Array<FilterInput>>
}

export type DatasetSearchResult = SearchResult & {
  __typename?: 'DatasetSearchResult'
  totalCount: Scalars['Int']
  results?: Maybe<Array<DatasetSearchResultType>>
  filters?: Maybe<Array<Filter>>
  pageInfo: PageInfo
}

export type DatasetSearchResultType = {
  __typename?: 'DatasetSearchResultType'
  header: Scalars['String']
  description: Scalars['String']
  teaser: Scalars['String']
  modified: Scalars['String']
  tags: Array<Scalars['String']>
  id: Scalars['String']
  formats: Array<DatasetFormats>
  distributionTypes?: Maybe<Array<Maybe<Scalars['String']>>>
}

export type Filter = {
  __typename?: 'Filter'
  type: Scalars['String']
  label: Scalars['String']
  options?: Maybe<Array<FilterOptions>>
  filterType?: Maybe<Scalars['String']>
}

export type FilterInput = {
  type: Scalars['String']
  values: Array<Scalars['String']>
}

export type FilterOptions = {
  __typename?: 'FilterOptions'
  id: Scalars['String']
  label: Scalars['String']
  count?: Maybe<Scalars['Int']>
}

export type LegendItemMapLayer = MapLayer & {
  __typename?: 'LegendItemMapLayer'
  id?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  layers?: Maybe<Array<Maybe<Scalars['String']>>>
  url?: Maybe<Scalars['String']>
  params?: Maybe<Scalars['String']>
  external?: Maybe<Scalars['Boolean']>
  imageRule?: Maybe<Scalars['String']>
  iconUrl?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  noDetail?: Maybe<Scalars['Boolean']>
  detailUrl?: Maybe<Scalars['String']>
  detailItem?: Maybe<Scalars['String']>
  detailIsShape?: Maybe<Scalars['Boolean']>
  notSelectable?: Maybe<Scalars['Boolean']>
}

export type MapCollection = {
  __typename?: 'MapCollection'
  id: Scalars['String']
  title: Scalars['String']
  mapLayers: Array<MapCollectionLayer>
  meta: MetaInformation
}

export type MapCollectionLayer = MapLayer & {
  __typename?: 'MapCollectionLayer'
  id: Scalars['String']
  title?: Maybe<Scalars['String']>
  layers?: Maybe<Array<Maybe<Scalars['String']>>>
  url?: Maybe<Scalars['String']>
  params?: Maybe<Scalars['String']>
  external?: Maybe<Scalars['Boolean']>
  legendItems?: Maybe<Array<Maybe<LegendItemMapLayer>>>
  imageRule?: Maybe<Scalars['String']>
  iconUrl?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  noDetail?: Maybe<Scalars['Boolean']>
  detailUrl?: Maybe<Scalars['String']>
  detailItem?: Maybe<Scalars['String']>
  detailIsShape?: Maybe<Scalars['Boolean']>
  minZoom?: Maybe<Scalars['Float']>
  maxZoom?: Maybe<Scalars['Float']>
  authScope?: Maybe<Scalars['String']>
  meta?: Maybe<MetaInformation>
}

export type MapCollectionSearchResult = {
  __typename?: 'MapCollectionSearchResult'
  results?: Maybe<Array<Maybe<MapCollection>>>
}

export type MapLayer = {
  id?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  layers?: Maybe<Array<Maybe<Scalars['String']>>>
  url?: Maybe<Scalars['String']>
  params?: Maybe<Scalars['String']>
  external?: Maybe<Scalars['Boolean']>
  imageRule?: Maybe<Scalars['String']>
  iconUrl?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  detailUrl?: Maybe<Scalars['String']>
  detailItem?: Maybe<Scalars['String']>
  detailIsShape?: Maybe<Scalars['Boolean']>
}

export type MapLayerResult = {
  __typename?: 'MapLayerResult'
  id: Scalars['String']
  title: Scalars['String']
  layers?: Maybe<Array<Scalars['String']>>
  url: Scalars['String']
  params: Scalars['String']
  external?: Maybe<Scalars['Boolean']>
  legendItems?: Maybe<Array<Maybe<LegendItemMapLayer>>>
  imageRule?: Maybe<Scalars['String']>
  iconUrl?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  noDetail?: Maybe<Scalars['Boolean']>
  detailUrl?: Maybe<Scalars['String']>
  detailItem?: Maybe<Scalars['String']>
  detailIsShape?: Maybe<Scalars['Boolean']>
  authScope?: Maybe<Scalars['String']>
  meta?: Maybe<MetaInformation>
}

export type MapLayerSearchResult = {
  __typename?: 'MapLayerSearchResult'
  results?: Maybe<Array<Maybe<MapLayerResult>>>
}

export type MetaInformation = {
  __typename?: 'MetaInformation'
  description?: Maybe<Scalars['String']>
  themes?: Maybe<Array<Maybe<Scalars['Float']>>>
  datasetIds?: Maybe<Array<Maybe<Scalars['Float']>>>
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
  mapCollectionSearch?: Maybe<MapCollectionSearchResult>
  mapLayerSearch?: Maybe<MapLayerSearchResult>
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

export type Results = DatasetSearchResultType | CmsSearchResultType | DataSearchResultType

export type SearchResult = {
  totalCount: Scalars['Int']
  results?: Maybe<Array<Results>>
  filters?: Maybe<Array<Filter>>
  pageInfo: PageInfo
}

export type SearchResultType = {
  count: Scalars['Int']
  type?: Maybe<Scalars['String']>
  label?: Maybe<Scalars['String']>
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

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
) => Maybe<TTypes>

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean

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
  SearchResult: ResolverTypeWrapper<
    Omit<SearchResult, 'results'> & { results?: Maybe<Array<ResolversTypes['Results']>> }
  >
  Results:
    | ResolversTypes['DatasetSearchResultType']
    | ResolversTypes['CMSSearchResultType']
    | ResolversTypes['DataSearchResultType']
  DatasetSearchResultType: ResolverTypeWrapper<DatasetSearchResultType>
  DatasetFormats: ResolverTypeWrapper<DatasetFormats>
  CMSSearchResultType: ResolverTypeWrapper<CmsSearchResultType>
  ID: ResolverTypeWrapper<Scalars['ID']>
  CMSLink: ResolverTypeWrapper<CmsLink>
  DataSearchResultType: ResolverTypeWrapper<DataSearchResultType>
  SearchResultType: ResolverTypeWrapper<SearchResultType>
  DataResult: ResolverTypeWrapper<DataResult>
  Filter: ResolverTypeWrapper<Filter>
  FilterOptions: ResolverTypeWrapper<FilterOptions>
  PageInfo: ResolverTypeWrapper<PageInfo>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  DataSearchInput: DataSearchInput
  DataSearchResult: ResolverTypeWrapper<DataSearchResult>
  DatasetSearchInput: DatasetSearchInput
  DatasetSearchResult: ResolverTypeWrapper<DatasetSearchResult>
  MapCollectionSearchResult: ResolverTypeWrapper<MapCollectionSearchResult>
  MapCollection: ResolverTypeWrapper<MapCollection>
  MapCollectionLayer: ResolverTypeWrapper<MapCollectionLayer>
  MapLayer: ResolverTypeWrapper<MapLayer>
  LegendItemMapLayer: ResolverTypeWrapper<LegendItemMapLayer>
  Float: ResolverTypeWrapper<Scalars['Float']>
  MetaInformation: ResolverTypeWrapper<MetaInformation>
  MapLayerSearchResult: ResolverTypeWrapper<MapLayerSearchResult>
  MapLayerResult: ResolverTypeWrapper<MapLayerResult>
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
  SearchResult: Omit<SearchResult, 'results'> & {
    results?: Maybe<Array<ResolversParentTypes['Results']>>
  }
  Results:
    | ResolversParentTypes['DatasetSearchResultType']
    | ResolversParentTypes['CMSSearchResultType']
    | ResolversParentTypes['DataSearchResultType']
  DatasetSearchResultType: DatasetSearchResultType
  DatasetFormats: DatasetFormats
  CMSSearchResultType: CmsSearchResultType
  ID: Scalars['ID']
  CMSLink: CmsLink
  DataSearchResultType: DataSearchResultType
  SearchResultType: SearchResultType
  DataResult: DataResult
  Filter: Filter
  FilterOptions: FilterOptions
  PageInfo: PageInfo
  Boolean: Scalars['Boolean']
  DataSearchInput: DataSearchInput
  DataSearchResult: DataSearchResult
  DatasetSearchInput: DatasetSearchInput
  DatasetSearchResult: DatasetSearchResult
  MapCollectionSearchResult: MapCollectionSearchResult
  MapCollection: MapCollection
  MapCollectionLayer: MapCollectionLayer
  MapLayer: MapLayer
  LegendItemMapLayer: LegendItemMapLayer
  Float: Scalars['Float']
  MetaInformation: MetaInformation
  MapLayerSearchResult: MapLayerSearchResult
  MapLayerResult: MapLayerResult
}

export type CmsLinkResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CMSLink'] = ResolversParentTypes['CMSLink']
> = {
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type CmsSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CMSSearchResult'] = ResolversParentTypes['CMSSearchResult']
> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  results?: Resolver<Maybe<Array<ResolversTypes['CMSSearchResultType']>>, ParentType, ContextType>
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type CmsSearchResultTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CMSSearchResultType'] = ResolversParentTypes['CMSSearchResultType']
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
  results?: Resolver<Array<ResolversTypes['DataSearchResultType']>, ParentType, ContextType>
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type DataSearchResultTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DataSearchResultType'] = ResolversParentTypes['DataSearchResultType']
> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  results?: Resolver<Maybe<Array<ResolversTypes['DataResult']>>, ParentType, ContextType>
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

export type DatasetSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DatasetSearchResult'] = ResolversParentTypes['DatasetSearchResult']
> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  results?: Resolver<
    Maybe<Array<ResolversTypes['DatasetSearchResultType']>>,
    ParentType,
    ContextType
  >
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type DatasetSearchResultTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DatasetSearchResultType'] = ResolversParentTypes['DatasetSearchResultType']
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

export type FilterResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Filter'] = ResolversParentTypes['Filter']
> = {
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  options?: Resolver<Maybe<Array<ResolversTypes['FilterOptions']>>, ParentType, ContextType>
  filterType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type FilterOptionsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FilterOptions'] = ResolversParentTypes['FilterOptions']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type LegendItemMapLayerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LegendItemMapLayer'] = ResolversParentTypes['LegendItemMapLayer']
> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  layers?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  params?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  external?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  imageRule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  noDetail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  detailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailItem?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailIsShape?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  notSelectable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MapCollectionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapCollection'] = ResolversParentTypes['MapCollection']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  mapLayers?: Resolver<Array<ResolversTypes['MapCollectionLayer']>, ParentType, ContextType>
  meta?: Resolver<ResolversTypes['MetaInformation'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MapCollectionLayerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapCollectionLayer'] = ResolversParentTypes['MapCollectionLayer']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  layers?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  params?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  external?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  legendItems?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['LegendItemMapLayer']>>>,
    ParentType,
    ContextType
  >
  imageRule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  noDetail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  detailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailItem?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailIsShape?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  minZoom?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  maxZoom?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  authScope?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  meta?: Resolver<Maybe<ResolversTypes['MetaInformation']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MapCollectionSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapCollectionSearchResult'] = ResolversParentTypes['MapCollectionSearchResult']
> = {
  results?: Resolver<Maybe<Array<Maybe<ResolversTypes['MapCollection']>>>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MapLayerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapLayer'] = ResolversParentTypes['MapLayer']
> = {
  __resolveType: TypeResolveFn<'MapCollectionLayer' | 'LegendItemMapLayer', ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  layers?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  params?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  external?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  imageRule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailItem?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailIsShape?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
}

export type MapLayerResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapLayerResult'] = ResolversParentTypes['MapLayerResult']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  layers?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  params?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  external?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  legendItems?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['LegendItemMapLayer']>>>,
    ParentType,
    ContextType
  >
  imageRule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  noDetail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  detailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailItem?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  detailIsShape?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  authScope?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  meta?: Resolver<Maybe<ResolversTypes['MetaInformation']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MapLayerSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapLayerSearchResult'] = ResolversParentTypes['MapLayerSearchResult']
> = {
  results?: Resolver<Maybe<Array<Maybe<ResolversTypes['MapLayerResult']>>>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MetaInformationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MetaInformation'] = ResolversParentTypes['MetaInformation']
> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  themes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Float']>>>, ParentType, ContextType>
  datasetIds?: Resolver<Maybe<Array<Maybe<ResolversTypes['Float']>>>, ParentType, ContextType>
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
    QueryArticleSearchArgs
  >
  dataSearch?: Resolver<
    Maybe<ResolversTypes['DataSearchResult']>,
    ParentType,
    ContextType,
    QueryDataSearchArgs
  >
  datasetSearch?: Resolver<
    Maybe<ResolversTypes['DatasetSearchResult']>,
    ParentType,
    ContextType,
    QueryDatasetSearchArgs
  >
  publicationSearch?: Resolver<
    Maybe<ResolversTypes['CMSSearchResult']>,
    ParentType,
    ContextType,
    QueryPublicationSearchArgs
  >
  specialSearch?: Resolver<
    Maybe<ResolversTypes['CMSSearchResult']>,
    ParentType,
    ContextType,
    QuerySpecialSearchArgs
  >
  collectionSearch?: Resolver<
    Maybe<ResolversTypes['CMSSearchResult']>,
    ParentType,
    ContextType,
    QueryCollectionSearchArgs
  >
  mapCollectionSearch?: Resolver<
    Maybe<ResolversTypes['MapCollectionSearchResult']>,
    ParentType,
    ContextType
  >
  mapLayerSearch?: Resolver<Maybe<ResolversTypes['MapLayerSearchResult']>, ParentType, ContextType>
  filters?: Resolver<Maybe<Array<Maybe<ResolversTypes['Filter']>>>, ParentType, ContextType>
}

export type ResultsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Results'] = ResolversParentTypes['Results']
> = {
  __resolveType: TypeResolveFn<
    'DatasetSearchResultType' | 'CMSSearchResultType' | 'DataSearchResultType',
    ParentType,
    ContextType
  >
}

export type SearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']
> = {
  __resolveType: TypeResolveFn<
    'CMSSearchResult' | 'DataSearchResult' | 'DatasetSearchResult',
    ParentType,
    ContextType
  >
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  results?: Resolver<Maybe<Array<ResolversTypes['Results']>>, ParentType, ContextType>
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
}

export type SearchResultTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SearchResultType'] = ResolversParentTypes['SearchResultType']
> = {
  __resolveType: TypeResolveFn<'DataSearchResultType', ParentType, ContextType>
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
  CMSLink?: CmsLinkResolvers<ContextType>
  CMSSearchResult?: CmsSearchResultResolvers<ContextType>
  CMSSearchResultType?: CmsSearchResultTypeResolvers<ContextType>
  DataResult?: DataResultResolvers<ContextType>
  DataSearchResult?: DataSearchResultResolvers<ContextType>
  DataSearchResultType?: DataSearchResultTypeResolvers<ContextType>
  DatasetFormats?: DatasetFormatsResolvers<ContextType>
  DatasetSearchResult?: DatasetSearchResultResolvers<ContextType>
  DatasetSearchResultType?: DatasetSearchResultTypeResolvers<ContextType>
  Filter?: FilterResolvers<ContextType>
  FilterOptions?: FilterOptionsResolvers<ContextType>
  LegendItemMapLayer?: LegendItemMapLayerResolvers<ContextType>
  MapCollection?: MapCollectionResolvers<ContextType>
  MapCollectionLayer?: MapCollectionLayerResolvers<ContextType>
  MapCollectionSearchResult?: MapCollectionSearchResultResolvers<ContextType>
  MapLayer?: MapLayerResolvers
  MapLayerResult?: MapLayerResultResolvers<ContextType>
  MapLayerSearchResult?: MapLayerSearchResultResolvers<ContextType>
  MetaInformation?: MetaInformationResolvers<ContextType>
  PageInfo?: PageInfoResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Results?: ResultsResolvers
  SearchResult?: SearchResultResolvers
  SearchResultType?: SearchResultTypeResolvers
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>
