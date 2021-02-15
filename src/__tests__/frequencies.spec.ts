import { fromArray } from "../static"

describe("frequencies", () => {
  test("should count the occurances of a value", () => {
    const result = fromArray([1, 2, 3, 1, 2, 1]).frequencies()

    expect(result).toEqual(
      new Map([
        [1, 3], // 3 occurances of value 1
        [2, 2], // 2 occurances of value 2
        [3, 1], /// 1 occurance  of value 3
      ]),
    )
  })
})
