import removeMd from 'remove-markdown'
import { Filter } from '../../../../generated/graphql'

type AggregationType = Array<{ name: string; count: number }>

type PropertyType = {
  enum: Array<string>
  enumNames: Array<string>
}

type FileFormatFilterType = Array<{ name: string; count: number }>

type CatalogFilterType = Array<{ id: string; label: string }>

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
  accrualPeriodicities: CatalogFilterType
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

  const formatMap = arrayToObject(catalogFilters.formatTypes, 'id')
  const serviceMap = arrayToObject(catalogFilters.serviceTypes, 'id')
  const distributionMap = arrayToObject(catalogFilters.distributionTypes, 'id')

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
function getOptionsFromProperty(propertyType: PropertyType): CatalogFilterType {
  return propertyType.enum.map((item, i: number) => {
    const index = item.indexOf(':')
    return {
      id: index === -1 ? item : item.substring(index + 1),
      label: propertyType.enumNames[i] ? propertyType.enumNames[i] : 'Anders',
    }
  })
}

function getCatalogFilters(data: any): CatalogFilters {
  const dcatDocProperties = data.components.schemas['dcat-dataset'].properties
  const distributionProperties = dcatDocProperties['dcat:distribution'].items.properties
  const ownerProperties = dcatDocProperties['ams:owner'].examples

  return {
    statusTypes: getOptionsFromProperty(dcatDocProperties['ams:status']),
    groupTypes: getOptionsFromProperty(dcatDocProperties['dcat:theme'].items),
    formatTypes: getOptionsFromProperty(distributionProperties['dcat:mediaType']),
    serviceTypes: getOptionsFromProperty(distributionProperties['ams:serviceType']),
    resourceTypes: getOptionsFromProperty(distributionProperties['ams:resourceType']),
    ownerTypes: ownerProperties.map((item: any) => ({
      id: item,
      label: item,
    })),
    licenseTypes: getOptionsFromProperty(dcatDocProperties['ams:license']),
    spatialUnits: getOptionsFromProperty(dcatDocProperties['ams:spatialUnit']),
    temporalUnits: getOptionsFromProperty(dcatDocProperties['ams:temporalUnit']),
    accrualPeriodicities: getOptionsFromProperty(dcatDocProperties['dct:accrualPeriodicity']),
    languages: getOptionsFromProperty(dcatDocProperties['dct:language']),
    distributionTypes: getOptionsFromProperty(distributionProperties['ams:distributionType']),
  }
}

function getFacetOptions(
  facet: Array<string> | undefined,
  filterCatalog: Array<{ id: string; label: string }>,
  namespace: undefined | string = undefined,
) {
  const facetObject = facet || {}
  return Object.keys(facetObject).map(option => {
    const id = namespace ? option.replace(`${namespace}:`, '') : option
    const catalogOption = filterCatalog && filterCatalog.filter(item => item.id === id)[0]
    return {
      id,
      label: catalogOption ? catalogOption.label : id,
      count: facetObject[option],
    }
  })
}

function formatFilters(filters: Object, catalogFilters: CatalogFilters): Array<Filter> {
  return [
    {
      type: properties.status.type,
      label: "Thema's",
      options: getFacetOptions(
        filters[properties.status.name],
        catalogFilters.statusTypes,
        'status',
      ),
    },
    {
      type: properties.theme.type,
      label: 'Groepen',
      options: getFacetOptions(filters[properties.theme.name], catalogFilters.groupTypes, 'theme'),
    },
    {
      type: properties.format.type,
      label: 'Bestandsformaten',
      options: getFacetOptions(filters[properties.format.name], catalogFilters.formatTypes),
    },
    {
      type: properties.owner.type,
      label: 'Eigenaar',
      options: getFacetOptions(filters[properties.owner.name], catalogFilters.ownerTypes),
    },
    {
      type: properties.distributionType.type,
      label: 'Verschijningsvorm',
      options: getFacetOptions(
        filters[properties.distributionType.name],
        catalogFilters.distributionTypes,
      ),
    },
    {
      type: properties.serviceType.type,
      label: 'API/Service formaten',
      options: getFacetOptions(filters[properties.serviceType.name], catalogFilters.serviceTypes),
    },
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
