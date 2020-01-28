import Benchmark from "benchmark";
// tslint:disable-next-line: no-var-requires
const benchmarks = require("beautify-benchmark");
import _ from "lodash";
import Seq from "../src/index";

// const inc = (x: number) => x + 1;
// const dec = (x: number) => x - 1;
const square = (x: number) => x * x;
const isEven = (x: number) => x % 2 === 0;
// const identity = <T>(x: T) => x;
const arr = (from: number, to: number) => Seq.range(from, to).toArray();
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);
const dupes = (min: number, max: number, count: number) =>
  Seq.iterate(() => rand(min, max), rand(min, max))
    .take(count)
    .toArray();

const jaggedArray = [
  [1, 2, 3],
  [4, 5, 6, 7, 8, 9],
  [23, 24, 25],
  [26],
  [27],
  [28],
  [29, 30],
  [31, 32, 33],
  [34, 35]
];

const lotsOfNumbers = Seq.infinite()
  .take(10000)
  .toArray();

function bench(
  name: string,
  leisureGen?: () => any,
  native?: () => any,
  lodash?: () => any
) {
  const suite = new Benchmark.Suite(name);

  if (leisureGen) {
    suite.add(name + ":leisureGen", leisureGen);
  }

  if (native) {
    suite.add(name + ":native", native);
  }

  if (lodash) {
    suite.add(name + ":lodash", lodash);
  }

  return suite
    .on("cycle", (event: Event) => benchmarks.add(event.target))
    .on("complete", () => benchmarks.log())
    .run({ async: false });
}

bench(
  "map (best case)",
  () =>
    Seq.fromArray(lotsOfNumbers)
      .map(square)
      .first(),
  () => lotsOfNumbers.map(square),
  () => _.map(lotsOfNumbers, square)
);

bench(
  "map (middle case)",
  () =>
    Seq.fromArray(lotsOfNumbers)
      .map(square)
      .nth(5000),
  () => lotsOfNumbers.map(square),
  () => _.map(lotsOfNumbers, square)
);

bench(
  "map (worth case)",
  () =>
    Seq.fromArray(lotsOfNumbers)
      .map(square)
      .nth(10000),
  () => lotsOfNumbers.map(square),
  () => _.map(lotsOfNumbers, square)
);

bench(
  "filter",
  () =>
    Seq.fromArray(lotsOfNumbers)
      .filter(isEven)
      .first(),
  () => lotsOfNumbers.filter(isEven),
  () => _.filter(lotsOfNumbers, isEven)
);

bench(
  "flat",
  () =>
    Seq.fromArray(jaggedArray)
      .flat()
      .first(),
  () => (jaggedArray as any).flat(),
  () => _.flatten(jaggedArray)
);

const halfDupes = dupes(0, 50, 100);
bench(
  "distinct",
  () =>
    Seq.fromArray(halfDupes)
      .distinct()
      .first(),
  undefined,
  () => _.uniq(halfDupes)
);

const firstConcatArray = arr(0, 100);
const secondConcatArray = arr(50, 150);
bench(
  "concat",
  () =>
    Seq.fromArray(firstConcatArray)
      .concat(Seq.fromArray(secondConcatArray))
      .first(),
  () => firstConcatArray.concat(secondConcatArray),
  () => _.concat(firstConcatArray, secondConcatArray)
);
