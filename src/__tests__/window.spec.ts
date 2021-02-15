import { infinite } from "../static"

describe("window", () => {
  test("should group sequence into groups of N", () => {
    const cb = jest.fn()

    const result = infinite().tap(cb).window(4).take(2).toArray()

    expect(result).toEqual([
      [0, 1, 2, 3],
      [4, 5, 6, 7],
    ])
  })
})
