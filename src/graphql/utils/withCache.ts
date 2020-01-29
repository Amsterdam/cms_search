import memoryCache from 'memory-cache'

/**
 * Caches the result of a Promise in memory.
 *
 * @param cacheKey The key to be used to look up the specific cache.
 * @param executor A function which returns the Promise of which the result should be cached.
 * @param time The amount of time (in seconds) the result should be cached.
 */
export default async function withCache<T>(
  cacheKey: string,
  executor: () => Promise<T>,
  time: number,
) {
  const cachedValue: T | null = memoryCache.get(cacheKey)

  if (cachedValue !== null) {
    return cachedValue
  }

  return memoryCache.put(cacheKey, await executor(), time * 1000)
}
