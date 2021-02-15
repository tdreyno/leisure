import { fromArray, infinite } from "../static"

describe("some", () => {
  test("should some as soon as we find some", () => {
    const cb = jest.fn()

    const result = infinite()
      .tap(cb)
      .some(val => val === 3)

    expect(result).toEqual(true)
    expect(cb).toHaveBeenCalledTimes(4)
  })

  test("should fail if we never find some", () => {
    const cb = jest.fn()

    const result = fromArray([1, 2, 3, 4])
      .tap(cb)
      .some(val => val === 5)

    expect(result).toEqual(false)
    expect(cb).toHaveBeenCalledTimes(4)
  })
})
