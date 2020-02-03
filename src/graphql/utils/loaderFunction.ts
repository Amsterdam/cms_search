import fetchWithAbort from './fetchWithAbort'

// A function returns a Promise that resolves to the values corresponding the keys
async function loaderFunction(keys: readonly string[], token = ''): Promise<Array<Object>> {
  const values = await Promise.allSettled(
    keys.map((key: string) =>
      fetchWithAbort(
        key,
        token && token.length > 0
          ? {
              headers: { authorization: token },
            }
          : {},
      ),
    ),
  )
  return values
}

export default loaderFunction
