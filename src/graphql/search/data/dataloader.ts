import DataLoader from 'dataloader'
import { LRUMap } from 'lru_map'
import loaderFunction from '../../utils/loaderFunction'

// This DataLoader stays cached above the per-request level using `lru_map`
const loader = new DataLoader(loaderFunction, {
  cache: true,
  cacheMap: new LRUMap(100),
})

// Function to either get the existing DataLoader from cache or create a new one
export function createDataLoader(token: string) {
  if (!token) {
    return loader
  }

  // There's a token provided so we can't use any cache above the per-request level
  return new DataLoader((keys: readonly string[]) => loaderFunction(keys, token), {
    cache: false,
  })
}
