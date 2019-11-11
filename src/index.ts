require('dotenv').config()

import express from 'express'
import expressPlayground from 'graphql-playground-middleware-express'
import cors from 'cors'
import ApiElasticSearchClient from './es'
import GraphQLMiddleware from './graphql'

const app = express()

const PORT = 8080
const URL_PREFIX = '/cms_search'

app.use(cors())

// Health check
app.get('/metrics', (req, res) => res.send('Working!'))

// GraphQL
app.use(`${URL_PREFIX}/graphql`, GraphQLMiddleware)
app.get(`${URL_PREFIX}/playground`, expressPlayground({ endpoint: `${URL_PREFIX}/playground` }))

// Elastic Search
app.get(`${URL_PREFIX}/search`, ApiElasticSearchClient)

app.listen(PORT)

console.log(`Running a GraphQL API server at localhost:${PORT}`)
