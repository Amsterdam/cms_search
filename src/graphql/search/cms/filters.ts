import { formatThemeFilters, formatDateFilters } from './normalize'
import { Filter } from '../../../generated/graphql'

interface FilterCount {
  theme: Array<{
    key: string
    count: number
  }>
}

export default (filters: any, filterCount?: FilterCount): Array<Filter> => {
  const themeFilters: Filter = formatThemeFilters(filters, filterCount?.theme)
  const dateFilters: Filter = formatDateFilters()

  return [themeFilters, dateFilters]
}
