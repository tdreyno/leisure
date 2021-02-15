import { fromArray } from "../static"

describe("averageBy", () => {
  test("should be able to average a sequence of anything", () => {
    const result = fromArray([
      { data: 0 },
      { data: 1 },
      { data: 2 },
      { data: 3 },
    ])
      .take(4)
      .averageBy(obj => obj.data)

    expect(result).toEqual(1.5)
  })
})
