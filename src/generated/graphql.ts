import { GraphQLResolveInfo } from 'graphql'
export type Maybe<T> = T | null
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
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

export type CmsSearchInput = {
  limit?: Maybe<Scalars['Int']>
  from?: Maybe<Scalars['Int']>
  types?: Maybe<Array<Scalars['String']>>
  filters?: Maybe<Array<FilterInput>>
}

export type CmsSearchResult = SearchResult & {
  __typename?: 'CMSSearchResult'
  totalCount: Scalars['Int']
  results: Array<CmsSearchResultType>
  filters?: Maybe<Array<Filter>>
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
  from?: Maybe<Scalars['Int']>
  types?: Maybe<Array<Scalars['String']>>
}

export type DataSearchResult = SearchResult & {
  __typename?: 'DataSearchResult'
  totalCount: Scalars['Int']
  results: Array<DataSearchResultType>
  filters?: Maybe<Array<Filter>>
}

export type DataSearchResultType = SearchResultType & {
  __typename?: 'DataSearchResultType'
  count: Scalars['Int']
  type?: Maybe<Scalars['String']>
  label?: Maybe<Scalars['String']>
  results?: Maybe<Array<DataResult>>
}

export type DatasetFiltersResult = {
  __typename?: 'DatasetFiltersResult'
  filters?: Maybe<Array<Filter>>
}

export type DatasetFormats = {
  __typename?: 'DatasetFormats'
  name: Scalars['String']
  count: Scalars['Int']
}

export type DatasetSearchInput = {
  from?: Maybe<Scalars['Int']>
  limit?: Maybe<Scalars['Int']>
  filters?: Maybe<Array<FilterInput>>
}

export type DatasetSearchResult = SearchResult & {
  __typename?: 'DatasetSearchResult'
  totalCount: Scalars['Int']
  results: Array<DatasetSearchResultType>
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
  options: Array<FilterOptions>
  filterType?: Maybe<Scalars['String']>
}

export type FilterInput = {
  type: Scalars['String']
  multiSelect: Scalars['Boolean']
  values: Array<Scalars['String']>
}

export type FilterOptions = {
  __typename?: 'FilterOptions'
  id: Scalars['String']
  label: Scalars['String']
  enumType?: Maybe<Scalars['String']>
  count: Scalars['Int']
}

export type Query = {
  __typename?: 'Query'
  articleSearch?: Maybe<CmsSearchResult>
  dataSearch?: Maybe<DataSearchResult>
  datasetSearch?: Maybe<DatasetSearchResult>
  publicationSearch?: Maybe<CmsSearchResult>
  specialSearch?: Maybe<CmsSearchResult>
  getDatasetFilters?: Maybe<DatasetFiltersResult>
}

export type QueryArticleSearchArgs = {
  q: Scalars['String']
  input: CmsSearchInput
}

export type QueryDataSearchArgs = {
  q: Scalars['String']
  input: DataSearchInput
}

export type QueryDatasetSearchArgs = {
  q: Scalars['String']
  input: DatasetSearchInput
}

export type QueryPublicationSearchArgs = {
  q: Scalars['String']
  input: CmsSearchInput
}

export type QuerySpecialSearchArgs = {
  q: Scalars['String']
  input: CmsSearchInput
}

export type QueryGetDatasetFiltersArgs = {
  q: Scalars['String']
}

export type Results = DatasetSearchResultType | CmsSearchResultType | DataSearchResultType

export type SearchResult = {
  totalCount: Scalars['Int']
  results: Array<Results>
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  CMSSearchResult: ResolverTypeWrapper<CmsSearchResult>
  SearchResult: ResolverTypeWrapper<
    Omit<SearchResult, 'results'> & { results: Array<ResolversTypes['Results']> }
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
  DataSearchInput: DataSearchInput
  DataSearchResult: ResolverTypeWrapper<DataSearchResult>
  DatasetSearchInput: DatasetSearchInput
  DatasetSearchResult: ResolverTypeWrapper<DatasetSearchResult>
  DatasetFiltersResult: ResolverTypeWrapper<DatasetFiltersResult>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {}
  String: Scalars['String']
  CMSSearchInput: CmsSearchInput
  Int: Scalars['Int']
  FilterInput: FilterInput
  Boolean: Scalars['Boolean']
  CMSSearchResult: CmsSearchResult
  SearchResult: Omit<SearchResult, 'results'> & { results: Array<ResolversParentTypes['Results']> }
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
  DataSearchInput: DataSearchInput
  DataSearchResult: DataSearchResult
  DatasetSearchInput: DatasetSearchInput
  DatasetSearchResult: DatasetSearchResult
  DatasetFiltersResult: DatasetFiltersResult
}

export type CmsLinkResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CMSLink'] = ResolversParentTypes['CMSLink']
> = {
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}

export type CmsSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CMSSearchResult'] = ResolversParentTypes['CMSSearchResult']
> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  results?: Resolver<Array<ResolversTypes['CMSSearchResultType']>, ParentType, ContextType>
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
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
}

export type DataSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DataSearchResult'] = ResolversParentTypes['DataSearchResult']
> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  results?: Resolver<Array<ResolversTypes['DataSearchResultType']>, ParentType, ContextType>
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
}

export type DataSearchResultTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DataSearchResultType'] = ResolversParentTypes['DataSearchResultType']
> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  results?: Resolver<Maybe<Array<ResolversTypes['DataResult']>>, ParentType, ContextType>
}

export type DatasetFiltersResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DatasetFiltersResult'] = ResolversParentTypes['DatasetFiltersResult']
> = {
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>
}

export type DatasetFormatsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DatasetFormats'] = ResolversParentTypes['DatasetFormats']
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
}

export type DatasetSearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DatasetSearchResult'] = ResolversParentTypes['DatasetSearchResult']
> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  results?: Resolver<Array<ResolversTypes['DatasetSearchResultType']>, ParentType, ContextType>
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
}

export type FilterResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Filter'] = ResolversParentTypes['Filter']
> = {
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  options?: Resolver<Array<ResolversTypes['FilterOptions']>, ParentType, ContextType>
  filterType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
}

export type FilterOptionsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FilterOptions'] = ResolversParentTypes['FilterOptions']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  enumType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  articleSearch?: Resolver<
    Maybe<ResolversTypes['CMSSearchResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryArticleSearchArgs, 'q' | 'input'>
  >
  dataSearch?: Resolver<
    Maybe<ResolversTypes['DataSearchResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryDataSearchArgs, 'q' | 'input'>
  >
  datasetSearch?: Resolver<
    Maybe<ResolversTypes['DatasetSearchResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryDatasetSearchArgs, 'q' | 'input'>
  >
  publicationSearch?: Resolver<
    Maybe<ResolversTypes['CMSSearchResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryPublicationSearchArgs, 'q' | 'input'>
  >
  specialSearch?: Resolver<
    Maybe<ResolversTypes['CMSSearchResult']>,
    ParentType,
    ContextType,
    RequireFields<QuerySpecialSearchArgs, 'q' | 'input'>
  >
  getDatasetFilters?: Resolver<
    Maybe<ResolversTypes['DatasetFiltersResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetDatasetFiltersArgs, 'q'>
  >
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
  results?: Resolver<Array<ResolversTypes['Results']>, ParentType, ContextType>
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
  DatasetFiltersResult?: DatasetFiltersResultResolvers<ContextType>
  DatasetFormats?: DatasetFormatsResolvers<ContextType>
  DatasetSearchResult?: DatasetSearchResultResolvers<ContextType>
  DatasetSearchResultType?: DatasetSearchResultTypeResolvers<ContextType>
  Filter?: FilterResolvers<ContextType>
  FilterOptions?: FilterOptionsResolvers<ContextType>
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
