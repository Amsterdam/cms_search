import { JsonAPI, formatThemeFilters, formatDateFilters, formatSubTypeFilters } from './normalize'
import { ThemeFilterCount, SubTypeFilterCount } from '../../../es/cms'

export const getThemeFilters = (filters: JsonAPI, filterCount?: Array<ThemeFilterCount>) =>
  formatThemeFilters(filters, filterCount)

export const getSubTypeFilters = (filters: any, filterCount?: Array<SubTypeFilterCount>) =>
  formatSubTypeFilters(filters, filterCount)

export const getDateFilters = () => formatDateFilters()

export default getThemeFilters
