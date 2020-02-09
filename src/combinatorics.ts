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
  } else if (inputs.length === 1) {
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

    return (): typeof DONE | T[] => {
      if (n >= length) {
        return DONE;
      }

      const c: T[] = [];

      for (let i = inputs.length; i--; ) {
        c[i] = inputs[i][((n / dm[i][0]) << 0) % dm[i][1]];
      }

      n++;

      return c;
    };
  });
}

export function powerSet<T>(items: T[]): Seq<Set<T>> {
  const numberOfCombinations = 2 ** items.length;

  return new Seq(() => {
    let counter = 0;

    return (): typeof DONE | Set<T> => {
      if (counter >= numberOfCombinations) {
        return DONE;
      }

      const set: Set<T> = new Set();

      for (
        let setElementIndex = 0;
        setElementIndex < items.length;
        setElementIndex += 1
      ) {
        if (counter & (1 << setElementIndex)) {
          set.add(items[setElementIndex]);
        }
      }

      counter++;

      return set;
    };
  });
}

export function combination<T>(
  items: T[],
  size: number = items.length
): Seq<T[]> {
  return new Seq(() => {
    const indexes: number[] = [];

    for (let j = 0; j < size; j++) {
      indexes[j] = j;
    }

    const n = items.length;
    let i = size - 1; // Index to keep track of maximum unsaturated element in array

    return (): typeof DONE | T[] => {
      // indexes[0] can only be n-size+1 exactly once - our termination condition!
      if (indexes[0] >= n - size + 1) {
        return DONE;
      }

      // If outer elements are saturated, keep decrementing i till you find unsaturated element
      while (i > 0 && indexes[i] === n - size + i) {
        i--;
      }

      const result = indexes.map(j => items[j]);

      indexes[i]++;

      // Reset each outer element to prev element + 1
      while (i < size - 1) {
        indexes[i + 1] = indexes[i] + 1;
        i++;
      }

      return result;
    };
  });
}

// permutation
// permutationCombination
