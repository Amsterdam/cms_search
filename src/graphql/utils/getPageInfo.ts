import { DEFAULT_LIMIT } from '../config'

export default function getPageInfo(
  totalCount: number,
  page: number = 1,
  limit: number = DEFAULT_LIMIT,
) {
  // Calculate the page info details
  const totalPages = Math.round(totalCount / limit)
  const hasNextPage = !(page >= totalPages)

  return {
    pageInfo: {
      hasNextPage,
      totalPages,
    },
  }
}
