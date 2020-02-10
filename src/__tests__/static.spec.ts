import { cycle, iterate, of, range, repeat, repeatedly, fib } from "../static";

describe("static", () => {
  describe("range", () => {
    test("should lazily pull from the range that increases", () => {
      const cb = jest.fn();

      const result = range(-2, 2)
        .tap(cb)
        .take(4)
        .toArray();

      expect(result).toEqual([-2, -1, 0, 1]);
      expect(cb).toHaveBeenCalledTimes(4);
    });

    test("should lazily pull from the range that increases by step", () => {
      const cb = jest.fn();

      const result = range(-2, 2, 2)
        .tap(cb)
        .take(3)
        .toArray();

      expect(result).toEqual([-2, 0, 2]);
      expect(cb).toHaveBeenCalledTimes(3);
    });

    test("should lazily pull from the range that decreases", () => {
      const cb = jest.fn();

      const result = range(2, -2)
        .tap(cb)
        .take(4)
        .toArray();

      expect(result).toEqual([2, 1, 0, -1]);
      expect(cb).toHaveBeenCalledTimes(4);
    });

    test("should lazily pull from the range that decreases by step", () => {
      const cb = jest.fn();

      const result = range(2, -2, 2)
        .tap(cb)
        .take(3)
        .toArray();

      expect(result).toEqual([2, 0, -2]);
      expect(cb).toHaveBeenCalledTimes(3);
    });
  });

  describe("of", () => {
    test("should use singleton sequence", () => {
      const result = of(5).first();

      expect(result).toEqual(5);
    });

    test("should use multiple items", () => {
      const result = of(5, 6).toArray();

      expect(result).toEqual([5, 6]);
    });
  });

  describe("iterate", () => {
    test("should lazily pull from an iterator", () => {
      const result = iterate(a => a + 1, 1)
        .take(4)
        .toArray();

      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe("fib", () => {
    test("should lazily generate fibonacci numbers", () => {
      const result = fib()
        .take(6)
        .toArray();

      expect(result).toEqual([0, 1, 1, 2, 3, 5]);
    });
  });

  describe("cycle", () => {
    test("should infinitely repeat an array of values", () => {
      const result = cycle([1, 2, 3])
        .take(7)
        .toArray();

      expect(result).toEqual([1, 2, 3, 1, 2, 3, 1]);
    });
  });

  describe("repeat", () => {
    test("should repeat a value X times", () => {
      const result = repeat(1, 5).toArray();
      expect(result).toEqual([1, 1, 1, 1, 1]);
    });
  });

  describe("repeatedly", () => {
    test("should repeatedly call a side-effect function", () => {
      const cb = jest.fn();

      const result = repeatedly(() => {
        cb();
        return Date.now();
      }, 5).toArray();

      expect(cb).toBeCalledTimes(5);
      expect(result).toHaveLength(5);
    });
  });
});
