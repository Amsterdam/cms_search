require('dotenv').config()

import * as Sentry from '@sentry/node'
import { PORT, URL_PREFIX } from './config'
import express from 'express'
import expressPlayground from 'graphql-playground-middleware-express'
import cors from 'cors'
import GraphQLMiddleware from './graphql'
import TypeAheadMiddleWare from './typeahead'

Sentry.init({ dsn: process.env.SENTRY_DSN })

const app = express()

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler())

app.use(cors())

// Health check
app.get('/metrics', (req, res) => res.send('Working!')) // Internal
app.get(`${URL_PREFIX}/health`, (req, res) => res.send('Working!')) // External

// GraphQL
app.use(`${URL_PREFIX}/graphql`, GraphQLMiddleware)
app.get(`${URL_PREFIX}/playground`, expressPlayground({ endpoint: `${URL_PREFIX}/graphql` }))

// TypeAhead
app.get(`${URL_PREFIX}/typeahead`, TypeAheadMiddleWare)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.listen(PORT)

console.log(`Running a GraphQL API server at localhost:${PORT}`)
