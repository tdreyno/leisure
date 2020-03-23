/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Benchmark from "benchmark"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const benchmarks = require("beautify-benchmark")
import _ from "lodash"
import { fromArray, infinite, iterate, range } from "../index"

// const inc = (x: number) => x + 1;
// const dec = (x: number) => x - 1;
const square = (x: number) => x * x
const isEven = (x: number) => x % 2 === 0
// const identity = <T>(x: T) => x;
const arr = (from: number, to: number) => range(from, to).toArray()
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min)
const dupes = (min: number, max: number, count: number) =>
  iterate(() => rand(min, max), rand(min, max))
    .take(count)
    .toArray()

const jaggedArray = [
  [1, 2, 3],
  [4, 5, 6, 7, 8, 9],
  [23, 24, 25],
  [26],
  [27],
  [28],
  [29, 30],
  [31, 32, 33],
  [34, 35],
]

const lotsOfNumbers = infinite().take(10000).toArray()

const bench = (
  name: string,
  leisure?: () => any,
  native?: () => any,
  lodash?: () => any,
) => {
  const suite = new Benchmark.Suite(name)

  if (leisure) {
    suite.add(name + ":leisure", leisure)
  }

  if (native) {
    suite.add(name + ":native", native)
  }

  if (lodash) {
    suite.add(name + ":lodash", lodash)
  }

  return suite
    .on("cycle", (event: Event) => benchmarks.add(event.target))
    .on("complete", () => benchmarks.log())
    .run({ async: false })
}

bench(
  "map (best case)",
  () => fromArray(lotsOfNumbers).map(square).first(),
  () => lotsOfNumbers.map(square),
  () => _.map(lotsOfNumbers, square),
)

bench(
  "map (middle case)",
  () => fromArray(lotsOfNumbers).map(square).nth(5000),
  () => lotsOfNumbers.map(square),
  () => _.map(lotsOfNumbers, square),
)

bench(
  "map (worth case)",
  () => fromArray(lotsOfNumbers).map(square).nth(10000),
  () => lotsOfNumbers.map(square),
  () => _.map(lotsOfNumbers, square),
)

bench(
  "filter",
  () => fromArray(lotsOfNumbers).filter(isEven).first(),
  () => lotsOfNumbers.filter(isEven),
  () => _.filter(lotsOfNumbers, isEven),
)

bench(
  "flat",
  () => fromArray(jaggedArray).flat().first(),
  () => (jaggedArray as any).flat(),
  () => _.flatten(jaggedArray),
)

const halfDupes = dupes(0, 50, 100)
bench(
  "distinct",
  () => fromArray(halfDupes).distinct().first(),
  undefined,
  () => _.uniq(halfDupes),
)

const firstConcatArray = arr(0, 100)
const secondConcatArray = arr(50, 150)
bench(
  "concat",
  () =>
    fromArray(firstConcatArray).concat(fromArray(secondConcatArray)).first(),
  () => firstConcatArray.concat(secondConcatArray),
  () => _.concat(firstConcatArray, secondConcatArray),
)
