require('dotenv').config()

import { PORT, URL_PREFIX } from './config'
import express from 'express'
import expressPlayground from 'graphql-playground-middleware-express'
import cors from 'cors'
import ElasticSearchMiddelware from './es'
import GraphQLMiddleware from './graphql'
import TypeAheadMiddleWare from './typeahead'

const app = express()

app.use(cors())

// Health check
app.get('/metrics', (req, res) => res.send('Working!'))

// GraphQL
app.use(`${URL_PREFIX}/graphql`, GraphQLMiddleware)
app.get(`${URL_PREFIX}/playground`, expressPlayground({ endpoint: `${URL_PREFIX}/graphql` }))

// Elastic Search
app.get(`${URL_PREFIX}/search`, ElasticSearchMiddelware)

// TypeAhead
app.get(`${URL_PREFIX}/typeahead`, TypeAheadMiddleWare)

app.listen(PORT)

console.log(`Running a GraphQL API server at localhost:${PORT}`)
