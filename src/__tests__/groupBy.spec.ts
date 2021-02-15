import { infinite } from "../static"

describe("groupBy", () => {
  test("should be group arbitrarily", () => {
    const result = infinite()
      .take(8)
      .groupBy(item => (item % 2 === 0 ? "even" : "odd"))

    expect(result).toEqual(
      new Map([
        ["even", [0, 2, 4, 6]],
        ["odd", [1, 3, 5, 7]],
      ]),
    )
  })
})
