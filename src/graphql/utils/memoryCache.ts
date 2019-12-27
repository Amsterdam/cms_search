import memoryCache from 'memory-cache'

const withCache = async (cacheKey: string, promise: Promise<any>, durationInSeconds: number) =>
  new Promise(async (resolve, reject) => {
    let key = `__cache__${cacheKey}`
    let cachedBody = memoryCache.get(key)
    if (cachedBody) {
      resolve(cachedBody)
    } else {
      try {
        const result = await promise.then((res: any) => res.json())
        memoryCache.put(key, result, durationInSeconds * 1000)
        resolve(result)
      } catch (e) {
        reject(e)
      }
    }
  })

export default withCache
