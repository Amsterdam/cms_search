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

export type DataSearchInput = {
  limit?: Maybe<Scalars['Int']>,
  types?: Maybe<Array<Scalars['String']>>,
};

export type DataSearchResult = {
   __typename?: 'DataSearchResult',
  totalCount: Scalars['Int'],
  results: Array<SearchResultType>,
};

export type Query = {
   __typename?: 'Query',
  dataSearch?: Maybe<DataSearchResult>,
};


export type QueryDataSearchArgs = {
  q: Scalars['String'],
  input: DataSearchInput
};

export type SearchResult = {
   __typename?: 'SearchResult',
  id?: Maybe<Scalars['ID']>,
  type: Scalars['String'],
  label?: Maybe<Scalars['String']>,
  directLink?: Maybe<Scalars['String']>,
};

export type SearchResultType = {
   __typename?: 'SearchResultType',
  count: Scalars['Int'],
  type?: Maybe<Scalars['String']>,
  label?: Maybe<Scalars['String']>,
  results?: Maybe<Array<SearchResult>>,
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
  SearchResultType: ResolverTypeWrapper<SearchResultType>,
  SearchResult: ResolverTypeWrapper<SearchResult>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  String: Scalars['String'],
  DataSearchInput: DataSearchInput,
  Int: Scalars['Int'],
  DataSearchResult: DataSearchResult,
  SearchResultType: SearchResultType,
  SearchResult: SearchResult,
  ID: Scalars['ID'],
  Boolean: Scalars['Boolean'],
};

export type DataSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataSearchResult'] = ResolversParentTypes['DataSearchResult']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  results?: Resolver<Array<ResolversTypes['SearchResultType']>, ParentType, ContextType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  dataSearch?: Resolver<Maybe<ResolversTypes['DataSearchResult']>, ParentType, ContextType, RequireFields<QueryDataSearchArgs, 'q' | 'input'>>,
};

export type SearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>,
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  directLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type SearchResultTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResultType'] = ResolversParentTypes['SearchResultType']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  results?: Resolver<Maybe<Array<ResolversTypes['SearchResult']>>, ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  DataSearchResult?: DataSearchResultResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  SearchResult?: SearchResultResolvers<ContextType>,
  SearchResultType?: SearchResultTypeResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
