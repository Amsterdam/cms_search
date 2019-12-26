import removeMd from 'remove-markdown'
import { Filter } from '../../../../generated/graphql'

type AggregationType = Array<{ name: string; count: number }>

type PropertyType = {
  enum: Array<string>
  enumNames: Array<string>
}

type FileFormatFilterType = Array<{ name: string; count: number }>

export type CatalogFilterOptionsType = Array<{ id: string; label: string; enumType: string }>
export type CatalogFilterType = {
  options: CatalogFilterOptionsType
  filterType: string
}

type CatalogFilters = {
  statusTypes: CatalogFilterType
  groupTypes: CatalogFilterType
  formatTypes: CatalogFilterType
  serviceTypes: CatalogFilterType
  resourceTypes: CatalogFilterType
  ownerTypes: CatalogFilterType
  licenseTypes: CatalogFilterType
  spatialUnits: CatalogFilterType
  temporalUnits: CatalogFilterType
  accrualPeriodicity: CatalogFilterType
  languages: CatalogFilterType
  distributionTypes: CatalogFilterType
}

const properties = {
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

/**
 * @example
 * arrayToObject([{label: 'hello', foo: 'bar'}], 'foo')
 * Outputs: { bar: 'hello' }
 *
 * @param array
 * @param keyField
 */
function arrayToObject(array: Array<{ label: string }>, keyField: string) {
  return array.reduce(
    (acc, item) => ({
      ...acc,
      [item[keyField]]: item.label,
    }),
    {},
  )
}

/**
 * Build an array with available file formats and the amount per format, and sort them by the amount
 *
 * @example
 * aggregateFileFormats(['csv', 'csv', 'pdf', 'docx'])
 * Outputs: [{ name: 'csv', count: 2 }, { name: 'pdf', count: 1 }, { name: 'docx', count: 1 }]
 * @param fileFormats
 */
function aggregateFileFormats(fileFormats: Array<string>): FileFormatFilterType {
  const result = fileFormats.reduce((aggregation: AggregationType, value) => {
    const counter = aggregation.find(item => item.name === value)

    if (counter) {
      counter.count += 1
    } else {
      aggregation.push({
        name: value,
        count: 1,
      })
    }

    return aggregation
  }, [])

  return result.sort((a, b) => {
    if (a.count === b.count) {
      return a.name && b.name ? a.name.localeCompare(b.name) : a.name ? -1 : 1
    }
    return b.count - a.count
  })
}

function normalizeDatasets(content: any, catalogFilters: CatalogFilters) {
  if (!Object.keys(catalogFilters).length) {
    return false
  }

  const formatMap = arrayToObject(catalogFilters.formatTypes.options, 'id')
  const serviceMap = arrayToObject(catalogFilters.serviceTypes.options, 'id')
  const distributionMap = arrayToObject(catalogFilters.distributionTypes.options, 'id')

  return content.map((item: any) => {
    const formats = item['dcat:distribution'].map((resource: any) => {
      if (resource['ams:distributionType'] === 'file') {
        return formatMap[resource['dcat:mediaType']]
      }
      if (resource['ams:distributionType'] === 'api') {
        return serviceMap[resource['ams:serviceType']]
      }
      return distributionMap[resource['ams:distributionType']]
    })

    const id = item['dct:identifier']

    return {
      header: item['dct:title'],
      description: removeMd(item['dct:description']),
      modified: item['ams:sort_modified'],
      formats: aggregateFileFormats(formats),
      tags: item['dcat:keyword'],
      id,
    }
  })
}

/**
 * Matches the key (enum) of a type to a label (enumName)
 *
 * @example
 * getOptionsFromProperty({ enum: ['foo:bar'], enumNames: ['Hello'] }, { enum: ['baz']})
 * Outputs: [{ id: 'bar', label: 'hello' }, {id: 'baz', label: 'Anders'}]
 * @param propertyType
 */
function getOptionsFromProperty(propertyType: PropertyType): CatalogFilterOptionsType {
  return propertyType.enum.map((item, i: number) => {
    const index = item.indexOf(':')
    return {
      id: index === -1 ? item : item.substring(index + 1),
      label: propertyType.enumNames[i] ? propertyType.enumNames[i] : 'Anders',
      enumType: propertyType.enum[i] ? propertyType.enum[i] : 'other',
    }
  })
}

function getCatalogFilters(data: any): CatalogFilters {
  const dcatDocProperties = data.components.schemas['dcat-dataset'].properties
  const distributionProperties = dcatDocProperties['dcat:distribution'].items.properties
  const ownerProperties = dcatDocProperties['ams:owner'].examples

  return {
    statusTypes: {
      filterType: dcatDocProperties['ams:status'].type,
      options: getOptionsFromProperty(dcatDocProperties['ams:status']),
    },
    groupTypes: {
      options: getOptionsFromProperty(dcatDocProperties['dcat:theme'].items),
      filterType: dcatDocProperties['dcat:theme'].type,
    },
    formatTypes: {
      options: getOptionsFromProperty(distributionProperties['dcat:mediaType']),
      filterType: distributionProperties['dcat:mediaType'].type,
    },
    serviceTypes: {
      options: getOptionsFromProperty(distributionProperties['ams:serviceType']),
      filterType: distributionProperties['ams:serviceType'].type,
    },
    resourceTypes: {
      options: getOptionsFromProperty(distributionProperties['ams:resourceType']),
      filterType: distributionProperties['ams:resourceType'].type,
    },
    ownerTypes: {
      options: ownerProperties.map((item: any) => ({
        id: item,
        label: item,
        enumType: item,
      })),
      filterType: dcatDocProperties['ams:owner'].type,
    },
    licenseTypes: {
      options: getOptionsFromProperty(dcatDocProperties['ams:license']),
      filterType: dcatDocProperties['ams:license'].type,
    },
    spatialUnits: {
      options: getOptionsFromProperty(dcatDocProperties['ams:spatialUnit']),
      filterType: dcatDocProperties['ams:spatialUnit'].type,
    },
    temporalUnits: {
      options: getOptionsFromProperty(dcatDocProperties['ams:temporalUnit']),
      filterType: dcatDocProperties['ams:temporalUnit'].type,
    },
    accrualPeriodicity: {
      options: getOptionsFromProperty(dcatDocProperties['dct:accrualPeriodicity']),
      filterType: dcatDocProperties['dct:accrualPeriodicity'].type,
    },
    languages: {
      options: getOptionsFromProperty(dcatDocProperties['dct:language']),
      filterType: dcatDocProperties['dct:language'].type,
    },
    distributionTypes: {
      options: getOptionsFromProperty(distributionProperties['ams:distributionType']),
      filterType: distributionProperties['ams:distributionType'].type,
    },
  }
}

function getFacetOptions(facets: any, filterCatalog: CatalogFilterType) {
  return filterCatalog.options.map(({ label, enumType, id }) => ({
    id,
    label: label ? label : id,
    count: Object.values(facets).reduce((acc, value: any) => value[enumType] || acc, 0) as number,
    enumType: enumType,
  }))
}

function formatFilters(facets: Object, catalogFilters: CatalogFilters): Array<Filter> {
  return [
    // {
    //   type: properties.status.type,
    //   label: 'Status',
    //   filterType: catalogFilters.statusTypes.filterType,
    //   options: getFacetOptions(
    //     filters[properties.status.name],
    //     catalogFilters.statusTypes,
    //     'status',
    //   ),
    // },
    {
      type: properties.theme.type,
      label: "Thema's",
      filterType: catalogFilters.groupTypes.filterType,
      options: getFacetOptions(facets, catalogFilters.groupTypes),
    },
    // {
    //   type: properties.format.type,
    //   label: 'Bestandsformaten',
    //   filterType: catalogFilters.formatTypes.filterType,
    //   options: getFacetOptions(filters[properties.format.name], catalogFilters.formatTypes),
    // },
    // {
    //   type: properties.owner.type,
    //   label: 'Eigenaar',
    //   filterType: catalogFilters.ownerTypes.filterType,
    //   options: getFacetOptions(filters[properties.owner.name], catalogFilters.ownerTypes),
    // },
    {
      type: properties.distributionType.type,
      label: 'Verschijningsvorm',
      filterType: catalogFilters.distributionTypes.filterType,
      options: getFacetOptions(facets, catalogFilters.distributionTypes),
    },
    // {
    //   type: properties.serviceType.type,
    //   label: 'API/Service formaten',
    //   filterType: catalogFilters.distributionTypes.filterType,
    //   options: getFacetOptions(filters[properties.serviceType.name], catalogFilters.serviceTypes),
    // },
  ]
}

export {
  arrayToObject,
  aggregateFileFormats,
  getFacetOptions,
  getOptionsFromProperty,
  formatFilters,
  properties,
  normalizeDatasets,
  getCatalogFilters,
}
