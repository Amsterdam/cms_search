interface DataErrorType {
  message: string
  code: string
  type: string
  label: string
}

// Creates a custom Error object to send along an `extensions` object with your GraphQL Error
export default class DataError extends Error {
  extensions: any
  constructor({ message, code, type, label }: DataErrorType) {
    super(message)
    this.name = 'DataError'
    this.extensions = {
      code,
      type,
      label,
    }
  }
}
