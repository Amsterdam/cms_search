import fetch from 'node-fetch'
import { normalizeDataResults } from './normalize'

const DataLoader = require('dataloader')

const loader = {
  reducer: (res: any) => {
    return [{ results: res.results.map((result: any) => normalizeDataResults(result)) }]
  },
  load: (searchTerm: any) =>
    fetch(`https://api.data.amsterdam.nl/atlas/search/adres/?q=${searchTerm}`)
      .then((res: any) => {
        console.log('fetched')

        return res.json()
      })
      .then((json: any) => {
        const results = loader.reducer(json)

        return results // Must return an array
      })

      .catch((e: Error) => {
        if (e.name === 'AbortError') {
        } else {
        }
      }),
}

const loadData = () => new DataLoader((keys: any) => loader.load(keys), { cache: true })

export default loadData
