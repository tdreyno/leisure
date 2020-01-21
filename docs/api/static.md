# Static Methods

## fromArray

Takes a normal JavaScript array and turns it into a Sequence of the same type.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number, number> = Seq.fromArray([1, 2, 3]);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type fromArray<T> = (data: T[]) => Seq<number, T>;
```

{% endtab %}
{% endtabs %}

## fromSet

Takes an ES6 `Set` and turns it into a sequence of the same value type.

{% tabs %}
{% tab title="Usage" %}

```typescript
const oneTwoThree = new Set([1, 2, 3, 2, 1]);
const sequence: Seq<number, number> = Seq.fromSet(oneTwoThree);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
// Like the ES6 Set type itself, uses the value as the index type.
type fromSet<T> = (data: Set<T>) => Seq<T, T>;
```

{% endtab %}
{% endtabs %}

## fromIterator

Takes an [Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) and turns it into a sequence of the same value type. Used internally to build sequences from an iterable type \(array, set, map and custom user iterables\).

{% tabs %}
{% tab title="Usage" %}

```typescript
const oneTwoThree = new Set([1, 2, 3, 2, 1]);
const sequence: Seq<number, number> = Seq.fromIterator(
  oneTwoThree[Symbol.iterator]
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type fromIterator<K, T> = (data: () => IterableIterator<[K, T]>) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## fromGenerator

Takes a [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) and turns it into a sequence of the same value type. Lazy sequences are implemented as generators so this is pretty straightforward. This generator is actually the `source` parameter used by the `Seq` constructor.

Using this function, you can make an arbitrary sequence however you want! You must `yield` a tuple of the `[key, value]`.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number, number> = Seq.fromGenerator(function*() {
  let i = 0;

  // Yields an infinite sequence of the string version of a number counting up.
  while (true) {
    // Yield the key and the value.
    yield [i, i.toString()];

    i++;
  }
});
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type fromGenerator = <K, T>(
  data: (this: Seq<K, T>) => Generator<[K, T]>
) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## iterate

The `iterate` method simplifies the construction of infinite sequences which are built using their previous value.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Builds an infinite sequence that counts up from 0.
const sequence: Seq<number, number> = Seq.iterate(a => a + 1, 0);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type iterate = <T>(fn: (current: T) => T, start: T): Seq<number, T>
```

{% endtab %}
{% endtabs %}

## random

Generates a random sequence using `Math.random`.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Builds sequence of random numbers between 0 and 1.
const sequence: Seq<number, number> = Seq.random();
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type random = () => Seq<number, number>;
```

{% endtab %}
{% endtabs %}

## simplex2D

Generates a 2d simplex noise.

{% tabs %}
{% tab title="Usage" %}

```typescript
const SEED = 5;
const sequence: Seq<number, number> = Seq.simplex2D((x, y) => x + y, SEED);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type simplex2D = (
  fn: () => [number, number],
  seed: number = Date.now()
) => Seq<number, number>;
```

{% endtab %}
{% endtabs %}

## simplex3D

Generates a 3d simplex noise.

{% tabs %}
{% tab title="Usage" %}

```typescript
const SEED = 5;
const sequence: Seq<number, number> = Seq.simplex3D(
  (x, y, z) => x + y + z,
  SEED
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type simplex2D = (
  fn: () => [number, number, number],
  seed: number = Date.now()
) => Seq<number, number>;
```

{% endtab %}
{% endtabs %}

## simplex4D

Generates a 4d simplex noise.

{% tabs %}
{% tab title="Usage" %}

```typescript
const SEED = 5;
const sequence: Seq<number, number> = Seq.simplex4D(
  (x, y, z, w) => x + y + z + w,
  SEED
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type simplex2D = (
  fn: () => [number, number, number, number],
  seed: number = Date.now()
) => Seq<number, number>;
```

{% endtab %}
{% endtabs %}

## range

Creates a sequence that counts between a start and end value. Takes an optional step parameter.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Step by 1 from 0 through 10.
const sequence: Seq<number, number> = Seq.range(0, 10);
```

```typescript
// Step by 1 from 0 through Infinity.
const sequence: Seq<number, number> = Seq.range(0, Infinity);
```

```typescript
// Step by 1 from -10 through +10.
const sequence: Seq<number, number> = Seq.range(-10, 10);
```

```typescript
// Step down from +10 through -10.
const sequence: Seq<number, number> = Seq.range(10, -10);
```

```typescript
// Step by 2 from 0 through 10.
const sequence: Seq<number, number> = Seq.range(0, 10, 2);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type range(
  start: number,
  end: number,
  step = 1
) => Seq<number, number>;
```

{% endtab %}
{% endtabs %}

## infinite

A sequence that counts from `0` to `Infinity`.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number, number> = Seq.infinite();
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type infinite = () => Seq<number, number>;
```

{% endtab %}
{% endtabs %}

## of

A sequence with only a single value inside. Also known as "singleton."

[Similar to Array.of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of).

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number, number> = Seq.of(2);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type of = <T>(...values: T[]): Seq<number, T>;
```

{% endtab %}
{% endtabs %}

## cycle

Create a sequence that is the infinite repetition of a series of values.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number, string> = Seq.cycle(["a", "b", "c"]);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type cycle = <T>(items: T[]) => Seq<number, T>;
```

{% endtab %}
{% endtabs %}

## repeat

Create a sequence which repeats the same value X number of times. The length of the sequence defaults to Infinity.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Creates a sequence of 5 true values.
const sequence: Seq<number, boolean> = Seq.repeat(true, 5);
```

```typescript
// Creates a sequence of 0 which repeats infinitely.
const sequence: Seq<number, number> = Seq.repeat(0);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type repeat = <T>(value: T, times = Infinity) => Seq<number, T>;
```

{% endtab %}
{% endtabs %}

## repeatedly

Creates a sequence which pulls from an impure callback to generate the sequence. The second parameter can cap the length of the sequence. By default, it will call the callback infinitely to generate values. Useful for asking about current time or cache values.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number, Date> = Seq.repeatedly(() => new Date());
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type repeatedly = <T>(value: () => T, times = Infinity) => Seq<number, T>;
```

{% endtab %}
{% endtabs %}

## empty

A sequence with nothing in it. Useful as a "no op" for certain code-paths when joining sequences together.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number, never> = Seq.empty();
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type empty = () => Seq<number, never>;
```

{% endtab %}
{% endtabs %}

## zip

Takes two sequences and lazily combines them to produce a tuple with the current step in each of the two positions. Useful for zipping a sequence of keys with a sequence of values, before converting to a Map of key to value.

{% tabs %}
{% tab title="Usage" %}

```typescript
const seq1 = Seq.fromArray(["zero", "one", "two", "three"]);
const seq2 = Seq.range(0, 3);

// Gives: ["zero", 0] -> ["one", 1] -> ["two", 2] -> ["three", 3]
const sequence: Seq<number, [string, number]> = Seq.zip(seq1, seq2);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zip = <K1, T1, K2, T2>(
  seq1: Seq<K1, T1>,
  seq2: Seq<K2, T2>
) => Seq<number, [T1 | undefined, T2 | undefined]>;
```

{% endtab %}
{% endtabs %}

## zipWith

Takes two sequences and lazily combines them to produce an arbitrary value by mapping the current value of the two positions through a user-supplied function. Useful for table \(row/col\) math.

{% tabs %}
{% tab title="Usage" %}

```typescript
const seq1 = Seq.range(0, 3);
const seq2 = Seq.repeat(2);

// Gives: 0 -> 2 -> 4 -> 6
const sequence: Seq<number, number> = Seq.zipWith(
  ([num, multiplier]) => num * multiplier,
  seq1,
  seq2
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zipWith = <K1, T1, K2, T2, K3, T3>(
  fn: (
    [result1, result2]: [T1, T2] | [T1, undefined] | [undefined, T2],
    index: number
  ) => [K3, T3],
  seq1: Seq<K1, T1>,
  seq2: Seq<K2, T2>
) => Seq<K3, T3>;
```

{% endtab %}
{% endtabs %}

## zip3

Takes three sequences and lazily combines them to produce a 3-tuple with the current step in each of the three positions.

{% tabs %}
{% tab title="Usage" %}

```typescript
const seq1 = Seq.fromArray(["zero", "one", "two", "three"]);
const seq2 = Seq.range(0, 3);
const seq3 = Seq.range(3, 0);

// Gives: ["zero", 0, 3] -> ["one", 1, 2] -> ["two", 2, 1] -> ["three", 3, 0]
const sequence: Seq<number, [string, number]> = Seq.zip3(seq1, seq2, seq3);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zip3 = <K1, T1, K2, T2, K3, T3>(
  seq1: Seq<K1, T1>,
  seq2: Seq<K2, T2>,
  seq3: Seq<K3, T3>
) => Seq<number, [T1 | undefined, T2 | undefined, T3 | undefined]>;
```

{% endtab %}
{% endtabs %}

## zip3With

Takes three sequences and lazily combines them to produce an arbitrary value by mapping the current value of the three positions through a user-supplied function.

{% tabs %}
{% tab title="Usage" %}

```typescript
const seq1 = Seq.range(0, 3);
const seq2 = Seq.repeat(2);
const seq3 = Seq.repeat(1);

// Gives: 0 -> 2 -> 4 -> 6
const sequence: Seq<number, number> = Seq.zip3With(
  ([num, multiplier, divisor]) => (num * multiplier) / divisor,
  seq1,
  seq2,
  seq3
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zip3With = <K1, T1, K2, T2, K3, T3, K4, T4>(
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
  ) => [K4, T4],
  seq1: Seq<K1, T1>,
  seq2: Seq<K2, T2>,
  seq3: Seq<K3, T3>
) => Seq<K4, T4>;
```

{% endtab %}
{% endtabs %}

## concat

Combines 2 or more sequences into a single sequence.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number, number> = Seq.concat(
  Seq.fromArray([0, 1]),
  Seq.fromArray([2, 3]),
  Seq.fromArray([4, 5])
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type concat = <K, T>(...items: Array<Seq<K, T>>) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## interleave

Takes 2 or more sequences and creates a new sequence built by pulling the next value from each of the sequences in order.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Builds: a -> 1 -> b -> 2 -> c -> 3
const sequence: Seq<number, string | number> = Seq.interleave(
  Seq.fromArray(["a", "b", "c"]),
  Seq.range(1, 3)
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type interleave = <K, T>(...items: Array<Seq<K, T>>) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}
