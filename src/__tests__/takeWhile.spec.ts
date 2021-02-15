import { infinite } from "../static"

describe("takeWhile", () => {
  test("should request values until the predicate is false", () => {
    const cb = jest.fn()

    const result = infinite()
      .tap(cb)
      .takeWhile(val => val < 4)
      .toArray()

    expect(result).toEqual([0, 1, 2, 3])
    expect(cb).toHaveBeenCalledTimes(5) // Take-while always calls +1
  })
})
