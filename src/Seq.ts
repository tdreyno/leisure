import { makeNoise2D, makeNoise3D, makeNoise4D } from "open-simplex-noise";
import { constant, identity } from "./util";

// tslint:disable: max-classes-per-file

export class Seq<K, T> {
  public static MAX_YIELDS = 1_000_000;

  public static fromArray<T>(data: T[]): Seq<number, T> {
    return new Seq(() => data.entries());
  }

  public static fromSet<T>(data: Set<T>): Seq<T, T> {
    return new Seq(() => data.entries());
  }

  public static fromMap<K, T>(data: Map<K, T>): Seq<K, T> {
    return new Seq(() => data.entries());
  }

  public static fromIterator<K, T>(
    data: () => IterableIterator<[K, T]>
  ): Seq<K, T> {
    /* istanbul ignore next */
    return new Seq(data);
  }

  public static fromGenerator<K, T>(
    data: (this: Seq<K, T>) => Generator<[K, T]>
  ): Seq<K, T> {
    return new Seq(data);
  }

  public static iterate<T>(fn: (current: T) => T, start: T): Seq<number, T> {
    return Seq.fromGenerator(function*() {
      let index = 0;
      let previous: T = start;

      yield [index++, start];

      while (true) {
        previous = fn(previous);
        yield [index++, previous];
        this.didYield();
      }
    });
  }

  public static simplex2D(
    fn: () => [number, number],
    seed: number = Date.now()
  ): Seq<number, number> {
    const noise2D = makeNoise2D(seed);
    const step = () => noise2D(...fn());

    return Seq.iterate(step, step());
  }

  public static simplex3D(
    fn: () => [number, number, number],
    seed: number = Date.now()
  ): Seq<number, number> {
    const noise3D = makeNoise3D(seed);
    const step = () => noise3D(...fn());

    return Seq.iterate(step, step());
  }

  public static simplex4D(
    fn: () => [number, number, number, number],
    seed: number = Date.now()
  ): Seq<number, number> {
    const noise4D = makeNoise4D(seed);
    const step = () => noise4D(...fn());

    return Seq.iterate(step, step());
  }

  public static random(): Seq<number, number> {
    return Seq.iterate(() => Math.random(), Math.random());
  }

  public static of<T>(...values: T[]): Seq<number, T> {
    return Seq.fromGenerator(function*() {
      for (let i = 0; i < values.length; i++) {
        yield [i, values[i]];
        this.didYield();
      }
    });
  }

  public static range(
    start: number,
    end: number,
    step = 1
  ): Seq<number, number> {
    return Seq.fromGenerator(function*() {
      const isForwards = start < end;

      if (isForwards) {
        for (let i = 0; start + i <= end; i += step) {
          yield [i, start + i];
          this.didYield();
        }
      } else {
        for (let i = 0; start - i >= end; i += step) {
          yield [i, start - i];
          this.didYield();
        }
      }
    });
  }

  public static cycle<T>(items: T[]): Seq<number, T> {
    return Seq.fromGenerator(function*() {
      let index = 0;

      while (true) {
        for (const item of items) {
          yield [index++, item];
          this.didYield();
        }
      }
    });
  }

  public static repeat<T>(value: T, times = Infinity): Seq<number, T> {
    return Seq.repeatedly(constant(value), times);
  }

  public static repeatedly<T>(
    value: () => T,
    times = Infinity
  ): Seq<number, T> {
    return Seq.fromGenerator(function*() {
      let index = 0;

      while (true) {
        if (index + 1 > times) {
          return;
        }

        yield [index++, value()];
        this.didYield();
      }
    });
  }

  public static empty(): Seq<number, never> {
    /* istanbul ignore next */
    return Seq.fromArray([]);
  }

  public static infinite(): Seq<number, number> {
    return Seq.range(0, Infinity);
  }

  public static zipWith<K1, T1, K2, T2, K3, T3>(
    fn: (
      [result1, result2]: [T1, T2] | [T1, undefined] | [undefined, T2],
      index: number
    ) => [K3, T3],
    seq1: Seq<K1, T1>,
    seq2: Seq<K2, T2>
  ): Seq<K3, T3> {
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

        if (result1.done && !result2.done) {
          yield fn([undefined, result2.value[1]], counter);
          this.didYield();
        } else if (!result1.done && result2.done) {
          yield fn([result1.value[1], undefined], counter);
          this.didYield();
        } else if (!result1.done && !result2.done) {
          yield fn([result1.value[1], result2.value[1]], counter);
          this.didYield();
        }

        counter++;
      }
    });
  }

  public static zip<K1, T1, K2, T2>(
    seq1: Seq<K1, T1>,
    seq2: Seq<K2, T2>
  ): Seq<number, [T1 | undefined, T2 | undefined]> {
    return this.zipWith(
      ([result1, result2], index) => [index, [result1, result2]],
      seq1,
      seq2
    );
  }

  public static concat<K, T>(...items: Array<Seq<K, T>>): Seq<K, T> {
    /* istanbul ignore next */
    const [head, ...tail] = items;
    return head.concat(...tail);
  }

  public static interleave<K, T>(...items: Array<Seq<K, T>>): Seq<K, T> {
    /* istanbul ignore next */
    const [head, ...tail] = items;
    return head.interleave(...tail);
  }

  private yields = 0;

  constructor(
    private source: (
      this: Seq<K, T>
    ) => Generator<[K, T]> | IterableIterator<[K, T]>
  ) {}

  public map<U>(fn: (value: T, key: K) => U): Seq<K, U> {
    const self = this;

    return new Seq(function*() {
      const iterator = self.source();

      for (const item of iterator) {
        yield [item[0], fn(item[1], item[0])];
        this.didYield();
      }
    });
  }

  public window(size: number, allowPartialWindow = true): Seq<number, T[]> {
    let self: Seq<K, T> = this;

    return new Seq(function*() {
      let index = 0;

      while (true) {
        const items = self.take(size).toArray();
        self = self.skip(size);

        /* istanbul ignore next */
        if (!allowPartialWindow && items.length < size) {
          return;
        }

        yield [index++, items];

        /* istanbul ignore next */
        if (items.length < size) {
          return;
        }
      }
    });
  }

  public pairwise(): Seq<number, [T, T]> {
    return (this.window(2, false) as unknown) as Seq<number, [T, T]>;
  }

  public isEmpty(): boolean {
    const iterator = this.source();

    const item = iterator.next();

    return !!item.done;
  }

  public tap(fn: (value: T, key: K) => void): Seq<K, T> {
    return this.map((v, k) => {
      fn(v, k);

      return v;
    });
  }

  public log(): Seq<K, T> {
    /* istanbul ignore next */
    // tslint:disable-next-line: no-console
    return this.tap((v, k) => console.log([k, v]));
  }

  public flatMap<U>(fn: (value: T, key: K) => U[]): Seq<number, U> {
    return this.map(fn).flat();
  }

  public flat<U>(this: Seq<K, U[]>): Seq<number, U> {
    const self = this;

    return new Seq(function*() {
      const iterator = self.source();

      let counter = 0;

      for (const [, items] of iterator) {
        // Something about the yield/generator requires
        // this not be a for-of loop
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < items.length; i++) {
          yield [counter++, items[i]];
          this.didYield();
        }
      }
    });
  }

  public filter(fn: (value: T, key: K) => unknown): Seq<K, T> {
    const self = this;

    return new Seq(function*() {
      const iterator = self.source();

      for (const item of iterator) {
        if (fn(item[1], item[0])) {
          yield item;
          this.didYield();
        }
      }
    });
  }

  public concat(...tail: Array<Seq<K, T>>): Seq<K, T> {
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

  public interleave(...tail: Array<Seq<K, T>>): Seq<K, T> {
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

  public interpose(separator: T): Seq<number, T> {
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
          yield [index++, separator];
        }

        yield [index++, item.value[1]];
        this.didYield();
      }
    });
  }

  public distinctBy<U>(fn: (value: T) => U): Seq<K, T> {
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

  public distinct(): Seq<K, T> {
    return this.distinctBy(identity);
  }

  public partitionBy(
    fn: (value: T, key: K) => unknown
  ): [Seq<K, T>, Seq<K, T>] {
    const self = this;

    const trueBackpressure: Array<[K, T]> = [];
    const falseBackpressure: Array<[K, T]> = [];

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

        while (true) {
          if (trueBackpressure.length > 0) {
            const item = trueBackpressure.shift();
            yield item;
            this.didYield();
            continue;
          }

          const { value, done } = iterator.next();

          /* istanbul ignore next */
          if (done) {
            return;
          }

          if (fn(value[1], value[0])) {
            yield value;
            this.didYield();
          } else {
            falseBackpressure.push(value);
          }
        }
      }),

      new Seq(function*() {
        const iterator = getIterator();

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

          if (!fn(value[1], value[0])) {
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

  public find(fn: (value: T, key: K) => unknown): T | undefined {
    return this.filter(fn).first();
  }

  public reduce<A>(fn: (sum: A, value: T, key: K) => A, initial: A): A {
    return this.toEntries().reduce(
      (sum, [key, value]) => fn(sum, value, key),
      initial
    );
  }

  public chain<U>(fn: (value: Seq<K, T>) => U): U {
    return fn(this);
  }

  public some(fn: (value: T, key: K) => unknown): boolean {
    for (const [k, v] of this) {
      if (fn(v, k)) {
        return true;
      }
    }

    return false;
  }

  public every(fn: (value: T, key: K) => unknown): boolean {
    for (const [k, v] of this) {
      if (!fn(v, k)) {
        return false;
      }
    }

    return true;
  }

  public takeWhile(fn: (value: T, key: K) => unknown): Seq<K, T> {
    const self = this;

    return new Seq(function*() {
      const iterator = self.source();

      while (true) {
        const result = iterator.next();

        /* istanbul ignore next */
        if (result.done) {
          return;
        }

        if (!fn(result.value[1], result.value[0])) {
          return;
        }

        yield result.value;
        this.didYield();
      }
    });
  }

  public take(num: number): Seq<K, T> {
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

  public skipWhile(fn: (value: T, key: K) => unknown): Seq<K, T> {
    const self = this;

    return new Seq(function*() {
      const iterator = self.source();

      while (true) {
        const result = iterator.next();

        /* istanbul ignore next */
        if (result.done) {
          return;
        }

        if (fn(result.value[1], result.value[0])) {
          continue;
        }

        yield result.value;
        this.didYield();
      }
    });
  }

  public skip(num: number): Seq<K, T> {
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

  public index(i: number): T | undefined {
    return this.take(i + 1).toArray()[i];
  }

  public first(): T | undefined {
    return this.index(0);
  }

  public zipWith<K2, T2, K3, T3>(
    fn: (
      [result1, result2]: [T, T2] | [T, undefined] | [undefined, T2],
      index: number
    ) => [K3, T3],
    seq2: Seq<K2, T2>
  ): Seq<K3, T3> {
    /* istanbul ignore next */
    return Seq.zipWith(fn, this, seq2);
  }

  public zip<K2, T2>(
    seq2: Seq<K2, T2>
  ): Seq<number, [T | undefined, T2 | undefined]> {
    /* istanbul ignore next */
    return Seq.zip(this, seq2);
  }

  public [Symbol.iterator]() {
    return this.source();
  }

  public toEntries(): Array<[K, T]> {
    return [...this];
  }

  public toArray(): T[] {
    return this.toEntries().map(([_, value]) => value);
  }

  public toSet(): Set<T> {
    return new Set(this.toArray());
  }

  public toMap(): Map<K, T> {
    return new Map(this.toEntries());
  }

  public forEach(fn: (value: T, key: K) => void): void {
    for (const result of this) {
      fn(result[1], result[0]);
    }
  }

  public sumBy(fn: (value: T) => number): number {
    return this.map(fn).reduce((sum, num) => sum + num, 0);
  }

  public sum(this: Seq<any, number>): number {
    return this.sumBy(identity);
  }

  public averageBy(fn: (value: T) => number): number {
    const all = this.toArray();
    return all.map(fn).reduce((sum, num) => sum + num, 0) / all.length;
  }

  public average(this: Seq<any, number>): number {
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
