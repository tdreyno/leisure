import { infinite } from "../static"

describe("sum", () => {
  test("should be able to sum a sequence of numbers", () => {
    const result = infinite().take(4).sum()

    expect(result).toEqual(6)
  })
})
