import { Seq } from "../Seq";

describe("Seq", () => {
  describe("range", () => {
    test("should lazily pull from the range that increases", () => {
      const cb = jest.fn();

      const result = Seq.range(-2, 2)
        .tap(cb)
        .take(4)
        .toArray();

      expect(result).toEqual([-2, -1, 0, 1]);
      expect(cb).toHaveBeenCalledTimes(4);
    });

    test("should lazily pull from the range that increases by step", () => {
      const cb = jest.fn();

      const result = Seq.range(-2, 2, 2)
        .tap(cb)
        .take(3)
        .toArray();

      expect(result).toEqual([-2, 0, 2]);
      expect(cb).toHaveBeenCalledTimes(3);
    });

    test("should lazily pull from the range that decreases", () => {
      const cb = jest.fn();

      const result = Seq.range(2, -2)
        .tap(cb)
        .take(4)
        .toArray();

      expect(result).toEqual([2, 1, 0, -1]);
      expect(cb).toHaveBeenCalledTimes(4);
    });

    test("should lazily pull from the range that decreases by step", () => {
      const cb = jest.fn();

      const result = Seq.range(2, -2, 2)
        .tap(cb)
        .take(3)
        .toArray();

      expect(result).toEqual([2, 0, -2]);
      expect(cb).toHaveBeenCalledTimes(3);
    });
  });

  describe("of", () => {
    test("should use singleton sequence", () => {
      const result = Seq.of(5).first();

      expect(result).toEqual(5);
    });
  });

  describe("iterate", () => {
    test("should lazily pull from an iterator", () => {
      const result = Seq.iterate(a => a + 1, 1)
        .take(4)
        .toArray();

      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe("map", () => {
    test("should work like normal map", () => {
      const cb = jest.fn();

      const result = Seq.range(0, 2)
        .tap(cb)
        .map((v, i) => v * 4 - i)
        .toArray();

      expect(result).toEqual([0, 3, 6]);
      expect(cb).toHaveBeenCalledTimes(3);
    });

    test("should only map once if only 1 result is asked for", () => {
      const cb = jest.fn();

      const result = Seq.infinite()
        .tap(cb)
        .map((v, i) => v * 4 - i)
        .first();

      expect(result).toEqual(0);
      expect(cb).toHaveBeenCalledTimes(1);
    });

    test("should only map for each item taken", () => {
      const cb = jest.fn();

      const result = Seq.infinite()
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

      const result = Seq.infinite()
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

      const result = Seq.infinite()
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

      const result = Seq.infinite()
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

      const result = Seq.infinite()
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

      const result = Seq.infinite()
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
      const result = Seq.fromArray([1, 2, 1, 3, 2, 4, 4, 5])
        .distinct()
        .take(4)
        .toArray();

      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe("concat", () => {
    test("should concat multiple sequences on to the first", () => {
      const result = Seq.fromArray([1, 2, 3])
        .concat(
          Seq.infinite()
            .skip(4)
            .take(2),
          Seq.fromSet(new Set([6, 7, 8]))
        )
        .take(8)
        .toArray();

      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  describe("isEmpty", () => {
    test("should know if the sequence is empty", () => {
      expect(Seq.fromArray([]).isEmpty()).toEqual(true);

      expect(Seq.infinite().isEmpty()).toEqual(false);
    });
  });

  describe("interpose", () => {
    test("should place the separator between items", () => {
      const result = Seq.fromArray(["one", "two", "three"])
        .interpose(", ")
        .toArray()
        .join("");

      expect(result).toEqual("one, two, three");
    });
  });

  describe("cycle", () => {
    test("should infinitely repeat an array of values", () => {
      const result = Seq.cycle([1, 2, 3])
        .take(7)
        .toArray();

      expect(result).toEqual([1, 2, 3, 1, 2, 3, 1]);
    });
  });

  describe("repeat", () => {
    test("should repeat a value X times", () => {
      const result = Seq.repeat(1, 5).toArray();
      expect(result).toEqual([1, 1, 1, 1, 1]);
    });
  });

  describe("repeatedly", () => {
    test("should repeatedly call a side-effect function", () => {
      const cb = jest.fn();

      const result = Seq.repeatedly(() => {
        cb();
        return Date.now();
      }, 5).toArray();

      expect(cb).toBeCalledTimes(5);
      expect(result).toHaveLength(5);
    });
  });

  describe("frequencies", () => {
    test("should count the occurances of a value", () => {
      const result = Seq.fromArray([1, 2, 3, 1, 2, 1]).frequencies();

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
      const result = Seq.range(100, 97)
        .interleave(Seq.infinite(), Seq.fromArray([-1000, -2000, -3000]))
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

      const result = Seq.infinite()
        .tap(cb)
        .find(val => val === 3);

      expect(result).toEqual(3);
      expect(cb).toHaveBeenCalledTimes(4);
    });
  });

  describe("includes", () => {
    test("should detect if a sequence includes a value", () => {
      const cb = jest.fn();

      const result = Seq.infinite()
        .tap(cb)
        .includes(3);

      expect(result).toEqual(true);
      expect(cb).toHaveBeenCalledTimes(4);
    });
  });

  describe("some", () => {
    test("should some as soon as we find some", () => {
      const cb = jest.fn();

      const result = Seq.infinite()
        .tap(cb)
        .some(val => val === 3);

      expect(result).toEqual(true);
      expect(cb).toHaveBeenCalledTimes(4);
    });

    test("should fail if we never find some", () => {
      const cb = jest.fn();

      const result = Seq.fromArray([1, 2, 3, 4])
        .tap(cb)
        .some(val => val === 5);

      expect(result).toEqual(false);
      expect(cb).toHaveBeenCalledTimes(4);
    });
  });

  describe("every", () => {
    test("should work like normal every on success", () => {
      const result = Seq.fromArray([1, 3, 5]).every(val => val % 2 !== 0);

      expect(result).toEqual(true);
    });

    test("should work like normal every on failure", () => {
      const cb = jest.fn();
      const result = Seq.fromArray([1, 3, 5])
        .tap(cb)
        .every(val => val === 1);

      expect(cb).toBeCalledTimes(2);
      expect(result).toEqual(false);
    });
  });

  describe("sum", () => {
    test("should be able to sum a sequence of numbers", () => {
      const result = Seq.infinite()
        .take(4)
        .sum();

      expect(result).toEqual(6);
    });
  });

  describe("sumBy", () => {
    test("should be able to sum a sequence of anything", () => {
      const result = Seq.fromArray([
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
      const result = Seq.infinite()
        .take(4)
        .average();

      expect(result).toEqual(1.5);
    });
  });

  describe("averageBy", () => {
    test("should be able to average a sequence of anything", () => {
      const result = Seq.fromArray([
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
      const result = Seq.infinite()
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
      const result = Seq.zip(Seq.infinite(), Seq.infinite())
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
      const result = Seq.zipWith(
        ([result1, result2], index) => [
          index,
          result1 && result2 ? result1 + result2 : -1000
        ],
        Seq.fromArray([1, 2, 3]),
        Seq.fromArray([10, 20])
      )
        .take(4)
        .toArray();

      expect(result).toEqual([11, 22, -1000]);
    });

    test("should combine two sequences with a combinator function (longer last seq)", () => {
      const result = Seq.zipWith(
        ([result1, result2], index) => [
          index,
          result1 && result2 ? result1 + result2 : -1000
        ],
        Seq.fromArray([1, 2]),
        Seq.fromArray([10, 20, 30])
      )
        .take(4)
        .toArray();

      expect(result).toEqual([11, 22, -1000]);
    });
  });

  describe("forEach", () => {
    test("should flush the sequence and call a callback", () => {
      const cb = jest.fn();

      Seq.fromArray([1, 2, 3, 4]).forEach(cb);

      expect(cb).toBeCalledTimes(4);
    });
  });

  describe("chain", () => {
    test("should map the current seq", () => {
      const result = Seq.fromArray([1, 2, 3, 4]).chain(seq => seq.toArray());

      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe("toSet", () => {
    test("should convert the sequence into a Set", () => {
      const result = Seq.fromArray([1, 2, 3, 4]).toSet();

      expect(result).toEqual(new Set([1, 2, 3, 4]));
    });
  });

  describe("fromMap", () => {
    test("should query a Map in correct order", () => {
      const map = new Map();
      map.set("a", 1);
      map.set("b", 2);
      map.set("c", 3);
      map.set("d", 4);

      const result = Seq.fromMap(map)
        .skip(1)
        .take(2)
        .toArray();

      expect(result).toEqual([2, 3]);
    });
  });

  describe("fromSet", () => {
    test("should query a Set in correct order", () => {
      const set = new Set();
      set.add("a");
      set.add("b");
      set.add("c");
      set.add("d");

      const result = Seq.fromSet(set)
        .skip(1)
        .take(2)
        .toArray();

      expect(result).toEqual(["b", "c"]);
    });
  });

  describe("toMap", () => {
    test("should convert the sequence into a Map", () => {
      const result = Seq.fromArray([1, 2, 3, 4]).toMap();

      expect(result).toEqual(
        new Map([
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4]
        ])
      );
    });
  });

  describe("partition", () => {
    test("should create two lazy sequences that filter a parent sequence based on a predicate", () => {
      const cb = jest.fn();

      const [even, odd] = Seq.infinite()
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

      const [greater, lessOrEqual] = Seq.infinite()
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

      const [lessOrEqual, greater] = Seq.infinite()
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

      const result = Seq.infinite()
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

      const result = Seq.infinite()
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
        Seq.infinite()
          .tap(cb)
          .toArray()
      ).toThrow();

      expect(cb).toHaveBeenCalledTimes(Seq.MAX_YIELDS + 1);
    });
  });
});
