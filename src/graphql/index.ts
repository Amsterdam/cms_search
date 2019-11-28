import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import resolvers from './resolvers'
import typeDefs from './graphql.schema'

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

const schema = buildSchema(`
  ${typeDefs}
`)

export default graphqlHTTP(async req => ({
  schema,
  rootValue: resolvers,
  context: () => context(req),
}))
