import { Filter, FilterOptions } from '../../../generated/graphql'

// Combine both the filters and return the filters
export function combineFilters(filters: Array<Filter>): Array<Filter> {
  return filters.reduce((acc: any, cur: any) => {
    // Find Filters that have the same type
    const matching = acc.find((a: Filter) => a.type === cur.type)

    if (matching) {
      // Next to a matching type, the Filters can also have options with matching IDs
      const options = [...matching.options, ...cur.options].reduce((acc: any, cur: any) => {
        if (!acc.some((a: FilterOptions) => a.id === cur.id)) {
          return [...acc, cur] // Add the non-matching ID to the options array
        }
        return acc
      }, [])

      // The matching fields for the Filter must be merged, just as the combined options
      const combined = {
        ...matching,
        options,
      }
      return [combined]
    }

    return [...acc, cur]
  }, [])
}
