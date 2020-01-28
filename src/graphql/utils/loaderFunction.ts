import fetchWithAbort from './fetchWithAbort'

// A function returns a Promise that resolves to the values corresponding the keys
function loaderFunction(keys: readonly string[], token = ''): any {
  // Return a Promise that resolves to the values corresponding the keys
  return new Promise(async resolve => {
    // Get the values that correspond to the keys
    const values = await Promise.all(
      keys.map((key: string) =>
        fetchWithAbort(
          key,
          token && token.length > 0
            ? {
                authorization: `Bearer ${token}`,
              }
            : {},
        ),
      ),
    )

    // Resolve the Promise with the values
    resolve(values)
  })
}

export default loaderFunction
