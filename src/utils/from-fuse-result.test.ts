import { FuseResult } from 'fuse.js'
import fromFuseResult from './from-fuse-result'

describe('fromFuseResult', () => {
  it("should convert a Fuse result to it's actual values", () => {
    const actual = ['foo', 'bar', 'bax']
    const result = actual.map((item) => ({ item } as FuseResult<string>))

    expect(fromFuseResult(result)).toEqual(actual)
  })
})
