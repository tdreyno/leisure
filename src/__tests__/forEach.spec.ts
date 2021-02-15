import { fromArray } from "../static"

describe("forEach", () => {
  test("should flush the sequence and call a callback", () => {
    const cb = jest.fn()

    fromArray([1, 2, 3, 4]).forEach(cb)

    expect(cb).toBeCalledTimes(4)
  })
})
