import { fromArray } from "../static"

describe("zip2With", () => {
  test("should combine three sequences with a combinator function (longer first seq)", () => {
    const result = fromArray([1, 2, 3])
      .zip2With(
        ([result1, result2, result3]) =>
          result1 && result2 && result3 ? result1 + result2 + result3 : -1000,
        fromArray([10, 20]),
        fromArray([5, 10]),
      )
      .take(4)
      .toArray()

    expect(result).toEqual([16, 32, -1000])
  })

  test("should combine three sequences with a combinator function (longer second seq)", () => {
    const result = fromArray([1, 2])
      .zip2With(
        ([result1, result2, result3]) =>
          result1 && result2 && result3 ? result1 + result2 + result3 : -1000,
        fromArray([10, 20, 30]),
        fromArray([5, 10]),
      )
      .take(4)
      .toArray()

    expect(result).toEqual([16, 32, -1000])
  })

  test("should combine three sequences with a combinator function (longer last seq)", () => {
    const result = fromArray([1, 2])
      .zip2With(
        ([result1, result2, result3]) =>
          result1 && result2 && result3 ? result1 + result2 + result3 : -1000,
        fromArray([10, 20]),
        fromArray([5, 10, 15]),
      )
      .take(4)
      .toArray()

    expect(result).toEqual([16, 32, -1000])
  })
})
