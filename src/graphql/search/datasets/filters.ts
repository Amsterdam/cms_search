import fetch from 'node-fetch'
import { formatFilters, getCatalogFilters } from './normalize'
import withCache from '../../utils/withCache'

export const DCAT_ENDPOINTS = JSON.parse((process.env.DCAT_ENDPOINTS || '').replace(/'/gm, ''))

const week = 60 * 60 * 24 * 7

export const openApiCached = async () =>
  withCache('openApi', () => fetch(DCAT_ENDPOINTS['openapi']).then(res => res.json()), week)

export default async (_: any, { q = '' }: any): Promise<any> => {
  let filters
  try {
    const urlQuery = new URLSearchParams({ q }).toString()
    const datasetsUrl = `${DCAT_ENDPOINTS['datasets']}?${urlQuery}`

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
