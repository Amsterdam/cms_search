import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
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

export type CmsResult = Result & {
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
  dateLocale?: Maybe<Scalars['String']>,
  link?: Maybe<CmsLink>,
};

export type CmsSearchResult = SearchResult & {
   __typename?: 'CMSSearchResult',
  totalCount: Scalars['Int'],
  results: Array<CmsSearchResultType>,
};

export type CmsSearchResultType = SearchResultType & {
   __typename?: 'CMSSearchResultType',
  count: Scalars['Int'],
  type?: Maybe<Scalars['String']>,
  label?: Maybe<Scalars['String']>,
  results?: Maybe<Array<CmsResult>>,
};

export type DataResult = Result & {
   __typename?: 'DataResult',
  id?: Maybe<Scalars['ID']>,
  type: Scalars['String'],
  label?: Maybe<Scalars['String']>,
  subtype?: Maybe<Scalars['String']>,
  dataset?: Maybe<Scalars['String']>,
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

export type Query = {
   __typename?: 'Query',
  dataSearch?: Maybe<DataSearchResult>,
  cmsSearch?: Maybe<CmsSearchResult>,
};


export type QueryDataSearchArgs = {
  q: Scalars['String'],
  input: SearchInput
};


export type QueryCmsSearchArgs = {
  q: Scalars['String'],
  input: SearchInput
};

export type Result = {
  id?: Maybe<Scalars['ID']>,
  type: Scalars['String'],
  label?: Maybe<Scalars['String']>,
};

export type SearchInput = {
  limit?: Maybe<Scalars['Int']>,
  from?: Maybe<Scalars['Int']>,
  types?: Maybe<Array<Scalars['String']>>,
};

export type SearchResult = {
  totalCount: Scalars['Int'],
  results: Array<SearchResultType>,
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
  SearchInput: SearchInput,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  DataSearchResult: ResolverTypeWrapper<DataSearchResult>,
  SearchResult: ResolverTypeWrapper<SearchResult>,
  SearchResultType: ResolverTypeWrapper<SearchResultType>,
  DataSearchResultType: ResolverTypeWrapper<DataSearchResultType>,
  DataResult: ResolverTypeWrapper<DataResult>,
  Result: ResolverTypeWrapper<Result>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  CMSSearchResult: ResolverTypeWrapper<CmsSearchResult>,
  CMSSearchResultType: ResolverTypeWrapper<CmsSearchResultType>,
  CMSResult: ResolverTypeWrapper<CmsResult>,
  CMSLink: ResolverTypeWrapper<CmsLink>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  String: Scalars['String'],
  SearchInput: SearchInput,
  Int: Scalars['Int'],
  DataSearchResult: DataSearchResult,
  SearchResult: SearchResult,
  SearchResultType: SearchResultType,
  DataSearchResultType: DataSearchResultType,
  DataResult: DataResult,
  Result: Result,
  ID: Scalars['ID'],
  CMSSearchResult: CmsSearchResult,
  CMSSearchResultType: CmsSearchResultType,
  CMSResult: CmsResult,
  CMSLink: CmsLink,
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
  dateLocale?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  link?: Resolver<Maybe<ResolversTypes['CMSLink']>, ParentType, ContextType>,
};

export type CmsSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CMSSearchResult'] = ResolversParentTypes['CMSSearchResult']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  results?: Resolver<Array<ResolversTypes['CMSSearchResultType']>, ParentType, ContextType>,
};

export type CmsSearchResultTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CMSSearchResultType'] = ResolversParentTypes['CMSSearchResultType']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  results?: Resolver<Maybe<Array<ResolversTypes['CMSResult']>>, ParentType, ContextType>,
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

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  dataSearch?: Resolver<Maybe<ResolversTypes['DataSearchResult']>, ParentType, ContextType, RequireFields<QueryDataSearchArgs, 'q' | 'input'>>,
  cmsSearch?: Resolver<Maybe<ResolversTypes['CMSSearchResult']>, ParentType, ContextType, RequireFields<QueryCmsSearchArgs, 'q' | 'input'>>,
};

export type ResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['Result'] = ResolversParentTypes['Result']> = {
  __resolveType: TypeResolveFn<'DataResult' | 'CMSResult', ParentType, ContextType>,
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>,
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type SearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']> = {
  __resolveType: TypeResolveFn<'DataSearchResult' | 'CMSSearchResult', ParentType, ContextType>,
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  results?: Resolver<Array<ResolversTypes['SearchResultType']>, ParentType, ContextType>,
};

export type SearchResultTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResultType'] = ResolversParentTypes['SearchResultType']> = {
  __resolveType: TypeResolveFn<'DataSearchResultType' | 'CMSSearchResultType', ParentType, ContextType>,
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  CMSLink?: CmsLinkResolvers<ContextType>,
  CMSResult?: CmsResultResolvers<ContextType>,
  CMSSearchResult?: CmsSearchResultResolvers<ContextType>,
  CMSSearchResultType?: CmsSearchResultTypeResolvers<ContextType>,
  DataResult?: DataResultResolvers<ContextType>,
  DataSearchResult?: DataSearchResultResolvers<ContextType>,
  DataSearchResultType?: DataSearchResultTypeResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Result?: ResultResolvers,
  SearchResult?: SearchResultResolvers,
  SearchResultType?: SearchResultTypeResolvers,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
