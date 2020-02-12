import { JsonAPI, formatThemeFilters, formatDateFilters } from './normalize'

type FilterCount = {
  theme: Array<ThemeFilterCount>
}

export type ThemeFilterCount = {
  key: number
  count: number
}

export default (filters: JsonAPI, filterCount?: FilterCount) => {
  const themeFilters = formatThemeFilters(filters, filterCount?.theme)
  const dateFilters = formatDateFilters()

  return [themeFilters, dateFilters]
}
