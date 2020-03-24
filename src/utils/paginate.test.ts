import paginate from './paginate'

describe('utils', () => {
  describe('paginate', () => {
    it('should paginate the content', () => {
      const input = [1, 2, 3, 4, 5, 6, 7]

      expect(paginate(input, 1, 5)).toEqual([1, 2, 3, 4, 5])
      expect(paginate(input, 2, 5)).toEqual([6, 7])
    })
  })
})
