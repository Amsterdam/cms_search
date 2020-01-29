import fetch from 'node-fetch'
import AbortController from 'abort-controller'

export const MAX_REQUEST_TIME = 1200

async function fetchWithAbort(endpoint: string, headers: Object = {}) {
  const controller = new AbortController()

  // Abort the fetch request when it takes too long
  const timeout = setTimeout(() => {
    controller.abort()
    console.warn('ABORTED', endpoint) // For logging in Sentry
  }, MAX_REQUEST_TIME)

  return await fetch(endpoint, { ...headers, signal: controller.signal })
    .then(res => {
      clearTimeout(timeout) // The data is on its way, so clear the timeout

      if (res.status !== 200) {
        return { status: res.status, message: '' }
      }
      return res.json()
    })
    .catch((e: Error) => ({ status: e.name === 'AbortError' ? 504 : 500, message: e.message }))
}

export default fetchWithAbort
