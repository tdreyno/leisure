import { fromArray } from "../static"

describe("chain", () => {
  test("should map the current seq", () => {
    const result = fromArray([1, 2, 3, 4]).pipe(seq => seq.toArray())

    expect(result).toEqual([1, 2, 3, 4])
  })
})
