import fetch from 'node-fetch'
import { formatThemeFilters, formatDateFilters } from './normalize'
import withCache from '../../../utils/memoryCache'

interface FilterCount {
  theme: Array<{
    key: string
    count: number
  }>
}

const week = 60 * 60 * 24 * 7

export const themeTaxonomyCached = async () =>
  await withCache(
    'themeTaxonomy',
    fetch(`${process.env.CMS_URL}/jsonapi/taxonomy_term/theme`),
    week,
  )

export default async (filterCount: FilterCount): Promise<any> => {
  let filters
  try {
    const themeTaxonomy: any = await Promise.resolve(themeTaxonomyCached())
    const themeFilters: any = formatThemeFilters(themeTaxonomy, filterCount.theme)
    const dateFilters: any = formatDateFilters()

    filters = [themeFilters, dateFilters]
  } catch (e) {
    console.warn(e)
  }

  return {
    filters,
  }
}
