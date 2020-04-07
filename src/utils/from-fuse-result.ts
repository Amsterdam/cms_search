import { FuseResult } from 'fuse.js'

/**
 * Converts Fuse.js results to the actual values contained within.
 *
 * @param results The Fuse.js results to convert.
 */
export default function fromFuseResult<T>(results: FuseResult<T>[]) {
  return results.map(({ item }) => item)
}
