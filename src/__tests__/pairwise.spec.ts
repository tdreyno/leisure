import { infinite } from "../static"

describe("pairwise", () => {
  test("should group sequence into groups of 2", () => {
    const cb = jest.fn()

    const result = infinite().tap(cb).pairwise().take(3).toArray()

    expect(result).toEqual([
      [0, 1],
      [2, 3],
      [4, 5],
    ])
  })
})
