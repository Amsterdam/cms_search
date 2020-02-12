import { JsonAPI, formatThemeFilters, formatDateFilters } from './normalize'
import { Filter } from '../../../generated/graphql'

type FilterCount = {
  theme: Array<ThemeFilterCount>
}

export type ThemeFilterCount = {
  key: number
  count: number
}

export default (filters: JsonAPI, filterCount?: FilterCount): Array<Filter> => {
  const themeFilters = formatThemeFilters(filters, filterCount?.theme)
  const dateFilters = formatDateFilters()

  return [themeFilters, dateFilters]
}
