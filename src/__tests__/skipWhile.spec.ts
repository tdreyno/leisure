import { infinite } from "../static"

describe("skipWhile", () => {
  test("should skip while predicate is true", () => {
    const cb = jest.fn()

    const result = infinite()
      .tap(cb)
      .skipWhile(val => val < 4)
      .take(4)
      .toArray()

    expect(result).toEqual([4, 5, 6, 7])
    expect(cb).toHaveBeenCalledTimes(8)
  })
})
