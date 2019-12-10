require('dotenv').config()
import * as Sentry from '@sentry/node'
import { PORT, URL_PREFIX } from './config'
import express from 'express'
import expressPlayground from 'graphql-playground-middleware-express'
import cors from 'cors'
import GraphQLMiddleware from './graphql'
import TypeAheadMiddleWare from './typeahead'

Sentry.init({
  dsn: 'https://bedcc5aa7d5b44e89893be96e95dbcc8@sentry.data.amsterdam.nl/37',
})

const app = express()

app.use(cors())

// Health check
app.get('/metrics', (req, res) => res.send('Working!'))

// GraphQL
app.use(`${URL_PREFIX}/graphql`, GraphQLMiddleware)
app.get(`${URL_PREFIX}/playground`, expressPlayground({ endpoint: `${URL_PREFIX}/graphql` }))

// TypeAhead
app.get(`${URL_PREFIX}/typeahead`, TypeAheadMiddleWare)

app.listen(PORT)

console.log(`Running a GraphQL API server at localhost:${PORT}`)
