import { identity } from "@tdreyno/figment"

export const DONE = Symbol()

type Tramp<T> = () => typeof DONE | T

export class Seq<T> {
  public static MAX_YIELDS = 1_000_000

  private yields_ = 0

  constructor(private source_: () => Tramp<T>) {}

  public map<U>(fn: (value: T, index: number) => U): Seq<U> {
    return new Seq(() => {
      const parentNext = this.createTrampoline_()
      let counter = 0

      return (): typeof DONE | U => {
        const result = parentNext()

        if (result === DONE) {
          return DONE
        }

        return fn(result, counter++)
      }
    })
  }

  public window(size: number, allowPartialWindow = true): Seq<T[]> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self: Seq<T> = this

    return new Seq(() => {
      let head: Seq<T> = self

      return (): typeof DONE | T[] => {
        const items = head.take(size).toArray()

        if (!allowPartialWindow && items.length < size) {
          return DONE
        }

        head = head.skip(size)

        return items
      }
    })
  }

  public pairwise(): Seq<[T, T]> {
    return this.window(2, false) as unknown as Seq<[T, T]>
  }

  public isEmpty(): boolean {
    const next = this.createTrampoline_()
    return next() === DONE
  }

  public tap(fn: (value: T, index: number) => void): Seq<T> {
    return this.map((v, k) => {
      fn(v, k)

      return v
    })
  }

  public log(): Seq<T> {
    return this.tap((v, k) => console.log([k, v]))
  }

  public flatMap<U>(fn: (value: T, index: number) => U[]): Seq<U> {
    return this.map(fn).flat()
  }

  public flat<U>(this: Seq<U[]>): Seq<U> {
    return new Seq(() => {
      const next = this.createTrampoline_()

      let items = next()
      let counter = 0

      return (): typeof DONE | U => {
        if (items === DONE) {
          return DONE
        }

        if (counter >= items.length) {
          items = next()
          counter = 0
        }

        if (items === DONE) {
          return DONE
        }

        return items[counter++]
      }
    })
  }

  public filter(fn: (value: T, index: number) => unknown): Seq<T> {
    return new Seq(() => {
      const next = this.createTrampoline_()

      let counter = 0

      return (): typeof DONE | T => {
        while (true) {
          const item = next()

          if (item === DONE) {
            return DONE
          }

          if (fn(item, counter++)) {
            return item
          }
        }
      }
    })
  }

  public compact<C>(): Seq<C> {
    return this.filter(identity) as unknown as Seq<C>
  }

  public concat(...tail: Array<Seq<T>>): Seq<T> {
    return new Seq(() => {
      const nexts = [
        this.createTrampoline_(),
        ...tail.map(s => s.createTrampoline_()),
      ]

      return (): typeof DONE | T => {
        while (true) {
          if (nexts.length === 0) {
            return DONE
          }

          const currentSeq = nexts[0]
          const item = currentSeq()

          if (item === DONE) {
            nexts.shift()
            continue
          }

          return item
        }
      }
    })
  }

  public interleave(...tail: Array<Seq<T>>): Seq<T> {
    return new Seq(() => {
      const nexts = [this.source_(), ...tail.map(s => s.source_())]

      let index = 0

      return (): typeof DONE | T => {
        while (true) {
          if (nexts.length === 0) {
            return DONE
          }

          const boundedIndex = index++ % nexts.length
          const next = nexts[boundedIndex]
          const item = next()

          if (item === DONE) {
            nexts.splice(boundedIndex, 1)
            continue
          }

          return item
        }
      }
    })
  }

  public interpose(separator: T): Seq<T> {
    return new Seq(() => {
      const next = this.createTrampoline_()

      let backPressure: T | undefined
      let lastWasSep = true

      return (): typeof DONE | T => {
        if (backPressure) {
          const previousItem = backPressure
          backPressure = undefined
          lastWasSep = false
          return previousItem
        }

        const item = next()

        if (item === DONE) {
          return DONE
        }

        if (!lastWasSep) {
          lastWasSep = true
          backPressure = item
          return separator
        }

        lastWasSep = false
        return item
      }
    })
  }

  public distinctBy<U>(fn: (value: T) => U): Seq<T> {
    const seen = new Set<U>()

    return this.filter(value => {
      const compareBy = fn(value)

      if (seen.has(compareBy)) {
        return false
      }

      seen.add(compareBy)

      return true
    })
  }

  public distinct(): Seq<T> {
    return this.distinctBy(identity)
  }

  public partitionBy(
    fn: (value: T, index: number) => unknown,
  ): [Seq<T>, Seq<T>] {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    const trueBackpressure: T[] = []
    const falseBackpressure: T[] = []

    let previousSource: ReturnType<typeof self.source_> | undefined

    const singletonTrampoline = (): Tramp<T> => {
      if (!previousSource) {
        previousSource = self.createTrampoline_()
      }

      return previousSource
    }

    return [
      new Seq(() => {
        const next = singletonTrampoline()

        let counter = 0

        return (): typeof DONE | T => {
          while (true) {
            if (trueBackpressure.length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return trueBackpressure.shift()!
            }

            const item = next()

            if (item === DONE) {
              return DONE
            }

            if (fn(item, counter++)) {
              return item
            } else {
              falseBackpressure.push(item)
            }
          }
        }
      }),

      new Seq(() => {
        const next = singletonTrampoline()

        let counter = 0

        return (): typeof DONE | T => {
          while (true) {
            if (falseBackpressure.length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return falseBackpressure.shift()!
            }

            const item = next()

            if (item === DONE) {
              return DONE
            }

            if (!fn(item, counter++)) {
              return item
            } else {
              trueBackpressure.push(item)
            }
          }
        }
      }),
    ]
  }

  public includes(value: T): boolean {
    return !!this.find(a => a === value)
  }

  public find(fn: (value: T, index: number) => unknown): T | undefined {
    return this.filter(fn).first()
  }

  public reduce<A>(fn: (sum: A, value: T, index: number) => A, initial: A): A {
    const parentNext = this.createTrampoline_()
    let counter = 0
    let current: A = initial

    while (true) {
      const result = parentNext()

      if (result === DONE) {
        return current
      }

      current = fn(current, result, counter++)
    }
  }

  public join(this: Seq<string>, separator = ","): string {
    return this.reduce((sum, str) => sum + str + separator, "").slice(0, -1)
  }

  public pipe<U>(fn: (value: Seq<T>) => U): U {
    return fn(this)
  }

  public some(fn: (value: T, index: number) => unknown): boolean {
    const next = this.createTrampoline_()

    let counter = 0

    while (true) {
      const item = next()

      if (item === DONE) {
        return false
      }

      if (fn(item, counter++)) {
        return true
      }
    }
  }

  public every(fn: (value: T, index: number) => unknown): boolean {
    const next = this.createTrampoline_()

    let counter = 0

    while (true) {
      const item = next()

      if (item === DONE) {
        return true
      }

      if (!fn(item, counter++)) {
        return false
      }
    }
  }

  public takeWhile(fn: (value: T, index: number) => unknown): Seq<T> {
    return new Seq(() => {
      const next = this.createTrampoline_()

      let counter = 0

      return (): typeof DONE | T => {
        const item = next()

        if (item === DONE) {
          return DONE
        }

        if (!fn(item, counter++)) {
          return DONE
        }

        return item
      }
    })
  }

  public take(num: number): Seq<T> {
    return new Seq(() => {
      const next = this.createTrampoline_()

      let i = 0

      return (): typeof DONE | T => {
        if (i++ >= num) {
          return DONE
        }

        const item = next()

        if (item === DONE) {
          return DONE
        }

        return item
      }
    })
  }

  public skipWhile(fn: (value: T, index: number) => unknown): Seq<T> {
    return new Seq(() => {
      const next = this.createTrampoline_()

      let counter = 0

      return (): typeof DONE | T => {
        while (true) {
          const item = next()

          if (item === DONE) {
            return DONE
          }

          if (fn(item, counter++)) {
            continue
          }

          return item
        }
      }
    })
  }

  public skip(num: number): Seq<T> {
    return new Seq(() => {
      const next = this.createTrampoline_()

      let doneSkipping = false

      return (): typeof DONE | T => {
        if (!doneSkipping) {
          for (let i = 0; i < num; i++) {
            const skippedItem = next()

            if (skippedItem === DONE) {
              return DONE
            }
          }

          doneSkipping = true
        }

        const item = next()

        if (item === DONE) {
          return DONE
        }

        return item
      }
    })
  }

  public nth(i: number): T | undefined {
    return this.skip(i - 1).first()
  }

  public index(i: number): T | undefined {
    return this.skip(i).first()
  }

  public first(): T | undefined {
    const next = this.createTrampoline_()

    const item = next()

    if (item === DONE) {
      return undefined
    }

    return item
  }

  public zipWith<T2, T3>(
    fn: (
      [result1, result2]: [T, T2] | [T, undefined] | [undefined, T2],
      index: number,
    ) => T3,
    seq2: Seq<T2>,
  ): Seq<T3> {
    return new Seq(() => {
      const next1 = this.createTrampoline_()
      const next2 = seq2.createTrampoline_()

      let counter = 0

      return (): typeof DONE | T3 => {
        const result1 = next1()
        const result2 = next2()

        if (result1 === DONE && result2 === DONE) {
          return DONE
        }

        if (result1 === DONE && result2 !== DONE) {
          return fn([undefined, result2], counter++)
        }

        if (result1 !== DONE && result2 === DONE) {
          return fn([result1, undefined], counter++)
        }

        return fn([result1 as T, result2 as T2], counter++)
      }
    })
  }

  public zip<T2>(seq2: Seq<T2>): Seq<[T | undefined, T2 | undefined]> {
    return this.zipWith(identity, seq2)
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
      index: number,
    ) => T4,
    seq2: Seq<T2>,
    seq3: Seq<T3>,
  ): Seq<T4> {
    return new Seq(() => {
      const next1 = this.createTrampoline_()
      const next2 = seq2.createTrampoline_()
      const next3 = seq3.createTrampoline_()

      let counter = 0

      return (): typeof DONE | T4 => {
        const result1 = next1()
        const result2 = next2()
        const result3 = next3()

        if (result1 === DONE && result2 === DONE && result3 === DONE) {
          return DONE
        }

        if (result1 !== DONE && result2 === DONE && result3 === DONE) {
          return fn([result1, undefined, undefined], counter++)
        }

        if (result1 !== DONE && result2 !== DONE && result3 === DONE) {
          return fn([result1, result2, undefined], counter++)
        }

        if (result1 !== DONE && result2 === DONE && result3 !== DONE) {
          return fn([result1, undefined, result3], counter++)
        }

        if (result1 === DONE && result2 !== DONE && result3 === DONE) {
          return fn([undefined, result2, undefined], counter++)
        }

        if (result1 === DONE && result2 !== DONE && result3 !== DONE) {
          return fn([undefined, result2, result3], counter++)
        }

        if (result1 === DONE && result2 === DONE && result3 !== DONE) {
          return fn([undefined, undefined, result3], counter++)
        }

        return fn([result1 as T, result2 as T2, result3 as T3], counter++)
      }
    })
  }

  public zip2<T2, T3>(
    seq2: Seq<T2>,
    seq3: Seq<T3>,
  ): Seq<[T | undefined, T2 | undefined, T3 | undefined]> {
    return this.zip2With(identity, seq2, seq3)
  }

  public *[Symbol.iterator]() {
    const next = this.createTrampoline_()

    while (true) {
      const item = next()

      if (item === DONE) {
        return
      }

      yield item
    }
  }

  public toArray(): T[] {
    const next = this.createTrampoline_()

    const result: T[] = []

    while (true) {
      const item = next()

      if (item === DONE) {
        return result
      }

      result.push(item)
    }
  }

  public forEach(fn: (value: T, index: number) => void): void {
    const next = this.createTrampoline_()

    let counter = 0

    while (true) {
      const item = next()

      if (item === DONE) {
        return
      }

      fn(item, counter++)
    }
  }

  public sumBy(fn: (value: T) => number): number {
    return this.map(fn).reduce((sum, num) => sum + num, 0)
  }

  public sum(this: Seq<number>): number {
    return this.sumBy(identity)
  }

  public averageBy(fn: (value: T) => number): number {
    return this.map(fn).reduce((sum, num, i) => sum + (num - sum) / (i + 1), 0)
  }

  public average(this: Seq<number>): number {
    return this.averageBy(identity)
  }

  public frequencies(): Map<T, number> {
    return this.reduce((sum, value) => {
      if (sum.has(value)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return sum.set(value, sum.get(value)! + 1)
      }

      return sum.set(value, 0 + 1)
    }, new Map<T, number>())
  }

  public groupBy<U>(fn: (item: T) => U): Map<U, T[]> {
    return this.reduce((sum, item) => {
      const group = fn(item)

      if (sum.has(group)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const currentArray = sum.get(group)!
        currentArray.push(item)
        return sum.set(group, currentArray)
      }

      return sum.set(group, [item])
    }, new Map<U, T[]>())
  }

  // Barely public. Do not use.
  public createTrampoline_(): () => typeof DONE | T {
    const nextCallback = this.source_()

    return (): typeof DONE | T => {
      const result = nextCallback()

      if (++this.yields_ > Seq.MAX_YIELDS) {
        throw new Error(
          `Seq has yielded ${this.yields_} times. If this is okay, set Seq.MAX_YIELDS to a higher number (currently ${Seq.MAX_YIELDS}).`,
        )
      }

      return result
    }
  }
}
