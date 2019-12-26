import fetch from 'node-fetch'
import { formatFilters } from './normalize'
import withCache from '../../utils/memoryCache'

const week = 60 * 60 * 24 * 7

export const themeTaxonomyCached = async () =>
  await withCache('themeTaxonomy', fetch(`${process.env.CMS_URL}/jsonapi/taxonomy_term/theme`), week)

export default async (): Promise<any> => {
  let filters
  try {
    const themeTaxonomy: any = await Promise.resolve(themeTaxonomyCached())

    filters = formatFilters(themeTaxonomy)    
  } catch (e) {
    console.warn(e)
  }

  return {
    filters,
  }
}
