import { Seq } from "../Seq"
import { infinite } from "../static"

describe("MAX_YIELDS", () => {
  beforeEach(() => (Seq.MAX_YIELDS = 5))
  afterEach(() => (Seq.MAX_YIELDS = 1_000_000))

  test("should throw when running infinitely", () => {
    const cb = jest.fn()

    expect(() => infinite().tap(cb).toArray()).toThrow()

    expect(cb).toHaveBeenCalledTimes(Seq.MAX_YIELDS)
  })
})
