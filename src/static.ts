import { DONE, Seq } from "./Seq";
import { constant, identity } from "./util";

export function fromArray<T>(data: T[]): Seq<T> {
  return new Seq(() => {
    const len = data.length;
    let i = 0;
    return () => (i >= len ? DONE : data[i++]!);
  });
}

export function iterate<T>(fn: (current: T) => T, start: T): Seq<T> {
  return new Seq(() => {
    let counter = 0;
    let previous: T = start;

    return () => {
      if (counter++ === 0) {
        return start;
      }

      previous = fn(previous);
      counter++;

      return previous;
    };
  });
}

export function random(): Seq<number> {
  /* istanbul ignore next */
  return iterate(() => Math.random(), Math.random());
}

export function of<T>(...values: T[]): Seq<T> {
  return fromArray(values);
}

export function range(start: number, end: number, step = 1): Seq<number> {
  const isForwards = start < end;

  return new Seq(() => {
    let i = 0;

    return isForwards
      ? () => {
          const num = start + i;

          if (num > end) {
            return DONE;
          }

          i += step;

          return num;
        }
      : () => {
          const num = start - i;

          if (num < end) {
            return DONE;
          }

          i += step;

          return num;
        };
  });
}

export function cycle<T>(items: T[]): Seq<T> {
  return new Seq<T>(() => {
    const len = items.length;

    let i = 0;
    return () => items[i++ % len];
  });
}

/* istanbul ignore next */
export function repeat<T>(value: T, times = Infinity): Seq<T> {
  return repeatedly(constant(value), times);
}

export function repeatedly<T>(
  value: () => T,
  /* istanbul ignore next */
  times = Infinity
): Seq<T> {
  return new Seq(() => {
    let index = 0;
    return () => (index++ + 1 > times ? DONE : value());
  });
}

export function empty(): Seq<never> {
  /* istanbul ignore next */
  return fromArray([]);
}

export function infinite(): Seq<number> {
  return range(0, Infinity);
}

export function zipWith<T1, T2, T3>(
  fn: (
    [result1, result2]: [T1, T2] | [T1, undefined] | [undefined, T2],
    index: number
  ) => T3,
  seq1: Seq<T1>,
  seq2: Seq<T2>
): Seq<T3> {
  /* istanbul ignore next */
  return seq1.zipWith(fn, seq2);
}

export function zip<T1, T2>(
  seq1: Seq<T1>,
  seq2: Seq<T2>
): Seq<[T1 | undefined, T2 | undefined]> {
  /* istanbul ignore next */
  return zipWith(identity, seq1, seq2);
}

export function zip3With<T1, T2, T3, T4>(
  fn: (
    [result1, result2, resul3]:
      | [T1, T2, T3]
      | [T1, undefined, undefined]
      | [T1, T2, undefined]
      | [T1, undefined, T3]
      | [undefined, T2, undefined]
      | [undefined, T2, T3]
      | [undefined, undefined, T3],
    index: number
  ) => T4,
  seq1: Seq<T1>,
  seq2: Seq<T2>,
  seq3: Seq<T3>
): Seq<T4> {
  /* istanbul ignore next */
  return seq1.zip2With(fn, seq2, seq3);
}

export function zip3<T1, T2, T3>(
  seq1: Seq<T1>,
  seq2: Seq<T2>,
  seq3: Seq<T3>
): Seq<[T1 | undefined, T2 | undefined, T3 | undefined]> {
  /* istanbul ignore next */
  return zip3With(identity, seq1, seq2, seq3);
}

export function concat<T>(...items: Array<Seq<T>>): Seq<T> {
  /* istanbul ignore next */
  const [head, ...tail] = items;

  /* istanbul ignore next */
  return head.concat(...tail);
}

export function interleave<T>(...items: Array<Seq<T>>): Seq<T> {
  /* istanbul ignore next */
  const [head, ...tail] = items;

  /* istanbul ignore next */
  return head.interleave(...tail);
}
