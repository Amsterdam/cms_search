import * as Sentry from '@sentry/node'

const { performance } = require('perf_hooks')

export default async (name: string, url: string, promise: any) =>
  new Promise((resolve, reject) => {
    try {
      Sentry.configureScope(async scope => {
        const t0: number = performance.now()
        scope.setExtra('apiUrl', url)

        Sentry.captureMessage(`Performance ${name}...`)
        const p = await promise.then((r: any) => r.body)
        const t1: number = performance.now()

        scope.setTag('performance', `${Math.round((t1 - t0) / 10) * 10}`)

        resolve(p)
      })
    } catch (e) {
      return reject(e)
    }
  })
