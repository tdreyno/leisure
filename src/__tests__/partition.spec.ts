import { infinite } from "../static"

describe("partition", () => {
  test("should create two lazy sequences that filter a parent sequence based on a predicate", () => {
    const cb = jest.fn()

    const [even, odd] = infinite()
      .tap(cb)
      .partitionBy(val => val % 2 === 0)

    const evenResult = even.take(4).toArray()
    expect(evenResult).toEqual([0, 2, 4, 6])

    const oddResult = odd.take(4).toArray()
    expect(oddResult).toEqual([1, 3, 5, 7])

    expect(cb).toHaveBeenCalledTimes(8)
  })

  test("should handle false backpressure", () => {
    const cb = jest.fn()

    const [greater, lessOrEqual] = infinite()
      .tap(cb)
      .partitionBy(val => val > 5)

    const greaterResult = greater.take(2).toArray()
    expect(greaterResult).toEqual([6, 7])

    const lessOrEqualResult = lessOrEqual.take(4).toArray()
    expect(lessOrEqualResult).toEqual([0, 1, 2, 3])

    expect(cb).toHaveBeenCalledTimes(8)
  })

  test("should handle true backpressure", () => {
    const cb = jest.fn()

    const [lessOrEqual, greater] = infinite()
      .tap(cb)
      .partitionBy(val => val <= 5)

    const lessOrEqualResult = lessOrEqual.take(2)
    expect(lessOrEqualResult.toArray()).toEqual([0, 1])

    const greaterResult = greater.take(4).toArray()
    expect(greaterResult).toEqual([6, 7, 8, 9])

    expect(cb).toHaveBeenCalledTimes(10)

    const lessOrEqualResult2 = lessOrEqualResult.take(2).toArray()
    expect(lessOrEqualResult2).toEqual([2, 3])

    expect(cb).toHaveBeenCalledTimes(10)
  })
})
