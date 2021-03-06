import { fromArray } from "../static"

describe("sumBy", () => {
  test("should be able to sum a sequence of anything", () => {
    const result = fromArray([
      { data: 0 },
      { data: 1 },
      { data: 2 },
      { data: 3 },
    ])
      .take(4)
      .sumBy(obj => obj.data)

    expect(result).toEqual(6)
  })
})
