/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

import * as Sentry from '@sentry/node'
import { isDevelopment } from './utils/environment'
import express from 'express'
import expressPlayground from 'graphql-playground-middleware-express'
import cors from 'cors'
import { isDevelopment } from './utils/environment'
import { PORT, URL_PREFIX } from './config'
import GraphQLMiddleware from './graphql'
import TypeAheadMiddleWare from './typeahead'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT,
})

const app = express()

const allowedDomains = ['https://acc.data.amsterdam.nl', 'https://data.amsterdam.nl']

// Far from perfect but it will do the trick for now.
// Data-verkenner is usually running on port 3000
// Need to refactor if cms_search will be merged in the data-verkenner repo
if (isDevelopment) {
  allowedDomains.push('http://localhost:3000')
}

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler())

app.use(
  cors((req, callback) => {
    const originHeader = req?.header('Origin')

    callback(null, { origin: originHeader && allowedDomains.indexOf(originHeader) !== -1 })
  }),
)

// Health check
app.get('/metrics', (req, res) => res.send('Working!')) // Internal
app.get(`${URL_PREFIX}/health`, (req, res) => res.send('Working!')) // External

// GraphQL
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use(`${URL_PREFIX}/graphql`, GraphQLMiddleware)

// graphql-playground-middleware-express uses a CDN - jsdelivr.com to serve its assets so don't serve on production
if (process.env.SENTRY_ENVIRONMENT !== 'production') {
  app.get(`${URL_PREFIX}/playground`, expressPlayground({ endpoint: `${URL_PREFIX}/graphql` }))
}

// TypeAhead
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get(`${URL_PREFIX}/typeahead`, TypeAheadMiddleWare)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.listen(PORT)

// eslint-disable-next-line no-console
console.log(`Running a GraphQL API server at localhost:${PORT}`)
