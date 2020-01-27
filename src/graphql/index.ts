import graphqlHTTP from 'express-graphql'
import resolvers from './search'
import typeDefs from './graphql.schema'
import { makeExecutableSchema } from 'graphql-tools'
import { createDataLoader } from './search/data/dataloader'

const schema = `
  ${typeDefs}
`

export default graphqlHTTP(async req => ({
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
      data: createDataLoader(req.headers.authorization || ''),
    },
  },
}))
