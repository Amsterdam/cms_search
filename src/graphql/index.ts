import { graphqlHTTP } from 'express-graphql'
import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './graphql.schema'
import resolvers from './search'
import createDataLoader from './utils/createDataLoader'

const schema = `
  ${typeDefs}
`

export default graphqlHTTP((req) => ({
  schema: makeExecutableSchema({
    typeDefs: schema,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
      requireResolversForArgs: false,
    },
  }),
  context: {
    // Create a context for holding contextual data
    loaders: {
      cms: createDataLoader(''),
      data: createDataLoader(req.headers.authorization || ''),
      datasets: createDataLoader(''),
    },
  },
}))
