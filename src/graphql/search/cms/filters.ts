import fetch from 'node-fetch'
import { formatThemeFilters } from './normalize'
import withCache from '../../utils/withCache'

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
    () => fetch(`${process.env.CMS_URL}/jsonapi/taxonomy_term/themes`).then(res => res.json()),
    week,
  )

export default async (filterCount: FilterCount): Promise<any> => {
  let filters
  try {
    const themeTaxonomy: any = await Promise.resolve(themeTaxonomyCached())
    const themeFilters: any = formatThemeFilters(themeTaxonomy, filterCount.theme)

    filters = [themeFilters]
  } catch (e) {
    console.warn(e)
  }

  return {
    filters,
  }
}
