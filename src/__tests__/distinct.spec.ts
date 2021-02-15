import { fromArray } from "../static"

describe("distinct", () => {
  test("should only return unique items in a sequence", () => {
    const result = fromArray([1, 2, 1, 3, 2, 4, 4, 5])
      .distinct()
      .take(4)
      .toArray()

    expect(result).toEqual([1, 2, 3, 4])
  })
})
