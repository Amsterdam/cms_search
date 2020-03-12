const environment = process.env.NODE_ENV || 'development'

export const isDevelopment = environment === 'development'
export const isProduction = environment === 'production'
