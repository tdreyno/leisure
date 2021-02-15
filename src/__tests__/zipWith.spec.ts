import { fromArray } from "../static"

describe("zipWith", () => {
  test("should combine two sequences with a combinator function (longer first seq)", () => {
    const result = fromArray([1, 2, 3])
      .zipWith(
        ([result1, result2]) =>
          result1 && result2 ? result1 + result2 : -1000,
        fromArray([10, 20]),
      )
      .take(4)
      .toArray()

    expect(result).toEqual([11, 22, -1000])
  })

  test("should combine two sequences with a combinator function (longer last seq)", () => {
    const result = fromArray([1, 2])
      .zipWith(
        ([result1, result2]) =>
          result1 && result2 ? result1 + result2 : -1000,
        fromArray([10, 20, 30]),
      )
      .take(4)
      .toArray()

    expect(result).toEqual([11, 22, -1000])
  })
})
