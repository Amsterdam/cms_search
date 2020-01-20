import fetch from 'node-fetch'
import { formatFilters, getCatalogFilters } from '../datasets/normalize'
import withCache from '../../../utils/memoryCache'

const week = 60 * 60 * 24 * 7

export const openApiCached = async () =>
  withCache('openApi', fetch(`${process.env.DATAPUNT_API_URL}dcatd/openapi`), week)

export default async (_: any, { q }: any): Promise<any> => {
  let filters
  try {
    const urlQuery = new URLSearchParams({ q }).toString()
    const datasetsUrl = `${process.env.DATAPUNT_API_URL}dcatd/datasets?${urlQuery}`

    const [datasets, openApiResults]: any = await Promise.all([
      fetch(datasetsUrl).then((res: any) => res.json()),
      openApiCached(),
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
