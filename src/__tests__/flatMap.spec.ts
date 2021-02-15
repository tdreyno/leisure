import { infinite } from "../static"

describe("flatMap", () => {
  test("should work like normal flatMap", () => {
    const cb = jest.fn()

    const result = infinite()
      .tap(cb)
      .flatMap((v, i) => [v * 4 - i, -1000])
      .take(6)
      .toArray()

    expect(result).toEqual([0, -1000, 3, -1000, 6, -1000])
    expect(cb).toHaveBeenCalledTimes(3)
  })
})
