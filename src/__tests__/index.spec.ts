import { infinite } from "../static"

describe("index", () => {
  test("should get the index value", () => {
    const result = infinite().index(0)

    expect(result).toEqual(0)
  })
})
