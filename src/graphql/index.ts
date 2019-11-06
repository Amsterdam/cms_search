import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import resolvers from './resolvers'
import typeDefs from './graphql.schema'

const schema = buildSchema(`
  ${typeDefs}
`)

export default graphqlHTTP({
  schema,
  rootValue: resolvers,
})
