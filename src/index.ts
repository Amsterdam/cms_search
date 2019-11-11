require('dotenv').config()

import { PORT, URL_PREFIX } from './config'
import express from 'express'
import expressPlayground from 'graphql-playground-middleware-express'
import cors from 'cors'
import ApiElasticSearchClient from './es'
import GraphQLMiddleware from './graphql'

const app = express()

app.use(cors())

// Health check
app.get('/metrics', (req, res) => res.send(`Working! ${process.env.ELASTIC_HOST}`))

// GraphQL
app.use(`${URL_PREFIX}/graphql`, GraphQLMiddleware)
app.get(`${URL_PREFIX}/playground`, expressPlayground({ endpoint: `${URL_PREFIX}/graphql` }))

// Elastic Search
app.get(`${URL_PREFIX}/search`, ApiElasticSearchClient)

app.listen(PORT)

console.log(`Running a GraphQL API server at localhost:${PORT}`)
