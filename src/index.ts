/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

import * as Sentry from '@sentry/node'
import express from 'express'
import expressPlayground from 'graphql-playground-middleware-express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { PORT, URL_PREFIX } from './config'
import GraphQLMiddleware from './graphql'
import TypeAheadMiddleWare from './typeahead'

// For now, it's faster to add rate limiting on express level instead of adding nginx and configuring the Jenkinsfile properly,
// as we will need the assistance of team Basis.
// In the future we should add nginx because it's faster and better at handling things like rate-limiting

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 50 requests per windowMs
})

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT,
})

const app = express()

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler())

app.use(cors())
app.use(limiter)

// Health check
app.get('/metrics', (req, res) => res.send('Working!')) // Internal
app.get(`${URL_PREFIX}/health`, (req, res) => res.send('Working!')) // External

// GraphQL
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use(`${URL_PREFIX}/graphql`, GraphQLMiddleware)
app.get(`${URL_PREFIX}/playground`, expressPlayground({ endpoint: `${URL_PREFIX}/graphql` }))

// TypeAhead
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get(`${URL_PREFIX}/typeahead`, TypeAheadMiddleWare)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.listen(PORT)

// eslint-disable-next-line no-console
console.log(`Running a GraphQL API server at localhost:${PORT}`)
