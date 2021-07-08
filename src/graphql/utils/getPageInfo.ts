import { DEFAULT_LIMIT } from '../config'
import { PageInfo } from '../../generated/graphql'

export default function getPageInfo(totalCount: number, page = 1, limit = DEFAULT_LIMIT): PageInfo {
  // Calculate the page info details
  const totalPages = Math.ceil(totalCount / limit)
  const hasNextPage = page < totalPages

  return {
    hasNextPage,
    totalPages,
  }
}
