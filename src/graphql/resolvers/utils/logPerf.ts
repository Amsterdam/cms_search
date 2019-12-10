import * as Sentry from '@sentry/node'

const { performance } = require('perf_hooks')

export default async (name: any, promise: any) => {
  return new Promise((resolve, reject) => {
    try {
      Sentry.configureScope(async scope => {
        const t0: number = performance.now()
        scope.setExtra('apiName', name)

        Sentry.captureMessage(`Performance ${name}...`)
        const p = await promise.then((res: any) => res.json())
        const t1: number = performance.now()

        scope.setTag('performance', `${Math.round((t1 - t0) / 10) * 10}`)

        resolve(p)
      })
    } catch (e) {
      return reject(e)
    }
  })
}
