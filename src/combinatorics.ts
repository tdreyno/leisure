import { DONE, Seq } from "./Seq";
import { empty, of } from "./static";

export function cartesianProduct<T>(a: T[]): Seq<T[]>;
export function cartesianProduct<T, U>(a: T[], b: U[]): Seq<[T, U]>;
export function cartesianProduct<T, U, V>(
  a: T[],
  b: U[],
  c: V[]
): Seq<[T, U, V]>;
export function cartesianProduct<T, U, V, W>(
  a: T[],
  b: U[],
  c: V[],
  d: W[]
): Seq<[T, U, V, W]>;
export function cartesianProduct<T, U, V, W, X>(
  a: T[],
  b: U[],
  c: V[],
  d: W[],
  e: X[]
): Seq<[T, U, V, W, X]>;
export function cartesianProduct<T, U, V, W, X, Y>(
  a: T[],
  b: U[],
  c: V[],
  d: W[],
  e: X[],
  f: Y[]
): Seq<[T, U, V, W, X, Y]>;
export function cartesianProduct<T, U, V, W, X, Y, Z>(
  a: T[],
  b: U[],
  c: V[],
  d: W[],
  e: X[],
  f: Y[],
  g: Z[]
): Seq<[T, U, V, W, X, Y, Z]>;
export function cartesianProduct<T>(...inputs: T[][]): Seq<T[]> {
  if (inputs.length === 0) {
    return empty();
  }

  if (inputs.length === 1) {
    return of(inputs[0]);
  }

  return new Seq(() => {
    const dm: Array<[number, number]> = [];
    let length: number;

    for (let f = 1, l, i = inputs.length; i--; f *= l) {
      dm[i] = [f, (l = inputs[i].length)];
      length = f * l;
    }

    let n = 0;

    return () => {
      if (n >= length) {
        return DONE;
      }

      const c: T[] = [];

      for (let i = inputs.length; i--; ) {
        // tslint:disable-next-line: no-bitwise
        c[i] = inputs[i][((n / dm[i][0]) << 0) % dm[i][1]];
      }

      n++;

      return c;
    };
  });
}

export function powerSet<T>(...items: T[]): Seq<Set<T>> {
  const numberOfCombinations = 2 ** items.length;

  return new Seq(() => {
    let counter = 0;

    return () => {
      if (counter >= numberOfCombinations) {
        return DONE;
      }

      const set: Set<any> = new Set();

      for (
        let setElementIndex = 0;
        setElementIndex < items.length;
        setElementIndex += 1
      ) {
        // tslint:disable-next-line: no-bitwise
        if (counter & (1 << setElementIndex)) {
          set.add(items[setElementIndex]);
        }
      }

      counter++;

      return set;
    };
  });
}

// combination
// permutation
// permutationCombination
