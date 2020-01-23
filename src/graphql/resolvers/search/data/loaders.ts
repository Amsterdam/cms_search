import fetch from 'node-fetch'
import AbortController from 'abort-controller'
import DataLoader from 'dataloader'

import { normalizeDataResults } from './normalize'
import { DATA_SEARCH_ENDPOINTS } from './config'
import DataError from '../../../utils/DataError'

async function fetchDataEndpoint(endpoint: string, type: string, label: string) {
  const controller = new AbortController()

  // Abort the fetch request when it takes too long
  const timeout = setTimeout(() => {
    controller.abort()
    console.warn('ABORTED', endpoint) // For logging in Sentry

    return new DataError(504, type, label)

    // return Promise.resolve()
  }, 80)

  try {
    const res = await fetch(endpoint, {
      signal: controller.signal,
    })
    clearTimeout(timeout) // The data is on its way, so clear the timeout
    console.log('fetched', label)
    if (res.status !== 200) {
      throw new DataError(res.status, type, label)
    }
    const json = res.json()
    const results = loader.reducer(json)
    return results // Must return an array
  } catch (e) {
    return [e]
  }
}

const loaders = DATA_SEARCH_ENDPOINTS.reduce((obj, item) => {
  obj[item.type] = {}
  return obj
}, {})

// const loadData = new DataLoader((keys: any) => loader.load(keys), { cache: true })

// arr.reduce((a,b)=> (a[b]='',a),{});
// console.log(arr)

const loadData = ({ searchTerm, from, limit, types }: any) => {
  let endpoints: any = DATA_SEARCH_ENDPOINTS

  if (types && types.length > 0) {
    endpoints.filter(({ type }: any) => type && types.includes(type))
  }

  return Promise.all(
    endpoints.map(
      ({ type }: any) =>
        new DataLoader((keys: any) => loaders[type].load(keys, from, limit), {
          cache: true,
        }),
    ),
  )
}

export default loadData
