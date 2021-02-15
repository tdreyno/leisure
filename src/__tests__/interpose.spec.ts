import { fromArray } from "../static"

describe("interpose", () => {
  test("should place the separator between items", () => {
    const result = fromArray(["one", "two", "three"])
      .interpose(", ")
      .toArray()
      .join("")

    expect(result).toEqual("one, two, three")
  })
})
