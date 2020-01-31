import { Seq } from "../Seq";
import { fromArray, infinite, range } from "../static";

describe("Seq", () => {
  describe("map", () => {
    test("should work like normal map", () => {
      const cb = jest.fn();

      const result = range(0, 2)
        .tap(cb)
        .map((v, i) => v * 4 - i)
        .toArray();

      expect(result).toEqual([0, 3, 6]);
      expect(cb).toHaveBeenCalledTimes(3);
    });

    test("should only map once if only 1 result is asked for", () => {
      const cb = jest.fn();

      const result = infinite()
        .tap(cb)
        .map((v, i) => v * 4 - i)
        .first();

      expect(result).toEqual(0);
      expect(cb).toHaveBeenCalledTimes(1);
    });

    test("should only map for each item taken", () => {
      const cb = jest.fn();

      const result = infinite()
        .tap(cb)
        .map((v, i) => v * 4 - i)
        .take(2)
        .toArray();

      expect(result).toEqual([0, 3]);
      expect(cb).toHaveBeenCalledTimes(2);
    });
  });

  describe("flatMap", () => {
    test("should work like normal flatMap", () => {
      const cb = jest.fn();

      const result = infinite()
        .tap(cb)
        .flatMap((v, i) => [v * 4 - i, -1000])
        .take(6)
        .toArray();

      expect(result).toEqual([0, -1000, 3, -1000, 6, -1000]);
      expect(cb).toHaveBeenCalledTimes(3);
    });
  });

  describe("flat", () => {
    test("should work like normal flat", () => {
      const cb = jest.fn();

      const result = infinite()
        .tap(cb)
        .map((v, i) => [v * 4 - i, -1000])
        .flat()
        .take(6)
        .toArray();

      expect(result).toEqual([0, -1000, 3, -1000, 6, -1000]);
      expect(cb).toHaveBeenCalledTimes(3);
    });
  });

  describe("takeWhile", () => {
    test("should request values until the predicate is false", () => {
      const cb = jest.fn();

      const result = infinite()
        .tap(cb)
        .takeWhile(val => val < 4)
        .toArray();

      expect(result).toEqual([0, 1, 2, 3]);
      expect(cb).toHaveBeenCalledTimes(5); // Take-while always calls +1
    });
  });

  describe("skipWhile", () => {
    test("should skip while predicate is true", () => {
      const cb = jest.fn();

      const result = infinite()
        .tap(cb)
        .skipWhile(val => val < 4)
        .take(4)
        .toArray();

      expect(result).toEqual([4, 5, 6, 7]);
      expect(cb).toHaveBeenCalledTimes(8);
    });
  });

  describe("filter", () => {
    test("should request values until the predicate is false, but only keep the odd ones", () => {
      const cb = jest.fn();
      const cb2 = jest.fn();

      const result = infinite()
        .tap(cb)
        .filter(val => val % 2 !== 0)
        .tap(cb2)
        .take(5)
        .toArray();

      expect(result).toEqual([1, 3, 5, 7, 9]);
      expect(cb).toHaveBeenCalledTimes(10); // Searches through both even AND odd
      expect(cb2).toHaveBeenCalledTimes(5);
    });
  });

  describe("distinct", () => {
    test("should only return unique items in a sequence", () => {
      const result = fromArray([1, 2, 1, 3, 2, 4, 4, 5])
        .distinct()
        .take(4)
        .toArray();

      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe("concat", () => {
    test("should concat multiple sequences on to the first", () => {
      const result = fromArray([1, 2, 3])
        .concat(
          infinite()
            .skip(4)
            .take(2),
          fromArray([6, 7, 8])
        )
        .take(8)
        .toArray();

      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  describe("isEmpty", () => {
    test("should know if the sequence is empty", () => {
      expect(fromArray([]).isEmpty()).toEqual(true);

      expect(infinite().isEmpty()).toEqual(false);
    });
  });

  describe("interpose", () => {
    test("should place the separator between items", () => {
      const result = fromArray(["one", "two", "three"])
        .interpose(", ")
        .toArray()
        .join("");

      expect(result).toEqual("one, two, three");
    });
  });

  describe("frequencies", () => {
    test("should count the occurances of a value", () => {
      const result = fromArray([1, 2, 3, 1, 2, 1]).frequencies();

      expect(result).toEqual(
        new Map([
          [1, 3], // 3 occurances of value 1
          [2, 2], // 2 occurances of value 2
          [3, 1] /// 1 occurance  of value 3
        ])
      );
    });
  });

  describe("interleave", () => {
    test("should alternate between sequences", () => {
      const result = range(100, 97)
        .interleave(infinite(), fromArray([-1000, -2000, -3000]))
        .take(12)
        .toArray();

      expect(result).toEqual([
        100,
        0,
        -1000,
        99,
        1,
        -2000,
        98,
        2,
        -3000,
        97,
        3,
        4
      ]);
    });
  });

  describe("find", () => {
    test("should find the first matching item", () => {
      const cb = jest.fn();

      const result = infinite()
        .tap(cb)
        .find(val => val === 3);

      expect(result).toEqual(3);
      expect(cb).toHaveBeenCalledTimes(4);
    });
  });

  describe("first", () => {
    test("should get the first value", () => {
      const result = infinite().first();

      expect(result).toEqual(0);
    });
  });

  describe("nth", () => {
    test("should get the nth value", () => {
      const result = infinite().nth(1);

      expect(result).toEqual(0);
    });
  });

  describe("index", () => {
    test("should get the index value", () => {
      const result = infinite().index(0);

      expect(result).toEqual(0);
    });
  });

  describe("includes", () => {
    test("should detect if a sequence includes a value", () => {
      const cb = jest.fn();

      const result = infinite()
        .tap(cb)
        .includes(3);

      expect(result).toEqual(true);
      expect(cb).toHaveBeenCalledTimes(4);
    });
  });

  describe("some", () => {
    test("should some as soon as we find some", () => {
      const cb = jest.fn();

      const result = infinite()
        .tap(cb)
        .some(val => val === 3);

      expect(result).toEqual(true);
      expect(cb).toHaveBeenCalledTimes(4);
    });

    test("should fail if we never find some", () => {
      const cb = jest.fn();

      const result = fromArray([1, 2, 3, 4])
        .tap(cb)
        .some(val => val === 5);

      expect(result).toEqual(false);
      expect(cb).toHaveBeenCalledTimes(4);
    });
  });

  describe("every", () => {
    test("should work like normal every on success", () => {
      const result = fromArray([1, 3, 5]).every(val => val % 2 !== 0);

      expect(result).toEqual(true);
    });

    test("should work like normal every on failure", () => {
      const cb = jest.fn();
      const result = fromArray([1, 3, 5])
        .tap(cb)
        .every(val => val === 1);

      expect(cb).toBeCalledTimes(2);
      expect(result).toEqual(false);
    });
  });

  describe("sum", () => {
    test("should be able to sum a sequence of numbers", () => {
      const result = infinite()
        .take(4)
        .sum();

      expect(result).toEqual(6);
    });
  });

  describe("sumBy", () => {
    test("should be able to sum a sequence of anything", () => {
      const result = fromArray([
        { data: 0 },
        { data: 1 },
        { data: 2 },
        { data: 3 }
      ])
        .take(4)
        .sumBy(obj => obj.data);

      expect(result).toEqual(6);
    });
  });

  describe("average", () => {
    test("should be able to average a sequence of numbers", () => {
      const result = infinite()
        .take(4)
        .average();

      expect(result).toEqual(1.5);
    });
  });

  describe("averageBy", () => {
    test("should be able to average a sequence of anything", () => {
      const result = fromArray([
        { data: 0 },
        { data: 1 },
        { data: 2 },
        { data: 3 }
      ])
        .take(4)
        .averageBy(obj => obj.data);

      expect(result).toEqual(1.5);
    });
  });

  describe("groupBy", () => {
    test("should be group arbitrarily", () => {
      const result = infinite()
        .take(8)
        .groupBy(item => (item % 2 === 0 ? "even" : "odd"));

      expect(result).toEqual(
        new Map([
          ["even", [0, 2, 4, 6]],
          ["odd", [1, 3, 5, 7]]
        ])
      );
    });
  });

  describe("zip", () => {
    test("should combine two sequences", () => {
      const result = infinite()
        .zip(infinite())
        .take(4)
        .toArray();

      expect(result).toEqual([
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3]
      ]);
    });
  });

  describe("zipWith", () => {
    test("should combine two sequences with a combinator function (longer first seq)", () => {
      const result = fromArray([1, 2, 3])
        .zipWith(
          ([result1, result2]) =>
            result1 && result2 ? result1 + result2 : -1000,
          fromArray([10, 20])
        )
        .take(4)
        .toArray();

      expect(result).toEqual([11, 22, -1000]);
    });

    test("should combine two sequences with a combinator function (longer last seq)", () => {
      const result = fromArray([1, 2])
        .zipWith(
          ([result1, result2]) =>
            result1 && result2 ? result1 + result2 : -1000,
          fromArray([10, 20, 30])
        )
        .take(4)
        .toArray();

      expect(result).toEqual([11, 22, -1000]);
    });
  });

  describe("zip2With", () => {
    test("should combine three sequences with a combinator function (longer first seq)", () => {
      const result = fromArray([1, 2, 3])
        .zip2With(
          ([result1, result2, result3]) =>
            result1 && result2 && result3 ? result1 + result2 + result3 : -1000,
          fromArray([10, 20]),
          fromArray([5, 10])
        )
        .take(4)
        .toArray();

      expect(result).toEqual([16, 32, -1000]);
    });

    test("should combine three sequences with a combinator function (longer second seq)", () => {
      const result = fromArray([1, 2])
        .zip2With(
          ([result1, result2, result3]) =>
            result1 && result2 && result3 ? result1 + result2 + result3 : -1000,
          fromArray([10, 20, 30]),
          fromArray([5, 10])
        )
        .take(4)
        .toArray();

      expect(result).toEqual([16, 32, -1000]);
    });

    test("should combine three sequences with a combinator function (longer last seq)", () => {
      const result = fromArray([1, 2])
        .zip2With(
          ([result1, result2, result3]) =>
            result1 && result2 && result3 ? result1 + result2 + result3 : -1000,
          fromArray([10, 20]),
          fromArray([5, 10, 15])
        )
        .take(4)
        .toArray();

      expect(result).toEqual([16, 32, -1000]);
    });
  });

  describe("forEach", () => {
    test("should flush the sequence and call a callback", () => {
      const cb = jest.fn();

      fromArray([1, 2, 3, 4]).forEach(cb);

      expect(cb).toBeCalledTimes(4);
    });
  });

  describe("chain", () => {
    test("should map the current seq", () => {
      const result = fromArray([1, 2, 3, 4]).pipe(seq => seq.toArray());

      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe("partition", () => {
    test("should create two lazy sequences that filter a parent sequence based on a predicate", () => {
      const cb = jest.fn();

      const [even, odd] = infinite()
        .tap(cb)
        .partitionBy(val => val % 2 === 0);

      const evenResult = even.take(4).toArray();
      expect(evenResult).toEqual([0, 2, 4, 6]);

      const oddResult = odd.take(4).toArray();
      expect(oddResult).toEqual([1, 3, 5, 7]);

      expect(cb).toHaveBeenCalledTimes(8);
    });

    test("should handle false backpressure", () => {
      const cb = jest.fn();

      const [greater, lessOrEqual] = infinite()
        .tap(cb)
        .partitionBy(val => val > 5);

      const greaterResult = greater.take(2).toArray();
      expect(greaterResult).toEqual([6, 7]);

      const lessOrEqualResult = lessOrEqual.take(4).toArray();
      expect(lessOrEqualResult).toEqual([0, 1, 2, 3]);

      expect(cb).toHaveBeenCalledTimes(8);
    });

    test("should handle true backpressure", () => {
      const cb = jest.fn();

      const [lessOrEqual, greater] = infinite()
        .tap(cb)
        .partitionBy(val => val <= 5);

      const lessOrEqualResult = lessOrEqual.take(2);
      expect(lessOrEqualResult.toArray()).toEqual([0, 1]);

      const greaterResult = greater.take(4).toArray();
      expect(greaterResult).toEqual([6, 7, 8, 9]);

      expect(cb).toHaveBeenCalledTimes(10);

      const lessOrEqualResult2 = lessOrEqualResult.take(2).toArray();
      expect(lessOrEqualResult2).toEqual([2, 3]);

      expect(cb).toHaveBeenCalledTimes(10);
    });
  });

  describe("window", () => {
    test("should group sequence into groups of N", () => {
      const cb = jest.fn();

      const result = infinite()
        .tap(cb)
        .window(4)
        .take(2)
        .toArray();

      expect(result).toEqual([
        [0, 1, 2, 3],
        [4, 5, 6, 7]
      ]);
    });
  });

  describe("pairwise", () => {
    test("should group sequence into groups of 2", () => {
      const cb = jest.fn();

      const result = infinite()
        .tap(cb)
        .pairwise()
        .take(3)
        .toArray();

      expect(result).toEqual([
        [0, 1],
        [2, 3],
        [4, 5]
      ]);
    });
  });

  describe("MAX_YIELDS", () => {
    beforeEach(() => (Seq.MAX_YIELDS = 5));
    afterEach(() => (Seq.MAX_YIELDS = 1_000_000));

    test("should throw when running infinitely", () => {
      const cb = jest.fn();

      expect(() =>
        infinite()
          .tap(cb)
          .toArray()
      ).toThrow();

      expect(cb).toHaveBeenCalledTimes(Seq.MAX_YIELDS);
    });
  });
});
