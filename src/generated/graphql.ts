import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type CmsLink = {
   __typename?: 'CMSLink',
  uri: Scalars['String'],
};

export type CmsResult = {
   __typename?: 'CMSResult',
  id?: Maybe<Scalars['ID']>,
  type: Scalars['String'],
  label?: Maybe<Scalars['String']>,
  slug?: Maybe<Scalars['String']>,
  teaserImage?: Maybe<Scalars['String']>,
  coverImage?: Maybe<Scalars['String']>,
  specialType?: Maybe<Scalars['String']>,
  file?: Maybe<Scalars['String']>,
  date?: Maybe<Scalars['String']>,
  body?: Maybe<Scalars['String']>,
  intro?: Maybe<Scalars['String']>,
  teaser?: Maybe<Scalars['String']>,
  dateLocale?: Maybe<Scalars['String']>,
  link?: Maybe<CmsLink>,
};

export type CmsSearchInput = {
  limit?: Maybe<Scalars['Int']>,
  from?: Maybe<Scalars['Int']>,
  types?: Maybe<Array<Scalars['String']>>,
};

export type CmsSearchResult = SearchResult & {
   __typename?: 'CMSSearchResult',
  totalCount: Scalars['Int'],
  results: Array<CmsSearchResultType>,
  themeCount?: Maybe<Array<Maybe<CmsThemeCount>>>,
};

export type CmsSearchResultType = SearchResultType & {
   __typename?: 'CMSSearchResultType',
  count: Scalars['Int'],
  totalCount?: Maybe<Scalars['Int']>,
  type?: Maybe<Scalars['String']>,
  label?: Maybe<Scalars['String']>,
  results?: Maybe<Array<CmsResult>>,
};

export type CmsThemeCount = {
   __typename?: 'CMSThemeCount',
  key?: Maybe<Scalars['String']>,
  count?: Maybe<Scalars['Int']>,
};

export type DataResult = {
   __typename?: 'DataResult',
  id?: Maybe<Scalars['ID']>,
  type: Scalars['String'],
  label?: Maybe<Scalars['String']>,
  subtype?: Maybe<Scalars['String']>,
  dataset?: Maybe<Scalars['String']>,
};

export type DataSearchInput = {
  limit?: Maybe<Scalars['Int']>,
  from?: Maybe<Scalars['Int']>,
  types?: Maybe<Array<Scalars['String']>>,
};

export type DataSearchResult = SearchResult & {
   __typename?: 'DataSearchResult',
  totalCount: Scalars['Int'],
  results: Array<DataSearchResultType>,
};

export type DataSearchResultType = SearchResultType & {
   __typename?: 'DataSearchResultType',
  count: Scalars['Int'],
  type?: Maybe<Scalars['String']>,
  label?: Maybe<Scalars['String']>,
  results?: Maybe<Array<DataResult>>,
};

export type DatasetFilter = {
   __typename?: 'DatasetFilter',
  type: Scalars['String'],
  label: Scalars['String'],
  options: Array<DatasetFilterOptions>,
};

export type DatasetFilterOptions = {
   __typename?: 'DatasetFilterOptions',
  id: Scalars['String'],
  label: Scalars['String'],
  count: Scalars['Int'],
};

export type DatasetFormats = {
   __typename?: 'DatasetFormats',
  name: Scalars['String'],
  count: Scalars['Int'],
};

export type DatasetSearchFilter = {
  type: Scalars['String'],
  values: Array<Scalars['String']>,
};

export type DatasetSearchInput = {
  from?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  filters?: Maybe<Array<DatasetSearchFilter>>,
};

export type DatasetSearchResult = SearchResult & {
   __typename?: 'DatasetSearchResult',
  totalCount: Scalars['Int'],
  results: Array<DatasetSearchResultType>,
  filters?: Maybe<Array<DatasetFilter>>,
};

export type DatasetSearchResultType = {
   __typename?: 'DatasetSearchResultType',
  header: Scalars['String'],
  description: Scalars['String'],
  modified: Scalars['String'],
  tags: Array<Scalars['String']>,
  id: Scalars['String'],
  formats: Array<DatasetFormats>,
};

export type Query = {
   __typename?: 'Query',
  dataSearch?: Maybe<DataSearchResult>,
  datasetSearch?: Maybe<DatasetSearchResult>,
  cmsSearch?: Maybe<CmsSearchResult>,
};


export type QueryDataSearchArgs = {
  q: Scalars['String'],
  input: DataSearchInput
};


export type QueryDatasetSearchArgs = {
  q: Scalars['String'],
  input: DatasetSearchInput
};


export type QueryCmsSearchArgs = {
  q: Scalars['String'],
  input: CmsSearchInput
};

export type Results = DatasetSearchResultType | CmsSearchResultType | DataSearchResultType;

export type SearchResult = {
  totalCount: Scalars['Int'],
  results: Array<Results>,
};

export type SearchResultType = {
  count: Scalars['Int'],
  type?: Maybe<Scalars['String']>,
  label?: Maybe<Scalars['String']>,
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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
) => Maybe<TTypes>;

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
  Query: ResolverTypeWrapper<{}>,
  String: ResolverTypeWrapper<Scalars['String']>,
  DataSearchInput: DataSearchInput,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  DataSearchResult: ResolverTypeWrapper<DataSearchResult>,
  SearchResult: ResolverTypeWrapper<Omit<SearchResult, 'results'> & { results: Array<ResolversTypes['Results']> }>,
  Results: ResolversTypes['DatasetSearchResultType'] | ResolversTypes['CMSSearchResultType'] | ResolversTypes['DataSearchResultType'],
  DatasetSearchResultType: ResolverTypeWrapper<DatasetSearchResultType>,
  DatasetFormats: ResolverTypeWrapper<DatasetFormats>,
  CMSSearchResultType: ResolverTypeWrapper<CmsSearchResultType>,
  SearchResultType: ResolverTypeWrapper<SearchResultType>,
  CMSResult: ResolverTypeWrapper<CmsResult>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  CMSLink: ResolverTypeWrapper<CmsLink>,
  DataSearchResultType: ResolverTypeWrapper<DataSearchResultType>,
  DataResult: ResolverTypeWrapper<DataResult>,
  DatasetSearchInput: DatasetSearchInput,
  DatasetSearchFilter: DatasetSearchFilter,
  DatasetSearchResult: ResolverTypeWrapper<DatasetSearchResult>,
  DatasetFilter: ResolverTypeWrapper<DatasetFilter>,
  DatasetFilterOptions: ResolverTypeWrapper<DatasetFilterOptions>,
  CMSSearchInput: CmsSearchInput,
  CMSSearchResult: ResolverTypeWrapper<CmsSearchResult>,
  CMSThemeCount: ResolverTypeWrapper<CmsThemeCount>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  String: Scalars['String'],
  DataSearchInput: DataSearchInput,
  Int: Scalars['Int'],
  DataSearchResult: DataSearchResult,
  SearchResult: Omit<SearchResult, 'results'> & { results: Array<ResolversParentTypes['Results']> },
  Results: ResolversParentTypes['DatasetSearchResultType'] | ResolversParentTypes['CMSSearchResultType'] | ResolversParentTypes['DataSearchResultType'],
  DatasetSearchResultType: DatasetSearchResultType,
  DatasetFormats: DatasetFormats,
  CMSSearchResultType: CmsSearchResultType,
  SearchResultType: SearchResultType,
  CMSResult: CmsResult,
  ID: Scalars['ID'],
  CMSLink: CmsLink,
  DataSearchResultType: DataSearchResultType,
  DataResult: DataResult,
  DatasetSearchInput: DatasetSearchInput,
  DatasetSearchFilter: DatasetSearchFilter,
  DatasetSearchResult: DatasetSearchResult,
  DatasetFilter: DatasetFilter,
  DatasetFilterOptions: DatasetFilterOptions,
  CMSSearchInput: CmsSearchInput,
  CMSSearchResult: CmsSearchResult,
  CMSThemeCount: CmsThemeCount,
  Boolean: Scalars['Boolean'],
};

export type CmsLinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['CMSLink'] = ResolversParentTypes['CMSLink']> = {
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type CmsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CMSResult'] = ResolversParentTypes['CMSResult']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>,
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  teaserImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  coverImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  specialType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  file?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  intro?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  teaser?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  dateLocale?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  link?: Resolver<Maybe<ResolversTypes['CMSLink']>, ParentType, ContextType>,
};

export type CmsSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CMSSearchResult'] = ResolversParentTypes['CMSSearchResult']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  results?: Resolver<Array<ResolversTypes['CMSSearchResultType']>, ParentType, ContextType>,
  themeCount?: Resolver<Maybe<Array<Maybe<ResolversTypes['CMSThemeCount']>>>, ParentType, ContextType>,
};

export type CmsSearchResultTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CMSSearchResultType'] = ResolversParentTypes['CMSSearchResultType']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  totalCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  results?: Resolver<Maybe<Array<ResolversTypes['CMSResult']>>, ParentType, ContextType>,
};

export type CmsThemeCountResolvers<ContextType = any, ParentType extends ResolversParentTypes['CMSThemeCount'] = ResolversParentTypes['CMSThemeCount']> = {
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
};

export type DataResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataResult'] = ResolversParentTypes['DataResult']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>,
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  subtype?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  dataset?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type DataSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataSearchResult'] = ResolversParentTypes['DataSearchResult']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  results?: Resolver<Array<ResolversTypes['DataSearchResultType']>, ParentType, ContextType>,
};

export type DataSearchResultTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataSearchResultType'] = ResolversParentTypes['DataSearchResultType']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  results?: Resolver<Maybe<Array<ResolversTypes['DataResult']>>, ParentType, ContextType>,
};

export type DatasetFilterResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatasetFilter'] = ResolversParentTypes['DatasetFilter']> = {
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  options?: Resolver<Array<ResolversTypes['DatasetFilterOptions']>, ParentType, ContextType>,
};

export type DatasetFilterOptionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatasetFilterOptions'] = ResolversParentTypes['DatasetFilterOptions']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type DatasetFormatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatasetFormats'] = ResolversParentTypes['DatasetFormats']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type DatasetSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatasetSearchResult'] = ResolversParentTypes['DatasetSearchResult']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  results?: Resolver<Array<ResolversTypes['DatasetSearchResultType']>, ParentType, ContextType>,
  filters?: Resolver<Maybe<Array<ResolversTypes['DatasetFilter']>>, ParentType, ContextType>,
};

export type DatasetSearchResultTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatasetSearchResultType'] = ResolversParentTypes['DatasetSearchResultType']> = {
  header?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  modified?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>,
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  formats?: Resolver<Array<ResolversTypes['DatasetFormats']>, ParentType, ContextType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  dataSearch?: Resolver<Maybe<ResolversTypes['DataSearchResult']>, ParentType, ContextType, RequireFields<QueryDataSearchArgs, 'q' | 'input'>>,
  datasetSearch?: Resolver<Maybe<ResolversTypes['DatasetSearchResult']>, ParentType, ContextType, RequireFields<QueryDatasetSearchArgs, 'q' | 'input'>>,
  cmsSearch?: Resolver<Maybe<ResolversTypes['CMSSearchResult']>, ParentType, ContextType, RequireFields<QueryCmsSearchArgs, 'q' | 'input'>>,
};

export type ResultsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Results'] = ResolversParentTypes['Results']> = {
  __resolveType: TypeResolveFn<'DatasetSearchResultType' | 'CMSSearchResultType' | 'DataSearchResultType', ParentType, ContextType>
};

export type SearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']> = {
  __resolveType: TypeResolveFn<'DataSearchResult' | 'DatasetSearchResult' | 'CMSSearchResult', ParentType, ContextType>,
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  results?: Resolver<Array<ResolversTypes['Results']>, ParentType, ContextType>,
};

export type SearchResultTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResultType'] = ResolversParentTypes['SearchResultType']> = {
  __resolveType: TypeResolveFn<'CMSSearchResultType' | 'DataSearchResultType', ParentType, ContextType>,
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  CMSLink?: CmsLinkResolvers<ContextType>,
  CMSResult?: CmsResultResolvers<ContextType>,
  CMSSearchResult?: CmsSearchResultResolvers<ContextType>,
  CMSSearchResultType?: CmsSearchResultTypeResolvers<ContextType>,
  CMSThemeCount?: CmsThemeCountResolvers<ContextType>,
  DataResult?: DataResultResolvers<ContextType>,
  DataSearchResult?: DataSearchResultResolvers<ContextType>,
  DataSearchResultType?: DataSearchResultTypeResolvers<ContextType>,
  DatasetFilter?: DatasetFilterResolvers<ContextType>,
  DatasetFilterOptions?: DatasetFilterOptionsResolvers<ContextType>,
  DatasetFormats?: DatasetFormatsResolvers<ContextType>,
  DatasetSearchResult?: DatasetSearchResultResolvers<ContextType>,
  DatasetSearchResultType?: DatasetSearchResultTypeResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Results?: ResultsResolvers,
  SearchResult?: SearchResultResolvers,
  SearchResultType?: SearchResultTypeResolvers,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
