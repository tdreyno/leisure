import { infinite } from "../static"

describe("includes", () => {
  test("should detect if a sequence includes a value", () => {
    const cb = jest.fn()

    const result = infinite().tap(cb).includes(3)

    expect(result).toEqual(true)
    expect(cb).toHaveBeenCalledTimes(4)
  })
})
