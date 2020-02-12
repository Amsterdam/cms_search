import { DatasetSearchResult, QueryDatasetSearchArgs } from '../../../generated/graphql'
import { getDatasetsEndpoint, normalizeDatasets } from './normalize'
import getFilters from './filters'
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

  let results: any = []
  let filters: any = []
  let totalCount = 0

  // Get the results from the DataLoader
  let [datasets, openApiResults]: any = await Promise.all([
    await loaders.datasets.load(datasetsUrl),
    await loaders.datasets.load(DCAT_ENDPOINTS['openapi']),
  ])

  // If an error is thrown, delete the key from the cache and throw an error
  if (datasets.status === 'rejected' || openApiResults.status === 'rejected') {
    loaders.datasets.clear(datasets.status === 'rejected' ? datasetsUrl : DCAT_ENDPOINTS['openapi'])

    results = new CustomError(
      datasets.status === 'rejected' ? datasets.reason : openApiResults.reason,
      'datasets',
      'Datasets',
    )
  } else {
    // Otherwise normalize the results
    results = normalizeDatasets(datasets.value['dcat:dataset'], openApiResults.value)
    // Get the available filters and merge with the results to get a count
    filters = getFilters(openApiResults.value, datasets.value['ams:facet_info'])
    // Get the totalCount value
    totalCount = datasets.value['void:documents']
  }

  return {
    totalCount,
    results,
    // Get the page info details
    pageInfo: getPageInfo(totalCount, page, limit),
    filters,
  }
}
