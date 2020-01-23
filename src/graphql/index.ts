import graphqlHTTP from 'express-graphql'
import resolvers from './resolvers'
import typeDefs from './graphql.schema'
import { makeExecutableSchema } from 'graphql-tools'
import loadData from './resolvers/search/data/loaders'

export type Context = {
  token: string
  loaders: Object
}

// Create a context for holding contextual data
const context = async (req: any): Promise<Context> => {
  const { authorization: token } = req.headers

  return {
    token,
    loaders: {
      loadData,
    },
  }
}

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
  context: () => context(req),
}))
