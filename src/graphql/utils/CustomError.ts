interface Extensions {
  code: string
  type: string
  label: string
}

// Creates a custom Error object to send along an `extensions` object with your GraphQL Error
export default class CustomError extends Error {
  extensions: Extensions
  constructor(error: Error, type: string, label: string) {
    let message
    let code

    switch (error.message) {
      case '401 - Unauthorized':
        code = 'UNAUTHORIZED'
        message = `Not authorized to view ${label}`
        break
      case '504 - Gateway Timeout':
        code = 'GATEWAY_TIMEOUT'
        message = `The upstream server didn't respond timely for ${label}`
        break
      default:
        code = 'ERROR'
        message = `Something went wrong while requesting ${label}`
    }

    super(message)
    this.name = 'CustomError'
    this.extensions = {
      code,
      type,
      label,
    }
  }
}
