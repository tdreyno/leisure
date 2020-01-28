// tslint:disable: max-classes-per-file
import { makeNoise2D, makeNoise3D, makeNoise4D } from "open-simplex-noise";
import { constant, identity } from "./util";

export class Seq<T> {
  public static MAX_YIELDS = 1_000_000;

  public static fromArray<T>(data: T[]): Seq<T> {
    return new Seq(function*() {
      for (const [, item] of data.entries()) {
        yield item;
      }
    });
  }

  public static iterate<T>(fn: (current: T) => T, start: T): Seq<T> {
    return new Seq(function*() {
      let previous: T = start;

      yield start;

      while (true) {
        previous = fn(previous);
        yield previous;
        this.didYield();
      }
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
    return new Seq(function*() {
      const isForwards = start < end;

      if (isForwards) {
        for (let i = 0; start + i <= end; i += step) {
          yield start + i;
          this.didYield();
        }
      } else {
        for (let i = 0; start - i >= end; i += step) {
          yield start - i;
          this.didYield();
        }
      }
    });
  }

  public static cycle<T>(items: T[]): Seq<T> {
    return new Seq(function*() {
      while (true) {
        for (const item of items) {
          yield item;
          this.didYield();
        }
      }
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
    return new Seq(function*() {
      let index = 0;

      while (true) {
        if (index++ + 1 > times) {
          return;
        }

        yield value();
        this.didYield();
      }
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
    return new Seq(function*() {
      const iterator1 = seq1[Symbol.iterator]();
      const iterator2 = seq2[Symbol.iterator]();

      let counter = 0;

      while (true) {
        const result1 = iterator1.next();
        const result2 = iterator2.next();

        if (result1.done && result2.done) {
          return;
        }

        /* istanbul ignore next */
        if (result1.done && !result2.done) {
          yield fn([undefined, result2.value], counter);
          this.didYield();
        } else if (!result1.done && result2.done) {
          yield fn([result1.value, undefined], counter);
          this.didYield();
        } else if (!result1.done && !result2.done) {
          yield fn([result1.value, result2.value], counter);
          this.didYield();
        }

        counter++;
      }
    });
  }

  public static zip<T1, T2>(
    seq1: Seq<T1>,
    seq2: Seq<T2>
  ): Seq<[T1 | undefined, T2 | undefined]> {
    return this.zipWith(([a, b]) => [a, b], seq1, seq2);
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
    return new Seq(function*() {
      const iterator1 = seq1[Symbol.iterator]();
      const iterator2 = seq2[Symbol.iterator]();
      const iterator3 = seq3[Symbol.iterator]();

      let counter = 0;

      while (true) {
        const result1 = iterator1.next();
        const result2 = iterator2.next();
        const result3 = iterator3.next();

        if (result1.done && result2.done && result3.done) {
          return;
        }

        /* istanbul ignore next */
        if (!result1.done && result2.done && result3.done) {
          yield fn([result1.value, undefined, undefined], counter);
          this.didYield();
        } else if (!result1.done && !result2.done && result3.done) {
          yield fn([result1.value, result2.value, undefined], counter);
          this.didYield();
        } else if (!result1.done && result2.done && !result3.done) {
          yield fn([result1.value, undefined, result3.value], counter);
          this.didYield();
        } else if (result1.done && !result2.done && result3.done) {
          yield fn([undefined, result2.value, undefined], counter);
          this.didYield();
        } else if (result1.done && !result2.done && !result3.done) {
          yield fn([undefined, result2.value, result3.value], counter);
          this.didYield();
        } else if (result1.done && result2.done && !result3.done) {
          yield fn([undefined, undefined, result3.value], counter);
          this.didYield();
        } else if (!result1.done && !result2.done && !result3.done) {
          yield fn([result1.value, result2.value, result3.value], counter);
          this.didYield();
        }

        counter++;
      }
    });
  }

  public static zip3<T1, T2, T3>(
    seq1: Seq<T1>,
    seq2: Seq<T2>,
    seq3: Seq<T3>
  ): Seq<[T1 | undefined, T2 | undefined, T3 | undefined]> {
    /* istanbul ignore next */
    return this.zip3With(
      ([result1, result2, result3]) => [result1, result2, result3],
      seq1,
      seq2,
      seq3
    );
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

  constructor(private source: (this: Seq<T>) => Generator<T>) {}

  public map<U>(fn: (value: T, index: number) => U): Seq<U> {
    const self = this;

    return new Seq(function*() {
      const iterator = self.source();

      let counter = 0;
      for (const item of iterator) {
        yield fn(item, counter++);
        this.didYield();
      }
    });
  }

  public window(size: number, allowPartialWindow = true): Seq<T[]> {
    let self: Seq<T> = this;

    return new Seq(function*() {
      while (true) {
        const items = self.take(size).toArray();
        self = self.skip(size);

        /* istanbul ignore next */
        if (!allowPartialWindow && items.length < size) {
          return;
        }

        yield items;

        /* istanbul ignore next */
        if (items.length < size) {
          return;
        }
      }
    });
  }

  public pairwise(): Seq<[T, T]> {
    return (this.window(2, false) as unknown) as Seq<[T, T]>;
  }

  public isEmpty(): boolean {
    const iterator = this.source();

    const item = iterator.next();

    return !!item.done;
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
    const self = this;

    return new Seq(function*() {
      const iterator = self.source();

      for (const items of iterator) {
        // Something about the yield/generator requires
        // this not be a for-of loop
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < items.length; i++) {
          yield items[i];
          this.didYield();
        }
      }
    });
  }

  public filter(fn: (value: T, index: number) => unknown): Seq<T> {
    const self = this;

    return new Seq(function*() {
      const iterator = self.source();

      let counter = 0;
      for (const item of iterator) {
        if (fn(item, counter++)) {
          yield item;
          this.didYield();
        }
      }
    });
  }

  public concat(...tail: Array<Seq<T>>): Seq<T> {
    const self = this;

    return new Seq(function*() {
      const iterators = [self.source(), ...tail.map(s => s.source())];

      for (const iterator of iterators) {
        for (const item of iterator) {
          yield item;
          this.didYield();
        }
      }
    });
  }

  public interleave(...tail: Array<Seq<T>>): Seq<T> {
    const self = this;

    return new Seq(function*() {
      const iterators = [self.source(), ...tail.map(s => s.source())];

      let index = 0;

      while (true) {
        /* istanbul ignore next */
        if (iterators.length <= 0) {
          return;
        }

        const boundedIndex = index % iterators.length;
        const iterator = iterators[boundedIndex];

        const item = iterator.next();

        if (item.done) {
          iterators.splice(boundedIndex, 1);
          continue;
        }

        yield item.value;
        this.didYield();

        index++;
      }
    });
  }

  public interpose(separator: T): Seq<T> {
    const self = this;

    return new Seq(function*() {
      let index = 0;

      const iterator = self.source();

      while (true) {
        const item = iterator.next();

        if (item.done) {
          return;
        }

        if (index > 0) {
          yield separator;
          index++;
        }

        yield item.value;
        this.didYield();

        index++;
      }
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

    const getIterator = () => {
      if (!previousSource) {
        previousSource = self.source();
      }

      return previousSource!;
    };

    return [
      new Seq(function*() {
        const iterator = getIterator();

        let counter = 0;
        while (true) {
          if (trueBackpressure.length > 0) {
            const item = trueBackpressure.shift()!;
            yield item;
            this.didYield();
            continue;
          }

          const { value, done } = iterator.next();

          /* istanbul ignore next */
          if (done) {
            return;
          }

          if (fn(value, counter++)) {
            yield value;
            this.didYield();
          } else {
            falseBackpressure.push(value);
          }
        }
      }),

      new Seq(function*() {
        const iterator = getIterator();

        let counter = 0;
        while (true) {
          if (falseBackpressure.length > 0) {
            const item = falseBackpressure.shift();
            yield item;
            this.didYield();
            continue;
          }

          const { value, done } = iterator.next();

          /* istanbul ignore next */
          if (done) {
            return;
          }

          if (!fn(value, counter++)) {
            yield value;
            this.didYield();
          } else {
            trueBackpressure.push(value);
          }
        }
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
    const self = this;

    return new Seq(function*() {
      const iterator = self.source();

      let counter = 0;
      while (true) {
        const result = iterator.next();

        /* istanbul ignore next */
        if (result.done) {
          return;
        }

        if (!fn(result.value, counter++)) {
          return;
        }

        yield result.value;
        this.didYield();
      }
    });
  }

  public take(num: number): Seq<T> {
    const self = this;

    return new Seq(function*() {
      const iterator = self.source();

      for (let i = 0; i < num; i++) {
        const result = iterator.next();

        if (result.done) {
          return;
        }

        yield result.value;
        this.didYield();
      }
    });
  }

  public skipWhile(fn: (value: T, index: number) => unknown): Seq<T> {
    const self = this;

    return new Seq(function*() {
      const iterator = self.source();

      let counter = 0;
      while (true) {
        const result = iterator.next();

        /* istanbul ignore next */
        if (result.done) {
          return;
        }

        if (fn(result.value, counter++)) {
          continue;
        }

        yield result.value;
        this.didYield();
      }
    });
  }

  public skip(num: number): Seq<T> {
    const self = this;

    return new Seq(function*() {
      const iterator = self.source();

      for (let i = 0; i < num; i++) {
        const result = iterator.next();

        /* istanbul ignore next */
        if (result.done) {
          return;
        }
      }

      while (true) {
        const result = iterator.next();

        /* istanbul ignore next */
        if (result.done) {
          return;
        }

        yield result.value;
        this.didYield();
      }
    });
  }

  public nth(i: number): T | undefined {
    return this.take(i).toArray()[i - 1];
  }

  public index(i: number): T | undefined {
    return this.take(i + 1).toArray()[i];
  }

  public first(): T | undefined {
    return this.nth(1);
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

  public [Symbol.iterator]() {
    return this.source();
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

  // Needs to be public due to generator scoping issues.
  private didYield() {
    if (++this.yields > Seq.MAX_YIELDS) {
      throw new Error(
        `Seq has yielded ${this.yields} times. If this is okay, set Seq.MAX_YIELDS to a higher number (currently ${Seq.MAX_YIELDS}).`
      );
    }
  }
}
