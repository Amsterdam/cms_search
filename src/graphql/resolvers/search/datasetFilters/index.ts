import fetch from 'node-fetch'
import { formatFilters, getCatalogFilters } from '../datasets/normalize'

export default async (_: any, { q }: any): Promise<any> => {
  let filters
  try {
    const urlQuery = new URLSearchParams({ q }).toString()
    const datasetsUrl = `${process.env.API_ROOT}dcatd/datasets?${urlQuery}`
    const openApiUrl = `${process.env.API_ROOT}dcatd/openapi`

    const [datasets, openApiResults] = await Promise.all([
      fetch(datasetsUrl).then((res: any) => res.json()),
      fetch(openApiUrl).then((res: any) => res.json()),
    ])
    const datasetFilters = getCatalogFilters(openApiResults)

    filters = formatFilters(datasets['ams:facet_info'], datasetFilters)
  } catch (e) {
    console.warn(e)
  }

  return {
    filters,
  }
}
