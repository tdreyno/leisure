import { fromArray } from "../static"

describe("every", () => {
  test("should work like normal every on success", () => {
    const result = fromArray([1, 3, 5]).every(val => val % 2 !== 0)

    expect(result).toEqual(true)
  })

  test("should work like normal every on failure", () => {
    const cb = jest.fn()
    const result = fromArray([1, 3, 5])
      .tap(cb)
      .every(val => val === 1)

    expect(cb).toBeCalledTimes(2)
    expect(result).toEqual(false)
  })
})
