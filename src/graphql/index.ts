import graphqlHTTP from 'express-graphql'
import resolvers from './resolvers'
import typeDefs from './graphql.schema'
import { makeExecutableSchema } from 'graphql-tools'

export type Context = {
  token: any
}

// Create a context for holding contextual data
const context = async (req: any): Promise<Context> => {
  const { authorization: token } = req.headers

  return {
    token,
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
  // rootValue: resolvers,
  context: () => context(req),
}))
