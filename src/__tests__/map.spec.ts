import { infinite, range } from "../static"

describe("map", () => {
  test("should work like normal map", () => {
    const cb = jest.fn()

    const result = range(0, 2)
      .tap(cb)
      .map((v, i) => v * 4 - i)
      .toArray()

    expect(result).toEqual([0, 3, 6])
    expect(cb).toHaveBeenCalledTimes(3)
  })

  test("should only map once if only 1 result is asked for", () => {
    const cb = jest.fn()

    const result = infinite()
      .tap(cb)
      .map((v, i) => v * 4 - i)
      .first()

    expect(result).toEqual(0)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  test("should only map for each item taken", () => {
    const cb = jest.fn()

    const result = infinite()
      .tap(cb)
      .map((v, i) => v * 4 - i)
      .take(2)
      .toArray()

    expect(result).toEqual([0, 3])
    expect(cb).toHaveBeenCalledTimes(2)
  })
})
