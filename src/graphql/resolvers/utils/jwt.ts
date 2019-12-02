import jwt from 'jsonwebtoken'

export function getUserScopes(token: string) {
  let scopes: Array<string> = []
  const bearerToken = token ? token.split(' ') : false

  // Decode the token if there is one provided
  if (bearerToken) {
    const decoded = jwt.decode(bearerToken[1])

    if (decoded) {
      const currentTime = Math.floor(Date.now() / 1000)

      // Do a soft validation on the token by checking the expiration date
      scopes = currentTime < decoded.exp ? decoded.scopes : []
    }
  }

  return scopes
}
