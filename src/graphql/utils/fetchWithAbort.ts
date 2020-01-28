import fetch from 'node-fetch'
import AbortController from 'abort-controller'

async function fetchWithAbort(endpoint: string, headers: Object = {}) {
  const controller = new AbortController()

  // Abort the fetch request when it takes too long
  const timeout = setTimeout(() => {
    controller.abort()
    console.warn('ABORTED', endpoint) // For logging in Sentry
  }, 1200)

  return await fetch(endpoint, { ...headers, signal: controller.signal })
    .then((res: any) => {
      clearTimeout(timeout) // The data is on its way, so clear the timeout

      if (res.status !== 200) {
        return { status: res.status, message: '' }
      }
      return res.json()
    })
    .catch((e: Error) => {
      if (e.name === 'AbortError') {
        return { status: 504, message: e.message }
      } else {
        return { status: 500, message: e.message }
      }
    })
}

export default fetchWithAbort
