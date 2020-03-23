import { DONE, Seq } from "./Seq"
import { constant, identity, first } from "@tdreyno/figment"

export const fromArray = <T>(data: T[]) =>
  new Seq(() => {
    const len = data.length
    let i = 0

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (): typeof DONE | T => (i >= len ? DONE : data[i++]!)
  })

export const iterate = <T>(fn: (current: T) => T, start: T) =>
  new Seq(() => {
    let counter = 0
    let previous: T = start

    return (): T => {
      if (counter++ === 0) {
        return start
      }

      previous = fn(previous)
      counter++

      return previous
    }
  })

export const fib = () => iterate(([a, b]) => [b, a + b], [0, 1]).map(first)

export const of = <T>(head: T, ...values: T[]) => fromArray([head, ...values])

export const range = (start: number, end: number, step = 1) =>
  new Seq(() => {
    const isForwards = start < end
    let i = 0

    return isForwards
      ? (): typeof DONE | number => {
          const num = start + i

          if (num > end) {
            return DONE
          }

          i += step

          return num
        }
      : (): typeof DONE | number => {
          const num = start - i

          if (num < end) {
            return DONE
          }

          i += step

          return num
        }
  })

export const cycle = <T>(items: T[]) =>
  new Seq(() => {
    const len = items.length
    let i = 0

    return (): T => items[i++ % len]
  })

export const repeatedly = <T>(value: () => T, times = Infinity) =>
  new Seq(() => {
    let index = 0
    return (): typeof DONE | T => (index++ + 1 > times ? DONE : value())
  })

export const repeat = <T>(value: T, times = Infinity) =>
  repeatedly(constant(value), times)

export const empty = () => fromArray([])

export const infinite = () => range(0, Infinity)

export const zipWith = <T1, T2, T3>(
  fn: (
    [result1, result2]: [T1, T2] | [T1, undefined] | [undefined, T2],
    index: number,
  ) => T3,
  seq1: Seq<T1>,
  seq2: Seq<T2>,
) => seq1.zipWith(fn, seq2)

export const zip = <T1, T2>(seq1: Seq<T1>, seq2: Seq<T2>) =>
  zipWith(identity, seq1, seq2)

export const zip3With = <T1, T2, T3, T4>(
  fn: (
    [result1, result2, resul3]:
      | [T1, T2, T3]
      | [T1, undefined, undefined]
      | [T1, T2, undefined]
      | [T1, undefined, T3]
      | [undefined, T2, undefined]
      | [undefined, T2, T3]
      | [undefined, undefined, T3],
    index: number,
  ) => T4,
  seq1: Seq<T1>,
  seq2: Seq<T2>,
  seq3: Seq<T3>,
) => seq1.zip2With(fn, seq2, seq3)

export const zip3 = <T1, T2, T3>(seq1: Seq<T1>, seq2: Seq<T2>, seq3: Seq<T3>) =>
  zip3With(identity, seq1, seq2, seq3)

export const concat = <T>(head: Seq<T>, ...remaining: Array<Seq<T>>) =>
  head.concat(...remaining)

export const interleave = <T>(head: Seq<T>, ...remaining: Array<Seq<T>>) =>
  head.interleave(...remaining)
