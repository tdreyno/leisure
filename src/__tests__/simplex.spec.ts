import { simplex2D, simplex3D, simplex4D } from "../simplex"

describe("simplex", () => {
  describe("simplex2D", () => {
    test("should generate 2d simplex noise", () => {
      const result = simplex2D(() => [1, 2], 1).first()

      expect(result).toEqual(0.5387352272965704)
    })
  })

  describe("simplex3D", () => {
    test("should generate 3d simplex noise", () => {
      const result = simplex3D(() => [1, 2, 3], 1).first()

      expect(result).toEqual(-1.4535286549334576e-65)
    })
  })

  describe("simplex4D", () => {
    test("should generate 4d simplex noise", () => {
      const result = simplex4D(() => [1, 2, 3, 4], 1).first()

      expect(result).toEqual(0.041806993617899316)
    })
  })
})
