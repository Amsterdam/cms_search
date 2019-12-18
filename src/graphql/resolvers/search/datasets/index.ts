import fetch from 'node-fetch'

import { DatasetSearchResult, QueryDatasetSearchArgs } from '../../../../generated/graphql'
import { getCatalogFilters, normalizeDatasets, properties } from './normalize'
import { openApiCached } from '../datasetFilters'

export default async (
  _: any,
  { q, input }: QueryDatasetSearchArgs,
): Promise<DatasetSearchResult> => {
  const { from, limit, filters: inputFilters } = input

  /**
   * Output like: {
   *   property/foo/bar: 'in=value1,value2'
   * }
   */
  const queryFilters = (inputFilters || []).reduce((acc, { type, values, multiSelect }) => {
    const selected = Object.values(properties).find(
      ({ type: propertyType }) => propertyType === type,
    )

    return selected
      ? {
          ...acc,
          [selected.name]: `${multiSelect ? 'in' : 'eq'}=${values.join(`,`)}`,
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

  let results: any = []
  let totalCount = 0

  try {
    const [datasets, openApiResults] = await Promise.all([
      fetch(datasetsUrl).then((res: any) => res.json()),
      openApiCached(),
    ])
    const datasetFilters = getCatalogFilters(openApiResults)

    results = normalizeDatasets(datasets['dcat:dataset'], datasetFilters)
    totalCount = Array.isArray(results) ? results.length : 0
  } catch (e) {
    // Todo: error handling
    console.warn(e)
  }

  return {
    totalCount,
    results,
  }
}
