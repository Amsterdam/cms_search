import { Filter, FilterOption } from '../../../generated/graphql'

// Combine filter options and return the new filteroptions
export function combineFilterOptions(options: Array<FilterOption>) {
  return options.reduce((acc, cur) => {
    if (!acc.some(({ id }) => id === cur.id)) {
      return [...acc, cur] // Add the non-matching ID to the options array
    }
    return acc
  }, [] as Array<FilterOption>)
}

// Combine filters and return the new filter(s)
export function combineFilters(filters: Array<Filter>) {
  return filters.reduce((acc, cur) => {
    // Find Filters that have the same type
    const matching = acc.find(({ type }) => type === cur.type)

    if (matching) {
      // Next to a matching type, the Filters can also have options with matching IDs
      const options = combineFilterOptions([...(matching?.options || []), ...(cur?.options || [])])

      // The matching fields for the Filter must be merged, just as the combined options
      return [
        {
          ...matching,
          options,
        },
      ]
    }

    return [...acc, cur]
  }, [] as Array<Filter>)
}
