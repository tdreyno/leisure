import { fromArray, infinite } from "../static"

describe("isEmpty", () => {
  test("should know if the sequence is empty", () => {
    expect(fromArray([]).isEmpty()).toEqual(true)

    expect(infinite().isEmpty()).toEqual(false)
  })
})
