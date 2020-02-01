# Static Methods

## fromArray

Takes a normal JavaScript array and turns it into a Sequence of the same type.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number> = Seq.fromArray([1, 2, 3]);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type fromArray<T> = (data: T[]) => Seq<T>;
```

{% endtab %}
{% endtabs %}

## iterate

The `iterate` method simplifies the construction of infinite sequences which are built using their previous value.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Builds an infinite sequence that counts up from 0.
const sequence: Seq<number> = Seq.iterate(a => a + 1, 0);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type iterate = <T>(fn: (current: T) => T, start: T): Seq<T>
```

{% endtab %}
{% endtabs %}

## fib

The `fib` method generates a sequence of fibonacci numbers.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number> = Seq.fib();
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type fib = () => Seq<number>;
```

{% endtab %}
{% endtabs %}

## random

Generates a random sequence using `Math.random`.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Builds sequence of random numbers between 0 and 1.
const sequence: Seq<number> = Seq.random();
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type random = () => Seq<number>;
```

{% endtab %}
{% endtabs %}

## range

Creates a sequence that counts between a start and end value. Takes an optional step parameter.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Step by 1 from 0 through 10.
const sequence: Seq<number> = Seq.range(0, 10);
```

```typescript
// Step by 1 from 0 through Infinity.
const sequence: Seq<number> = Seq.range(0, Infinity);
```

```typescript
// Step by 1 from -10 through +10.
const sequence: Seq<number> = Seq.range(-10, 10);
```

```typescript
// Step down from +10 through -10.
const sequence: Seq<number> = Seq.range(10, -10);
```

```typescript
// Step by 2 from 0 through 10.
const sequence: Seq<number> = Seq.range(0, 10, 2);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type range(
  start: number,
  end: number,
  step = 1
) => Seq<number>;
```

{% endtab %}
{% endtabs %}

## infinite

A sequence that counts from `0` to `Infinity`.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number> = Seq.infinite();
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type infinite = () => Seq<number>;
```

{% endtab %}
{% endtabs %}

## of

A sequence with only a single value inside. Also known as "singleton."

[Similar to Array.of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of).

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number> = Seq.of(2);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type of = <T>(...values: T[]): Seq<T>;
```

{% endtab %}
{% endtabs %}

## cycle

Create a sequence that is the infinite repetition of a series of values.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<string> = Seq.cycle(["a", "b", "c"]);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type cycle = <T>(items: T[]) => Seq<T>;
```

{% endtab %}
{% endtabs %}

## repeat

Create a sequence which repeats the same value X number of times. The length of the sequence defaults to Infinity.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Creates a sequence of 5 true values.
const sequence: Seq<boolean> = Seq.repeat(true, 5);
```

```typescript
// Creates a sequence of 0 which repeats infinitely.
const sequence: Seq<number> = Seq.repeat(0);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type repeat = <T>(value: T, times = Infinity) => Seq<T>;
```

{% endtab %}
{% endtabs %}

## repeatedly

Creates a sequence which pulls from an impure callback to generate the sequence. The second parameter can cap the length of the sequence. By default, it will call the callback infinitely to generate values. Useful for asking about current time or cache values.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<Date> = Seq.repeatedly(() => new Date());
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type repeatedly = <T>(value: () => T, times = Infinity) => Seq<T>;
```

{% endtab %}
{% endtabs %}

## empty

A sequence with nothing in it. Useful as a "no op" for certain code-paths when joining sequences together.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<never> = Seq.empty();
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type empty = () => Seq<never>;
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
const sequence: Seq<[string, number]> = Seq.zip(seq1, seq2);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zip = <T1, T2>(
  seq1: Seq<T1>,
  seq2: Seq<T2>
) => Seq<[T1 | undefined, T2 | undefined]>;
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
const sequence: Seq<number> = Seq.zipWith(
  ([num, multiplier]) => num * multiplier,
  seq1,
  seq2
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zipWith = <T1, T2, T3>(
  fn: (
    [result1, result2]: [T1, T2] | [T1, undefined] | [undefined, T2],
    index: number
  ) => T3,
  seq1: Seq<T1>,
  seq2: Seq<T2>
) => Seq<T3>;
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
const sequence: Seq<[string, number]> = Seq.zip3(seq1, seq2, seq3);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zip3 = <T1, T2, T3>(
  seq1: Seq<T1>,
  seq2: Seq<T2>,
  seq3: Seq<T3>
) => Seq<[T1 | undefined, T2 | undefined, T3 | undefined]>;
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
const sequence: Seq<number> = Seq.zip3With(
  ([num, multiplier, divisor]) => (num * multiplier) / divisor,
  seq1,
  seq2,
  seq3
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zip3With = <T1, T2, T3, T4>(
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
) => Seq<T4>;
```

{% endtab %}
{% endtabs %}

## concat

Combines 2 or more sequences into a single sequence.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number> = Seq.concat(
  Seq.fromArray([0, 1]),
  Seq.fromArray([2, 3]),
  Seq.fromArray([4, 5])
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type concat = <T>(...items: Array<Seq<T>>) => Seq<T>;
```

{% endtab %}
{% endtabs %}

## interleave

Takes 2 or more sequences and creates a new sequence built by pulling the next value from each of the sequences in order.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Builds: a -> 1 -> b -> 2 -> c -> 3
const sequence: Seq<string | number> = Seq.interleave(
  Seq.fromArray(["a", "b", "c"]),
  Seq.range(1, 3)
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type interleave = <T>(...items: Array<Seq<T>>) => Seq<T>;
```

{% endtab %}
{% endtabs %}
