// tslint:disable: max-classes-per-file
import { makeNoise2D, makeNoise3D, makeNoise4D } from "open-simplex-noise";
import { constant, identity } from "./util";

const DONE = Symbol("done");
type Tramp<T> = () => typeof DONE | T;

export class Seq<T> {
  public static MAX_YIELDS = 1_000_000;

  public static fromArray<T>(data: T[]): Seq<T> {
    return new Seq(() => {
      const len = data.length;
      let i = 0;
      return () => (i >= len ? DONE : data[i++]!);
    });
  }

  public static iterate<T>(fn: (current: T) => T, start: T): Seq<T> {
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

  public static simplex2D(
    fn: () => [number, number],
    /* istanbul ignore next */
    seed: number = Date.now()
  ): Seq<number> {
    const noise2D = makeNoise2D(seed);
    const step = () => noise2D(...fn());

    return Seq.iterate(step, step());
  }

  public static simplex3D(
    fn: () => [number, number, number],
    /* istanbul ignore next */
    seed: number = Date.now()
  ): Seq<number> {
    const noise3D = makeNoise3D(seed);
    const step = () => noise3D(...fn());

    return Seq.iterate(step, step());
  }

  public static simplex4D(
    fn: () => [number, number, number, number],
    /* istanbul ignore next */
    seed: number = Date.now()
  ): Seq<number> {
    const noise4D = makeNoise4D(seed);
    const step = () => noise4D(...fn());

    return Seq.iterate(step, step());
  }

  public static random(): Seq<number> {
    /* istanbul ignore next */
    return Seq.iterate(() => Math.random(), Math.random());
  }

  public static of<T>(...values: T[]): Seq<T> {
    return this.fromArray(values);
  }

  public static range(start: number, end: number, step = 1): Seq<number> {
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

  public static cycle<T>(items: T[]): Seq<T> {
    return new Seq<T>(() => {
      const len = items.length;

      let i = 0;
      return () => items[i++ % len];
    });
  }

  /* istanbul ignore next */
  public static repeat<T>(value: T, times = Infinity): Seq<T> {
    return Seq.repeatedly(constant(value), times);
  }

  public static repeatedly<T>(
    value: () => T,
    /* istanbul ignore next */
    times = Infinity
  ): Seq<T> {
    return new Seq(() => {
      let index = 0;
      return () => (index++ + 1 > times ? DONE : value());
    });
  }

  public static empty(): Seq<never> {
    /* istanbul ignore next */
    return Seq.fromArray([]);
  }

  public static infinite(): Seq<number> {
    return Seq.range(0, Infinity);
  }

  public static zipWith<T1, T2, T3>(
    fn: (
      [result1, result2]: [T1, T2] | [T1, undefined] | [undefined, T2],
      index: number
    ) => T3,
    seq1: Seq<T1>,
    seq2: Seq<T2>
  ): Seq<T3> {
    return new Seq(() => {
      const next1 = seq1.createTrampoline();
      const next2 = seq2.createTrampoline();

      let counter = 0;

      return () => {
        const result1 = next1();
        const result2 = next2();

        /* istanbul ignore next */
        if (result1 === DONE && result2 === DONE) {
          return DONE;
        }

        /* istanbul ignore next */
        if (result1 === DONE && result2 !== DONE) {
          return fn([undefined, result2], counter++);
        }

        /* istanbul ignore next */
        if (result1 !== DONE && result2 === DONE) {
          return fn([result1, undefined], counter++);
        }

        /* istanbul ignore next */
        return fn([result1 as T1, result2 as T2], counter++);
      };
    });
  }

  public static zip<T1, T2>(
    seq1: Seq<T1>,
    seq2: Seq<T2>
  ): Seq<[T1 | undefined, T2 | undefined]> {
    return this.zipWith(identity, seq1, seq2);
  }

  public static zip3With<T1, T2, T3, T4>(
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
    return new Seq(() => {
      const next1 = seq1.createTrampoline();
      const next2 = seq2.createTrampoline();
      const next3 = seq3.createTrampoline();

      let counter = 0;

      return () => {
        const result1 = next1();
        const result2 = next2();
        const result3 = next3();

        /* istanbul ignore next */
        if (result1 === DONE && result2 === DONE && result3 === DONE) {
          return DONE;
        }

        /* istanbul ignore next */
        if (result1 !== DONE && result2 === DONE && result3 === DONE) {
          return fn([result1, undefined, undefined], counter++);
        }

        /* istanbul ignore next */
        if (result1 !== DONE && result2 !== DONE && result3 === DONE) {
          return fn([result1, result2, undefined], counter++);
        }

        /* istanbul ignore next */
        if (result1 !== DONE && result2 === DONE && result3 !== DONE) {
          return fn([result1, undefined, result3], counter++);
        }

        /* istanbul ignore next */
        if (result1 === DONE && result2 !== DONE && result3 === DONE) {
          return fn([undefined, result2, undefined], counter++);
        }

        /* istanbul ignore next */
        if (result1 === DONE && result2 !== DONE && result3 !== DONE) {
          return fn([undefined, result2, result3], counter++);
        }

        /* istanbul ignore next */
        if (result1 === DONE && result2 === DONE && result3 !== DONE) {
          return fn([undefined, undefined, result3], counter++);
        }

        /* istanbul ignore next */
        return fn([result1 as T1, result2 as T2, result3 as T3], counter++);
      };
    });
  }

  public static zip3<T1, T2, T3>(
    seq1: Seq<T1>,
    seq2: Seq<T2>,
    seq3: Seq<T3>
  ): Seq<[T1 | undefined, T2 | undefined, T3 | undefined]> {
    /* istanbul ignore next */
    return this.zip3With(identity, seq1, seq2, seq3);
  }

  public static concat<T>(...items: Array<Seq<T>>): Seq<T> {
    /* istanbul ignore next */
    const [head, ...tail] = items;

    /* istanbul ignore next */
    return head.concat(...tail);
  }

  public static interleave<T>(...items: Array<Seq<T>>): Seq<T> {
    /* istanbul ignore next */
    const [head, ...tail] = items;

    /* istanbul ignore next */
    return head.interleave(...tail);
  }

  private yields = 0;

  constructor(private source: () => Tramp<T>) {}

  public map<U>(fn: (value: T, index: number) => U): Seq<U> {
    return new Seq(() => {
      const parentNext = this.createTrampoline();
      let counter = 0;

      return () => {
        const result = parentNext();

        if (result === DONE) {
          return DONE;
        }

        return fn(result, counter++);
      };
    });
  }

  public window(size: number, allowPartialWindow = true): Seq<T[]> {
    const self: Seq<T> = this;

    return new Seq(() => {
      let head: Seq<T> = self;

      return () => {
        const items = head.take(size).toArray();

        /* istanbul ignore next */
        if (!allowPartialWindow && items.length < size) {
          return DONE;
        }

        head = head.skip(size);

        return items;
      };
    });
  }

  public pairwise(): Seq<[T, T]> {
    return (this.window(2, false) as unknown) as Seq<[T, T]>;
  }

  public isEmpty(): boolean {
    const next = this.createTrampoline();
    return next() === DONE;
  }

  public tap(fn: (value: T, index: number) => void): Seq<T> {
    return this.map((v, k) => {
      fn(v, k);

      return v;
    });
  }

  public log(): Seq<T> {
    /* istanbul ignore next */
    // tslint:disable-next-line: no-console
    return this.tap((v, k) => console.log([k, v]));
  }

  public flatMap<U>(fn: (value: T, index: number) => U[]): Seq<U> {
    return this.map(fn).flat();
  }

  public flat<U>(this: Seq<U[]>): Seq<U> {
    return new Seq(() => {
      const next = this.createTrampoline();

      let items = next();
      let counter = 0;

      return () => {
        if (items === DONE) {
          return DONE;
        }

        if (counter >= items.length) {
          items = next();
          counter = 0;
        }

        if (items === DONE) {
          return DONE;
        }

        return items[counter++];
      };
    });
  }

  public filter(fn: (value: T, index: number) => unknown): Seq<T> {
    return new Seq(() => {
      const next = this.createTrampoline();

      let counter = 0;

      return () => {
        while (true) {
          const item = next();

          if (item === DONE) {
            return DONE;
          }

          if (fn(item, counter++)) {
            return item;
          }
        }
      };
    });
  }

  public concat(...tail: Array<Seq<T>>): Seq<T> {
    return new Seq(() => {
      const nexts = [
        this.createTrampoline(),
        ...tail.map(s => s.createTrampoline())
      ];

      return () => {
        while (true) {
          if (nexts.length === 0) {
            return DONE;
          }

          const currentSeq = nexts[0];
          const item = currentSeq();

          if (item === DONE) {
            nexts.shift();
            continue;
          }

          return item;
        }
      };
    });
  }

  public interleave(...tail: Array<Seq<T>>): Seq<T> {
    return new Seq(() => {
      const nexts = [this.source(), ...tail.map(s => s.source())];

      let index = 0;

      return () => {
        while (true) {
          /* istanbul ignore next */
          if (nexts.length === 0) {
            return DONE;
          }

          const boundedIndex = index++ % nexts.length;
          const next = nexts[boundedIndex];
          const item = next();

          if (item === DONE) {
            nexts.splice(boundedIndex, 1);
            continue;
          }

          return item;
        }
      };
    });
  }

  public interpose(separator: T): Seq<T> {
    return new Seq(() => {
      const next = this.createTrampoline();

      let backPressure: T | undefined;
      let lastWasSep = true;

      return () => {
        if (backPressure) {
          const previousItem = backPressure;
          backPressure = undefined;
          lastWasSep = false;
          return previousItem;
        }

        const item = next();

        if (item === DONE) {
          return DONE;
        }

        if (!lastWasSep) {
          lastWasSep = true;
          backPressure = item;
          return separator;
        }

        lastWasSep = false;
        return item;
      };
    });
  }

  public distinctBy<U>(fn: (value: T) => U): Seq<T> {
    const seen = new Set<U>();

    return this.filter(value => {
      const compareBy = fn(value);

      if (seen.has(compareBy)) {
        return false;
      }

      seen.add(compareBy);

      return true;
    });
  }

  public distinct(): Seq<T> {
    return this.distinctBy(identity);
  }

  public partitionBy(
    fn: (value: T, index: number) => unknown
  ): [Seq<T>, Seq<T>] {
    const self = this;

    const trueBackpressure: T[] = [];
    const falseBackpressure: T[] = [];

    let previousSource: ReturnType<typeof self.source> | undefined;

    const singletonTrampoline = () => {
      if (!previousSource) {
        previousSource = self.createTrampoline();
      }

      return previousSource!;
    };

    return [
      new Seq(() => {
        const next = singletonTrampoline();

        let counter = 0;

        return () => {
          while (true) {
            if (trueBackpressure.length > 0) {
              return trueBackpressure.shift()!;
            }

            const item = next();

            /* istanbul ignore next */
            if (item === DONE) {
              return DONE;
            }

            if (fn(item, counter++)) {
              return item;
            } else {
              falseBackpressure.push(item);
            }
          }
        };
      }),

      new Seq(() => {
        const next = singletonTrampoline();

        let counter = 0;

        return () => {
          while (true) {
            if (falseBackpressure.length > 0) {
              return falseBackpressure.shift()!;
            }

            const item = next();

            /* istanbul ignore next */
            if (item === DONE) {
              return DONE;
            }

            if (!fn(item, counter++)) {
              return item;
            } else {
              trueBackpressure.push(item);
            }
          }
        };
      })
    ];
  }

  public includes(value: T): boolean {
    return !!this.filter(a => a === value).first();
  }

  public find(fn: (value: T, index: number) => unknown): T | undefined {
    return this.filter(fn).first();
  }

  public reduce<A>(fn: (sum: A, value: T, index: number) => A, initial: A): A {
    return this.toArray().reduce(fn, initial);
  }

  public chain<U>(fn: (value: Seq<T>) => U): U {
    return fn(this);
  }

  public some(fn: (value: T, index: number) => unknown): boolean {
    let counter = 0;

    for (const v of this) {
      if (fn(v, counter++)) {
        return true;
      }
    }

    return false;
  }

  public every(fn: (value: T, index: number) => unknown): boolean {
    let counter = 0;
    for (const v of this) {
      if (!fn(v, counter++)) {
        return false;
      }
    }

    return true;
  }

  public takeWhile(fn: (value: T, index: number) => unknown): Seq<T> {
    return new Seq(() => {
      const next = this.createTrampoline();

      let counter = 0;

      return () => {
        const item = next();

        /* istanbul ignore next */
        if (item === DONE) {
          return DONE;
        }

        if (!fn(item, counter++)) {
          return DONE;
        }

        return item;
      };
    });
  }

  public take(num: number): Seq<T> {
    return new Seq(() => {
      const next = this.createTrampoline();

      let i = 0;

      return () => {
        if (i++ >= num) {
          return DONE;
        }

        const item = next();

        if (item === DONE) {
          return DONE;
        }

        return item;
      };
    });
  }

  public skipWhile(fn: (value: T, index: number) => unknown): Seq<T> {
    return new Seq(() => {
      const next = this.createTrampoline();

      let counter = 0;

      return () => {
        while (true) {
          const item = next();

          /* istanbul ignore next */
          if (item === DONE) {
            return DONE;
          }

          if (fn(item, counter++)) {
            continue;
          }

          return item;
        }
      };
    });
  }

  public skip(num: number): Seq<T> {
    return new Seq(() => {
      const next = this.createTrampoline();

      let doneSkipping = false;

      return () => {
        if (!doneSkipping) {
          for (let i = 0; i < num; i++) {
            const skippedItem = next();

            /* istanbul ignore next */
            if (skippedItem === DONE) {
              return DONE;
            }
          }

          doneSkipping = true;
        }

        const item = next();

        /* istanbul ignore next */
        if (item === DONE) {
          return DONE;
        }

        return item;
      };
    });
  }

  public nth(i: number): T | undefined {
    return this.skip(i - 1).first();
  }

  public index(i: number): T | undefined {
    return this.skip(i).first();
  }

  public first(): T | undefined {
    const next = this.createTrampoline();

    const item = next();

    if (item === DONE) {
      return undefined;
    }

    return item;
  }

  public zipWith<T2, T3>(
    fn: (
      [result1, result2]: [T, T2] | [T, undefined] | [undefined, T2],
      index: number
    ) => T3,
    seq2: Seq<T2>
  ): Seq<T3> {
    /* istanbul ignore next */
    return Seq.zipWith(fn, this, seq2);
  }

  public zip<T2>(seq2: Seq<T2>): Seq<[T | undefined, T2 | undefined]> {
    /* istanbul ignore next */
    return Seq.zip(this, seq2);
  }

  public zip2With<T2, T3, T4>(
    fn: (
      [result1, result2, result3]:
        | [T, T2, T3]
        | [T, undefined, undefined]
        | [T, T2, undefined]
        | [T, undefined, T3]
        | [undefined, T2, undefined]
        | [undefined, T2, T3]
        | [undefined, undefined, T3],
      index: number
    ) => T4,
    seq2: Seq<T2>,
    seq3: Seq<T3>
  ): Seq<T4> {
    /* istanbul ignore next */
    return Seq.zip3With(fn, this, seq2, seq3);
  }

  public zip2<T2, T3>(
    seq2: Seq<T2>,
    seq3: Seq<T3>
  ): Seq<[T | undefined, T2 | undefined, T3 | undefined]> {
    /* istanbul ignore next */
    return Seq.zip3(this, seq2, seq3);
  }

  public *[Symbol.iterator]() {
    const next = this.createTrampoline();

    while (true) {
      const item = next();

      if (item === DONE) {
        return;
      }

      yield item;
    }
  }

  public toArray(): T[] {
    return [...this];
  }

  public forEach(fn: (value: T, index: number) => void): void {
    let counter = 0;
    for (const result of this) {
      fn(result, counter++);
    }
  }

  public sumBy(fn: (value: T) => number): number {
    return this.map(fn).reduce((sum, num) => sum + num, 0);
  }

  public sum(this: Seq<number>): number {
    return this.sumBy(identity);
  }

  public averageBy(fn: (value: T) => number): number {
    const all = this.toArray();
    return all.map(fn).reduce((sum, num) => sum + num, 0) / all.length;
  }

  public average(this: Seq<number>): number {
    return this.averageBy(identity);
  }

  public frequencies(): Map<T, number> {
    return this.reduce((sum, value) => {
      if (sum.has(value)) {
        return sum.set(value, sum.get(value)! + 1);
      }

      return sum.set(value, 0 + 1);
    }, new Map<T, number>());
  }

  public groupBy<U>(fn: (item: T) => U): Map<U, T[]> {
    return this.reduce((sum, item) => {
      const group = fn(item);

      /* istanbul ignore next */
      if (sum.has(group)) {
        const currentArray = sum.get(group)!;
        currentArray?.push(item);
        return sum.set(group, currentArray);
      }

      return sum.set(group, [item]);
    }, new Map<U, T[]>());
  }

  public createTrampoline() {
    const nextCallback = this.source();

    return () => {
      const result = nextCallback();

      if (++this.yields > Seq.MAX_YIELDS) {
        throw new Error(
          `Seq has yielded ${this.yields} times. If this is okay, set Seq.MAX_YIELDS to a higher number (currently ${Seq.MAX_YIELDS}).`
        );
      }

      return result;
    };
  }
}
