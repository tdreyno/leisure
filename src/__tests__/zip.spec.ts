import { infinite } from "../static"

describe("zip", () => {
  test("should combine two sequences", () => {
    const result = infinite().zip(infinite()).take(4).toArray()

    expect(result).toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ])
  })
})
