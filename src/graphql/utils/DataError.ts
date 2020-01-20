interface Extensions {
  code: string
  type: string
  label: string
}

// Creates a custom Error object to send along an `extensions` object with your GraphQL Error
export default class DataError extends Error {
  extensions: Extensions
  constructor(status: number, type: string, label: string) {
    let message
    let code

    switch (status) {
      case 401:
        code = 'UNAUTHORIZED'
        message = `Not authorized to view ${label}`
        break
      case 504:
        code = 'GATEWAY_TIMEOUT'
        message = `The upstream server didn't respond timely for ${label}`
        break
      default:
        code = 'ERROR'
        message = `Something went wrong while requesting ${label}`
    }

    super(message)
    this.name = 'DataError'
    this.extensions = {
      code,
      type,
      label,
    }
  }
}
