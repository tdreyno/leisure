import { infinite } from "../static"

describe("first", () => {
  test("should get the first value", () => {
    const result = infinite().first()

    expect(result).toEqual(0)
  })
})
