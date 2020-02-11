import { Filter, FilterOptions } from '../../../generated/graphql'

// Combine filter options and return the new filteroptions
export function combineFilterOptions(options: Array<FilterOptions>): Array<FilterOptions> {
  return options.reduce((acc: any, cur: any) => {
    if (!acc.some((a: FilterOptions) => a.id === cur.id)) {
      return [...acc, cur] // Add the non-matching ID to the options array
    }
    return acc
  }, [])
}

// Combine filters and return the new filter(s)
export function combineFilters(filters: Array<Filter>): Array<Filter> {
  return filters.reduce((acc: Array<Filter>, cur: Filter) => {
    // Find Filters that have the same type
    const matching = acc.find((a: Filter) => a.type === cur.type)

    if (matching) {
      // Next to a matching type, the Filters can also have options with matching IDs
      const options = combineFilterOptions([...matching.options, ...cur.options])

      // The matching fields for the Filter must be merged, just as the combined options
      return [
        {
          ...matching,
          options,
        },
      ]
    }

    return [...acc, cur]
  }, [])
}
