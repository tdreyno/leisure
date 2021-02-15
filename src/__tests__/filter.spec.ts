import { infinite } from "../static"

describe("filter", () => {
  test("should request values until the predicate is false, but only keep the odd ones", () => {
    const cb = jest.fn()
    const cb2 = jest.fn()

    const result = infinite()
      .tap(cb)
      .filter(val => val % 2 !== 0)
      .tap(cb2)
      .take(5)
      .toArray()

    expect(result).toEqual([1, 3, 5, 7, 9])
    expect(cb).toHaveBeenCalledTimes(10) // Searches through both even AND odd
    expect(cb2).toHaveBeenCalledTimes(5)
  })
})
