import { fromArray, infinite, range } from "../static"

describe("interleave", () => {
  test("should alternate between sequences", () => {
    const result = range(100, 97)
      .interleave(infinite(), fromArray([-1000, -2000, -3000]))
      .take(12)
      .toArray()

    expect(result).toEqual([
      100, 0, -1000, 99, 1, -2000, 98, 2, -3000, 97, 3, 4,
    ])
  })
})
