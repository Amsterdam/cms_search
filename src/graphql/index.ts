import { graphqlHTTP } from 'express-graphql'
import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './graphql.schema'
import resolvers from './search'
import createDataLoader from './utils/createDataLoader'

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const schema = `${typeDefs}`

const GraphQLMiddleware = graphqlHTTP((req) => ({
  schema: makeExecutableSchema({
    typeDefs: schema,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: 'ignore',
      requireResolversForArgs: 'ignore',
    },
  }),
  context: {
    // Create a context for holding contextual data
    loaders: {
      cms: createDataLoader(''),
      data: createDataLoader(req.headers.authorization || ''),
      datasets: createDataLoader(''),
      openAPI: createDataLoader(''),
    },
  },
}))

export default GraphQLMiddleware
