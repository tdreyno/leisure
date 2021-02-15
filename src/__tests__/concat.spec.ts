import { fromArray, infinite } from "../static"

describe("concat", () => {
  test("should concat multiple sequences on to the first", () => {
    const result = fromArray([1, 2, 3])
      .concat(infinite().skip(4).take(2), fromArray([6, 7, 8]))
      .take(8)
      .toArray()

    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })
})
