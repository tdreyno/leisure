import { infinite } from "../static"

describe("flat", () => {
  test("should work like normal flat", () => {
    const cb = jest.fn()

    const result = infinite()
      .tap(cb)
      .map((v, i) => [v * 4 - i, -1000])
      .flat()
      .take(6)
      .toArray()

    expect(result).toEqual([0, -1000, 3, -1000, 6, -1000])
    expect(cb).toHaveBeenCalledTimes(3)
  })
})
