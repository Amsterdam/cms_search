export type AggregationType = Array<{ name: string; count: number }>

export type PropertyType = {
  enum: Array<string>
  enumNames: Array<string>
}

export type FileFormatFilterType = Array<{ name: string; count: number }>

export type CatalogFilterOptionsType = { id: string; label: string; enumType: string }

export const MAX_INTRO_LENGTH = 140

export const properties = {
  status: {
    type: 'status',
    name: '/properties/ams:status',
  },
  theme: {
    type: 'theme',
    name: '/properties/dcat:theme/items',
  },
  format: {
    type: 'format',
    name: '/properties/dcat:distribution/items/properties/dcat:mediaType',
  },
  owner: {
    type: 'owner',
    name: '/properties/ams:owner',
  },
  distributionType: {
    type: 'distributionType',
    name: '/properties/dcat:distribution/items/properties/ams:distributionType',
  },
  serviceType: {
    type: 'serviceType',
    name: '/properties/dcat:distribution/items/properties/ams:serviceType',
  },
}

export const DCAT_ENDPOINTS = JSON.parse((process.env.DCAT_ENDPOINTS || '').replace(/'/gm, ''))
