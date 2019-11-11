require('dotenv').config()

import express from 'express'
import expressPlayground from 'graphql-playground-middleware-express'
import cors from 'cors'
import ApiElasticSearchClient from './es'
import GraphQLMiddleware from './graphql'

const app = express()

const PORT = 8080

app.use(cors())

app.use('/cms_search/graphql', GraphQLMiddleware)

// Health check
app.use('/metrics', (req, res) => res.send('Working!'))

app.get('/cms_search/search', ApiElasticSearchClient)

app.get('/cms_search/playground', expressPlayground({ endpoint: '/graphql' }))

app.listen(PORT)
console.log(`Running a GraphQL API server at localhost:${PORT}`)
