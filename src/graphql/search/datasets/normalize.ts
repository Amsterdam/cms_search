import removeMd from 'remove-markdown'
import { Filter, FilterInput } from '../../../generated/graphql'
import {
  FileFormatFilterType,
  AggregationType,
  MAX_INTRO_LENGTH,
  PropertyType,
  CatalogFilterOptionsType,
  properties,
  DCAT_ENDPOINTS,
} from './config'
import { FilterTypes } from '../../config'

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

function normalizeDatasets(content: any, openApiData: any) {
  if (!Object.keys(openApiData).length) {
    return false
  }

  const { distributionProperties } = getProperties(openApiData)

  const formatMap = arrayToObject(
    getOptionsFromProperty(distributionProperties['dcat:mediaType']),
    'id',
  )
  const serviceMap = arrayToObject(
    getOptionsFromProperty(distributionProperties['ams:serviceType']),
    'id',
  )
  const distributionMap = arrayToObject(
    getOptionsFromProperty(distributionProperties['ams:distributionType']),
    'id',
  )

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

    // Get the distinc values of dcat:distribution
    const distributionTypes = item['dcat:distribution']
      .map((resource: any) => distributionMap[resource['ams:distributionType']])
      .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index)

    const id = item['dct:identifier']
    const description = removeMd(item['dct:description'])

    return {
      header: item['dct:title'],
      description,
      teaser:
        description.length > MAX_INTRO_LENGTH
          ? `${description.substring(0, MAX_INTRO_LENGTH)}...`
          : description,
      modified: item['ams:sort_modified'],
      formats: aggregateFileFormats(formats),
      distributionTypes,
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
function getOptionsFromProperty(propertyType: PropertyType): Array<CatalogFilterOptionsType> {
  return propertyType.enum.map((_, i: number) => ({
    id: propertyType.enum[i] ? propertyType.enum[i] : 'other',
    label: propertyType.enumNames[i] ? propertyType.enumNames[i] : 'Anders',
  }))
}

function getProperties(openApiData: any) {
  const dcatDocProperties = openApiData.components.schemas['dcat-dataset'].properties
  const distributionProperties = dcatDocProperties['dcat:distribution'].items.properties
  const ownerProperties = dcatDocProperties['ams:owner'].examples

  return {
    dcatDocProperties,
    distributionProperties,
    ownerProperties,
  }
}

function getFacetOptions(property: PropertyType, facets?: Object) {
  const options: Array<CatalogFilterOptionsType> = getOptionsFromProperty(property)

  return options.map(({ label, id }) => ({
    id,
    label: label ? label : id,
    count: facets
      ? (Object.values(facets).reduce((acc, value: Object) => value[id] || acc, 0) as number)
      : 0,
  }))
}

function formatFilters(openApiData: any, facets?: Object): Array<Filter> {
  const { dcatDocProperties, distributionProperties } = getProperties(openApiData)

  return [
    {
      type: properties.theme.type,
      label: "Thema's",
      filterType: FilterTypes.Checkbox,
      options: getFacetOptions(dcatDocProperties['dcat:theme'].items, facets),
    },
    {
      type: properties.distributionType.type,
      label: 'Verschijningsvorm',
      filterType: FilterTypes.Radio,
      options: getFacetOptions(distributionProperties['ams:distributionType'], facets),
    },
  ]
}

// Construct the endpoint that can be used to load the datasets
function getDatasetsEndpoint(
  q: string | null,
  from: number,
  limit: number,
  filters: Array<FilterInput>,
) {
  /**
   * Output like: {
   *   property/foo/bar: 'in=value1,value2'
   * }
   */
  const queryFilters = (filters || []).reduce((acc, { type, values }) => {
    const selected = Object.values(properties).find(
      ({ type: propertyType }) => propertyType === type,
    )

    return selected
      ? {
          ...acc,
          [selected.name]: `in=${values.join(`,`)}`,
        }
      : {}
  }, {})

  // Filter out objects with undefined values and make sure value is always a string
  const query = Object.entries({
    q,
    offset: from,
    limit: limit,
    ...queryFilters,
  }).reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(typeof value !== 'undefined' ? { [key]: `${value}` } : {}),
    }),
    {},
  )

  const urlQuery = new URLSearchParams(query).toString()

  return `${DCAT_ENDPOINTS['datasets']}?${urlQuery}`
}

export {
  arrayToObject,
  aggregateFileFormats,
  getFacetOptions,
  getOptionsFromProperty,
  getDatasetsEndpoint,
  formatFilters,
  properties,
  normalizeDatasets,
}
