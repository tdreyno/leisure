import { infinite } from "../static"

describe("nth", () => {
  test("should get the nth value", () => {
    const result = infinite().nth(1)

    expect(result).toEqual(0)
  })
})
