export const PORT = 8080
export const URL_PREFIX = '/cms_search'

export const DEFAULT_FROM = 0
export const DEFAULT_LIMIT = 10

export const CMS_TYPES = {
  ARTICLE: 'article',
  PUBLICATION: 'publication',
  SPECIAL: 'special',
}

export const AUTH_SCOPES = {
  HR: 'HR/R',
  BRK: 'BRK/RS',
  BRKPLUS: 'BRK/RSN',
}

export const ROLES = {
  EMPLOYEE: 'employee',
  EMPLOYEE_PLUS: 'employee_plus',
}

export const CMS_LABELS = {
  [CMS_TYPES.ARTICLE]: 'Artikelen',
  [CMS_TYPES.PUBLICATION]: 'Publicaties',
  [CMS_TYPES.SPECIAL]: 'Specials',
}
