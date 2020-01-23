import fetch from 'node-fetch'
import DataLoader from 'dataloader'
import AbortController from 'abort-controller'
import { DATA_SEARCH_ENDPOINTS } from './config'

async function fetchDataEndpoint(endpoint: string) {
  const controller = new AbortController()

  // Abort the fetch request when it takes too long
  const timeout = setTimeout(() => {
    // controller.abort()
    // console.warn('ABORTED', endpoint) // For logging in Sentry
  }, 1200)

  return await fetch(endpoint, { signal: controller.signal })
    .then((res: any) => {
      clearTimeout(timeout) // The data is on its way, so clear the timeout

      if (res.status !== 200) {
        return { error: res.status, message: '' }
      }
      return res.json()
    })
    .catch((e: any) => {
      if (e.name === 'AbortError') {
        return { status: 504, message: e.message }
      } else {
        return { status: 500, message: e.message }
      }
    })
}

// A function returns a Promise that resolves to the values corresponding the keys
const loaderFunction = (keys: Array<string>) => {
  // Return a Promise that resolves to the values corresponding the keys
  return new Promise(async resolve => {
    // Get the values that correspond to the keys
    const values = await Promise.all(
      keys.map((key: string) => {
        return fetchDataEndpoint(key)
      }),
    )

    // Resolve the Promise with the values
    resolve(values)
  })
}

// Create a DataLoader instance
const loader = new DataLoader(loaderFunction, {
  cache: false,
})

const requestTypes = async ({ searchTerm = '', types = [] }: any) => {
  let endpoints: any = DATA_SEARCH_ENDPOINTS

  if (types && types.length > 0) {
    endpoints.filter(({ type }: any) => type && types.includes(type))
  }

  const keys = endpoints.map(
    ({ endpoint }: any) => `${endpoint}?q=${searchTerm}&expire=${Math.random()}`,
  )

  const results = await loader.loadMany(keys)

  return results
}

// Make the request via the given DataLoader instance
export const dataloaderFn = (searchTerm: any) => requestTypes({ searchTerm })
