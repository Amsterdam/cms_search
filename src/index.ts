require('dotenv').config()

import express from 'express'
import graphqlHTTP from 'express-graphql'
import expressPlayground from 'graphql-playground-middleware-express'
import { buildSchema } from 'graphql'
import cors from 'cors'
import dataSearchResolvers from './data-search/resolvers'
import dataSearchSchema from './data-search/schema'

const app = express()

app.use(cors())

const schema = buildSchema(`
  input DataSearchInput {
    limit: Int
    types: [String!]
  }
  type Query {
    dataSearch(q: String!, input: DataSearchInput!): DataSearchResult
  }
  ${dataSearchSchema}
`)

const resolvers = {
  ...dataSearchResolvers,
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: resolvers,
  }),
)

app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000')
