import { cartesianProduct, powerSet } from "../combinatorics";

describe("combinatorics", () => {
  describe("cartesianProduct", () => {
    test("should generate 2d product of same type", () => {
      const result = cartesianProduct(["a", "b"], ["!", "?"]).toArray();

      expect(result).toEqual([
        ["a", "!"],
        ["a", "?"],
        ["b", "!"],
        ["b", "?"]
      ]);
    });

    test("should generate 3d product of differnt types", () => {
      const result = cartesianProduct(
        ["a", "b"],
        [1, 2],
        [true, false]
      ).toArray();

      expect(result).toEqual([
        ["a", 1, true],
        ["a", 1, false],
        ["a", 2, true],
        ["a", 2, false],
        ["b", 1, true],
        ["b", 1, false],
        ["b", 2, true],
        ["b", 2, false]
      ]);
    });
  });

  describe("powerSet", () => {
    test("should generate power set", () => {
      const result = powerSet("a", "b", "c").toArray();

      expect(result).toEqual([
        new Set([]),
        new Set(["a"]),
        new Set(["b"]),
        new Set(["a", "b"]),
        new Set(["c"]),
        new Set(["a", "c"]),
        new Set(["b", "c"]),
        new Set(["a", "b", "c"])
      ]);
    });
  });
});
