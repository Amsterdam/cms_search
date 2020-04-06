import { JsonAPI, formatThemeFilters, formatDateFilters, formatSubTypeFilters } from './normalize'

export type ThemeFilterCount = {
  key: number
  count: number
}

export type SubTypeFilterCount = {
  key: string
  count: number
}

export const getThemeFilters = (filters: JsonAPI, filterCount?: Array<ThemeFilterCount>) =>
  formatThemeFilters(filters, filterCount)

export const getSubTypeFilters = (filters: any, filterCount?: Array<SubTypeFilterCount>) =>
  formatSubTypeFilters(filters, filterCount)

export const getDateFilters = () => formatDateFilters()

export default getThemeFilters
