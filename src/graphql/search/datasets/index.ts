import { DatasetSearchResult, QueryDatasetSearchArgs } from '../../../generated/graphql'
import { formatFilters, getDatasetsEndpoint, normalizeDatasets } from './normalize'
import getPageInfo from '../../utils/getPageInfo'
import CustomError from '../../utils/CustomError'
import { DCAT_ENDPOINTS } from './config'
import { Context, DEFAULT_LIMIT } from '../../config'

export default async (
  _: any,
  { q = '', input }: QueryDatasetSearchArgs,
  context: Context,
): Promise<DatasetSearchResult> => {
  const { loaders } = context
  let { page, limit, filters: filterInput } = input || {}

  // Get the page and limit from the input, otherwise use the defaults
  page = page || 1
  limit = limit || DEFAULT_LIMIT

  const from = (page - 1) * limit

  // Constructs the url to retrieve the datasets
  const datasetsUrl = getDatasetsEndpoint(q, from, limit, filterInput || [])

  // Get the results from the DataLoader
  let [datasets, openApiResults] = await Promise.all([
    await loaders.datasets.load(datasetsUrl),
    await loaders.openAPI.load(DCAT_ENDPOINTS['openapi']),
  ])

  // If a status is rejected, delete the key from the cache and throw an error
  if (datasets.status === 'rejected') {
    loaders.datasets.clear(datasetsUrl)

    throw new CustomError(datasets.reason, 'datasets', 'Datasets')
  }

  if (openApiResults.status === 'rejected') {
    loaders.datasets.clear(DCAT_ENDPOINTS['openapi'])

    throw new CustomError(openApiResults.reason, 'openapi', 'OpenAPI')
  }

  return {
    // Get the totalCount value
    totalCount: datasets.value['void:documents'],
    // Otherwise normalize the results
    results: normalizeDatasets(datasets.value['dcat:dataset'], openApiResults.value),
    // Get the page info details
    pageInfo: getPageInfo(datasets.value['void:documents'], page, limit),
    // Get the available filters and merge with the results to get a count
    filters: formatFilters(openApiResults.value, datasets.value['ams:facet_info']),
  }
}
