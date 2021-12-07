import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CombinedDataResult = CombinedResult & {
  __typename?: 'CombinedDataResult';
  count: Scalars['Int'];
  label: Scalars['String'];
  reason?: Maybe<Scalars['String']>;
  results?: Maybe<Array<DataResult>>;
  status?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type CombinedMapResult = CombinedResult & {
  __typename?: 'CombinedMapResult';
  count: Scalars['Int'];
  label: Scalars['String'];
  results: Array<MapResult>;
  type: Scalars['String'];
};

export type CombinedResult = {
  count: Scalars['Int'];
  label: Scalars['String'];
  type: Scalars['String'];
};

export type DataResult = {
  __typename?: 'DataResult';
  datasetdataset?: Maybe<Scalars['String']>;
  endpoint?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  label?: Maybe<Scalars['String']>;
  subtype?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type DataSearchInput = {
  filters?: Maybe<Array<FilterInput>>;
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};

export type DataSearchResult = SearchResult & {
  __typename?: 'DataSearchResult';
  filters?: Maybe<Array<Filter>>;
  pageInfo: PageInfo;
  results: Array<CombinedDataResult>;
  totalCount: Scalars['Int'];
};

export type DatasetFormats = {
  __typename?: 'DatasetFormats';
  count: Scalars['Int'];
  name: Scalars['String'];
};

export type DatasetResult = {
  __typename?: 'DatasetResult';
  description: Scalars['String'];
  distributionTypes?: Maybe<Array<Maybe<Scalars['String']>>>;
  formats: Array<DatasetFormats>;
  header: Scalars['String'];
  id: Scalars['String'];
  modified: Scalars['String'];
  tags: Array<Scalars['String']>;
  teaser: Scalars['String'];
};

export type DatasetSearchInput = {
  filters?: Maybe<Array<FilterInput>>;
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};

export type DatasetSearchResult = SearchResult & {
  __typename?: 'DatasetSearchResult';
  filters?: Maybe<Array<Filter>>;
  pageInfo: PageInfo;
  results?: Maybe<Array<DatasetResult>>;
  totalCount: Scalars['Int'];
};

export type DetailParams = {
  __typename?: 'DetailParams';
  datasets?: Maybe<Scalars['String']>;
  item?: Maybe<Scalars['String']>;
};

export type Filter = {
  __typename?: 'Filter';
  filterType: Scalars['String'];
  label: Scalars['String'];
  options: Array<FilterOption>;
  type: Scalars['String'];
};

export type FilterInput = {
  type: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type FilterOption = {
  __typename?: 'FilterOption';
  count?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  label: Scalars['String'];
};

export type LegendItem = {
  __typename?: 'LegendItem';
  iconUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageRule?: Maybe<Scalars['String']>;
  isVisible?: Maybe<Scalars['Boolean']>;
  legendIconURI?: Maybe<Scalars['String']>;
  notSelectable: Scalars['Boolean'];
  title: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

export type MapCollection = {
  __typename?: 'MapCollection';
  href: Scalars['String'];
  id: Scalars['ID'];
  mapLayers: Array<MapGroup>;
  meta: Meta;
  title: Scalars['String'];
};

export type MapCollectionSearchResult = SearchResult & {
  __typename?: 'MapCollectionSearchResult';
  filters?: Maybe<Array<Filter>>;
  pageInfo: PageInfo;
  results: Array<MapCollection>;
  totalCount: Scalars['Int'];
};

export type MapGroup = {
  __typename?: 'MapGroup';
  authScope?: Maybe<Scalars['String']>;
  bounds?: Maybe<Array<Array<Scalars['Float']>>>;
  category?: Maybe<Scalars['String']>;
  detailIsShape?: Maybe<Scalars['Boolean']>;
  detailParams?: Maybe<DetailParams>;
  detailUrl?: Maybe<Scalars['String']>;
  external?: Maybe<Scalars['Boolean']>;
  href: Scalars['String'];
  iconUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageRule?: Maybe<Scalars['String']>;
  layers?: Maybe<Array<Scalars['String']>>;
  legendIconURI?: Maybe<Scalars['String']>;
  legendItems?: Maybe<Array<MapGroupLegendItem>>;
  meta: Meta;
  minZoom: Scalars['Int'];
  noDetail: Scalars['Boolean'];
  notSelectable: Scalars['Boolean'];
  params?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

export type MapGroupLegendItem = LegendItem | MapGroup;

export type MapLayerSearchResult = SearchResult & {
  __typename?: 'MapLayerSearchResult';
  filters?: Maybe<Array<Filter>>;
  pageInfo: PageInfo;
  results: Array<MapGroup>;
  totalCount: Scalars['Int'];
};

export type MapResult = {
  __typename?: 'MapResult';
  authScope?: Maybe<Scalars['String']>;
  bounds?: Maybe<Array<Array<Scalars['Float']>>>;
  category?: Maybe<Scalars['String']>;
  detailIsShape?: Maybe<Scalars['Boolean']>;
  detailParams?: Maybe<DetailParams>;
  detailUrl?: Maybe<Scalars['String']>;
  external?: Maybe<Scalars['Boolean']>;
  href: Scalars['String'];
  iconUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageRule?: Maybe<Scalars['String']>;
  layers?: Maybe<Array<Scalars['String']>>;
  legendItems?: Maybe<Array<LegendItem>>;
  mapLayers?: Maybe<Array<MapGroup>>;
  meta: Meta;
  minZoom?: Maybe<Scalars['Int']>;
  noDetail?: Maybe<Scalars['Boolean']>;
  notSelectable?: Maybe<Scalars['Boolean']>;
  params?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type MapSearchInput = {
  filters?: Maybe<Array<FilterInput>>;
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};

export type MapSearchResult = SearchResult & {
  __typename?: 'MapSearchResult';
  filters?: Maybe<Array<Filter>>;
  pageInfo: PageInfo;
  results: Array<CombinedMapResult>;
  totalCount: Scalars['Int'];
};

export type Meta = {
  __typename?: 'Meta';
  themes: Array<Theme>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasLimitedResults?: Maybe<Scalars['Boolean']>;
  hasNextPage: Scalars['Boolean'];
  totalPages: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  dataSearch?: Maybe<DataSearchResult>;
  datasetSearch?: Maybe<DatasetSearchResult>;
  filters?: Maybe<Array<Maybe<Filter>>>;
  mapCollectionSearch: MapCollectionSearchResult;
  mapLayerSearch: MapLayerSearchResult;
  mapSearch: MapSearchResult;
};


export type QueryDataSearchArgs = {
  input?: Maybe<DataSearchInput>;
  q?: Maybe<Scalars['String']>;
};


export type QueryDatasetSearchArgs = {
  input?: Maybe<DatasetSearchInput>;
  q?: Maybe<Scalars['String']>;
};


export type QueryMapCollectionSearchArgs = {
  input?: Maybe<MapSearchInput>;
  q?: Maybe<Scalars['String']>;
};


export type QueryMapLayerSearchArgs = {
  input?: Maybe<MapSearchInput>;
  q?: Maybe<Scalars['String']>;
};


export type QueryMapSearchArgs = {
  input?: Maybe<MapSearchInput>;
  q?: Maybe<Scalars['String']>;
};

export type Results = CombinedDataResult | CombinedMapResult | DatasetResult | MapCollection | MapGroup;

export type SearchResult = {
  filters?: Maybe<Array<Filter>>;
  pageInfo: PageInfo;
  results?: Maybe<Array<Results>>;
  totalCount: Scalars['Int'];
};

export type Theme = {
  __typename?: 'Theme';
  id: Scalars['ID'];
  title: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CombinedDataResult: ResolverTypeWrapper<CombinedDataResult>;
  CombinedMapResult: ResolverTypeWrapper<CombinedMapResult>;
  CombinedResult: ResolversTypes['CombinedDataResult'] | ResolversTypes['CombinedMapResult'];
  DataResult: ResolverTypeWrapper<DataResult>;
  DataSearchInput: DataSearchInput;
  DataSearchResult: ResolverTypeWrapper<DataSearchResult>;
  DatasetFormats: ResolverTypeWrapper<DatasetFormats>;
  DatasetResult: ResolverTypeWrapper<DatasetResult>;
  DatasetSearchInput: DatasetSearchInput;
  DatasetSearchResult: ResolverTypeWrapper<DatasetSearchResult>;
  DetailParams: ResolverTypeWrapper<DetailParams>;
  Filter: ResolverTypeWrapper<Filter>;
  FilterInput: FilterInput;
  FilterOption: ResolverTypeWrapper<FilterOption>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LegendItem: ResolverTypeWrapper<LegendItem>;
  MapCollection: ResolverTypeWrapper<MapCollection>;
  MapCollectionSearchResult: ResolverTypeWrapper<MapCollectionSearchResult>;
  MapGroup: ResolverTypeWrapper<Omit<MapGroup, 'legendItems'> & { legendItems?: Maybe<Array<ResolversTypes['MapGroupLegendItem']>> }>;
  MapGroupLegendItem: ResolversTypes['LegendItem'] | ResolversTypes['MapGroup'];
  MapLayerSearchResult: ResolverTypeWrapper<MapLayerSearchResult>;
  MapResult: ResolverTypeWrapper<MapResult>;
  MapSearchInput: MapSearchInput;
  MapSearchResult: ResolverTypeWrapper<MapSearchResult>;
  Meta: ResolverTypeWrapper<Meta>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  Results: ResolversTypes['CombinedDataResult'] | ResolversTypes['CombinedMapResult'] | ResolversTypes['DatasetResult'] | ResolversTypes['MapCollection'] | ResolversTypes['MapGroup'];
  SearchResult: ResolversTypes['DataSearchResult'] | ResolversTypes['DatasetSearchResult'] | ResolversTypes['MapCollectionSearchResult'] | ResolversTypes['MapLayerSearchResult'] | ResolversTypes['MapSearchResult'];
  String: ResolverTypeWrapper<Scalars['String']>;
  Theme: ResolverTypeWrapper<Theme>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CombinedDataResult: CombinedDataResult;
  CombinedMapResult: CombinedMapResult;
  CombinedResult: ResolversParentTypes['CombinedDataResult'] | ResolversParentTypes['CombinedMapResult'];
  DataResult: DataResult;
  DataSearchInput: DataSearchInput;
  DataSearchResult: DataSearchResult;
  DatasetFormats: DatasetFormats;
  DatasetResult: DatasetResult;
  DatasetSearchInput: DatasetSearchInput;
  DatasetSearchResult: DatasetSearchResult;
  DetailParams: DetailParams;
  Filter: Filter;
  FilterInput: FilterInput;
  FilterOption: FilterOption;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  LegendItem: LegendItem;
  MapCollection: MapCollection;
  MapCollectionSearchResult: MapCollectionSearchResult;
  MapGroup: Omit<MapGroup, 'legendItems'> & { legendItems?: Maybe<Array<ResolversParentTypes['MapGroupLegendItem']>> };
  MapGroupLegendItem: ResolversParentTypes['LegendItem'] | ResolversParentTypes['MapGroup'];
  MapLayerSearchResult: MapLayerSearchResult;
  MapResult: MapResult;
  MapSearchInput: MapSearchInput;
  MapSearchResult: MapSearchResult;
  Meta: Meta;
  PageInfo: PageInfo;
  Query: {};
  Results: ResolversParentTypes['CombinedDataResult'] | ResolversParentTypes['CombinedMapResult'] | ResolversParentTypes['DatasetResult'] | ResolversParentTypes['MapCollection'] | ResolversParentTypes['MapGroup'];
  SearchResult: ResolversParentTypes['DataSearchResult'] | ResolversParentTypes['DatasetSearchResult'] | ResolversParentTypes['MapCollectionSearchResult'] | ResolversParentTypes['MapLayerSearchResult'] | ResolversParentTypes['MapSearchResult'];
  String: Scalars['String'];
  Theme: Theme;
};

export type CombinedDataResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CombinedDataResult'] = ResolversParentTypes['CombinedDataResult']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  results?: Resolver<Maybe<Array<ResolversTypes['DataResult']>>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CombinedMapResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CombinedMapResult'] = ResolversParentTypes['CombinedMapResult']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['MapResult']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CombinedResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CombinedResult'] = ResolversParentTypes['CombinedResult']> = {
  __resolveType: TypeResolveFn<'CombinedDataResult' | 'CombinedMapResult', ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type DataResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataResult'] = ResolversParentTypes['DataResult']> = {
  datasetdataset?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endpoint?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subtype?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DataSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataSearchResult'] = ResolversParentTypes['DataSearchResult']> = {
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['CombinedDataResult']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DatasetFormatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatasetFormats'] = ResolversParentTypes['DatasetFormats']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DatasetResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatasetResult'] = ResolversParentTypes['DatasetResult']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  distributionTypes?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  formats?: Resolver<Array<ResolversTypes['DatasetFormats']>, ParentType, ContextType>;
  header?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  modified?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  teaser?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DatasetSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatasetSearchResult'] = ResolversParentTypes['DatasetSearchResult']> = {
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  results?: Resolver<Maybe<Array<ResolversTypes['DatasetResult']>>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DetailParamsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DetailParams'] = ResolversParentTypes['DetailParams']> = {
  datasets?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  item?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FilterResolvers<ContextType = any, ParentType extends ResolversParentTypes['Filter'] = ResolversParentTypes['Filter']> = {
  filterType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['FilterOption']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FilterOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FilterOption'] = ResolversParentTypes['FilterOption']> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LegendItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['LegendItem'] = ResolversParentTypes['LegendItem']> = {
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageRule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isVisible?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  legendIconURI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notSelectable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapCollectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapCollection'] = ResolversParentTypes['MapCollection']> = {
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mapLayers?: Resolver<Array<ResolversTypes['MapGroup']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapCollectionSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapCollectionSearchResult'] = ResolversParentTypes['MapCollectionSearchResult']> = {
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['MapCollection']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapGroup'] = ResolversParentTypes['MapGroup']> = {
  authScope?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bounds?: Resolver<Maybe<Array<Array<ResolversTypes['Float']>>>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  detailIsShape?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  detailParams?: Resolver<Maybe<ResolversTypes['DetailParams']>, ParentType, ContextType>;
  detailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  external?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageRule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  layers?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  legendIconURI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  legendItems?: Resolver<Maybe<Array<ResolversTypes['MapGroupLegendItem']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  minZoom?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  noDetail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  notSelectable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  params?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapGroupLegendItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapGroupLegendItem'] = ResolversParentTypes['MapGroupLegendItem']> = {
  __resolveType: TypeResolveFn<'LegendItem' | 'MapGroup', ParentType, ContextType>;
};

export type MapLayerSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapLayerSearchResult'] = ResolversParentTypes['MapLayerSearchResult']> = {
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['MapGroup']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapResult'] = ResolversParentTypes['MapResult']> = {
  authScope?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bounds?: Resolver<Maybe<Array<Array<ResolversTypes['Float']>>>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  detailIsShape?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  detailParams?: Resolver<Maybe<ResolversTypes['DetailParams']>, ParentType, ContextType>;
  detailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  external?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageRule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  layers?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  legendItems?: Resolver<Maybe<Array<ResolversTypes['LegendItem']>>, ParentType, ContextType>;
  mapLayers?: Resolver<Maybe<Array<ResolversTypes['MapGroup']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  minZoom?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  noDetail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  notSelectable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  params?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapSearchResult'] = ResolversParentTypes['MapSearchResult']> = {
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['CombinedMapResult']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Meta'] = ResolversParentTypes['Meta']> = {
  themes?: Resolver<Array<ResolversTypes['Theme']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  hasLimitedResults?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  dataSearch?: Resolver<Maybe<ResolversTypes['DataSearchResult']>, ParentType, ContextType, RequireFields<QueryDataSearchArgs, never>>;
  datasetSearch?: Resolver<Maybe<ResolversTypes['DatasetSearchResult']>, ParentType, ContextType, RequireFields<QueryDatasetSearchArgs, never>>;
  filters?: Resolver<Maybe<Array<Maybe<ResolversTypes['Filter']>>>, ParentType, ContextType>;
  mapCollectionSearch?: Resolver<ResolversTypes['MapCollectionSearchResult'], ParentType, ContextType, RequireFields<QueryMapCollectionSearchArgs, never>>;
  mapLayerSearch?: Resolver<ResolversTypes['MapLayerSearchResult'], ParentType, ContextType, RequireFields<QueryMapLayerSearchArgs, never>>;
  mapSearch?: Resolver<ResolversTypes['MapSearchResult'], ParentType, ContextType, RequireFields<QueryMapSearchArgs, never>>;
};

export type ResultsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Results'] = ResolversParentTypes['Results']> = {
  __resolveType: TypeResolveFn<'CombinedDataResult' | 'CombinedMapResult' | 'DatasetResult' | 'MapCollection' | 'MapGroup', ParentType, ContextType>;
};

export type SearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']> = {
  __resolveType: TypeResolveFn<'DataSearchResult' | 'DatasetSearchResult' | 'MapCollectionSearchResult' | 'MapLayerSearchResult' | 'MapSearchResult', ParentType, ContextType>;
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  results?: Resolver<Maybe<Array<ResolversTypes['Results']>>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type ThemeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Theme'] = ResolversParentTypes['Theme']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CombinedDataResult?: CombinedDataResultResolvers<ContextType>;
  CombinedMapResult?: CombinedMapResultResolvers<ContextType>;
  CombinedResult?: CombinedResultResolvers<ContextType>;
  DataResult?: DataResultResolvers<ContextType>;
  DataSearchResult?: DataSearchResultResolvers<ContextType>;
  DatasetFormats?: DatasetFormatsResolvers<ContextType>;
  DatasetResult?: DatasetResultResolvers<ContextType>;
  DatasetSearchResult?: DatasetSearchResultResolvers<ContextType>;
  DetailParams?: DetailParamsResolvers<ContextType>;
  Filter?: FilterResolvers<ContextType>;
  FilterOption?: FilterOptionResolvers<ContextType>;
  LegendItem?: LegendItemResolvers<ContextType>;
  MapCollection?: MapCollectionResolvers<ContextType>;
  MapCollectionSearchResult?: MapCollectionSearchResultResolvers<ContextType>;
  MapGroup?: MapGroupResolvers<ContextType>;
  MapGroupLegendItem?: MapGroupLegendItemResolvers<ContextType>;
  MapLayerSearchResult?: MapLayerSearchResultResolvers<ContextType>;
  MapResult?: MapResultResolvers<ContextType>;
  MapSearchResult?: MapSearchResultResolvers<ContextType>;
  Meta?: MetaResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Results?: ResultsResolvers<ContextType>;
  SearchResult?: SearchResultResolvers<ContextType>;
  Theme?: ThemeResolvers<ContextType>;
};

