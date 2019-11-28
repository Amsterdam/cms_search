import fetch from 'node-fetch'
import { DatasetSearchResult, QueryDatasetSearchArgs } from '../../../../generated/graphql'
import { formatFilters, getCatalogFilters, normalizeDatasets, properties } from './normalize'

export default async ({ q, input }: QueryDatasetSearchArgs): Promise<DatasetSearchResult> => {
  const { from, limit, filters: inputFilters } = input

  /**
   * Output like: {
   *   property/foo/bar: 'eq=value1,value2'
   * }
   */
  const queryFilters = (inputFilters || []).reduce((acc, { type, values }) => {
    const selected = Object.values(properties).find(
      ({ type: propertyType }) => propertyType === type,
    )

    return selected
      ? {
          ...acc,
          [selected.name]: `eq=${values.join(',')}`,
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

  const datasetsUrl = `${process.env.API_ROOT}dcatd/datasets?${urlQuery}`
  const openApiUrl = `${process.env.API_ROOT}dcatd/openapi`

  let filters
  let results = []
  let totalCount = 0

  try {
    const [datasets, openApiResults] = await Promise.all([
      fetch(datasetsUrl).then((res: any) => res.json()),
      fetch(openApiUrl).then((res: any) => res.json()),
    ])

    const datasetFilters = getCatalogFilters(openApiResults)

    filters = formatFilters(datasets['ams:facet_info'], datasetFilters)
    results = normalizeDatasets(datasets['dcat:dataset'], datasetFilters)
    totalCount = Array.isArray(results) ? results.length : 0
  } catch (e) {
    // Todo: error handling
    console.warn(e)
  }

  return {
    totalCount,
    results,
    filters,
  }
}
