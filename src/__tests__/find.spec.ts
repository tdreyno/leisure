import { infinite } from "../static"

describe("find", () => {
  test("should find the first matching item", () => {
    const cb = jest.fn()

    const result = infinite()
      .tap(cb)
      .find(val => val === 3)

    expect(result).toEqual(3)
    expect(cb).toHaveBeenCalledTimes(4)
  })
})
