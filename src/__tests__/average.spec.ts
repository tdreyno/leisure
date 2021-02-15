import { infinite } from "../static"

describe("average", () => {
  test("should be able to average a sequence of numbers", () => {
    const result = infinite().take(4).average()

    expect(result).toEqual(1.5)
  })
})
