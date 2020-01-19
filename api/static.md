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
```text
const oneTwoThree = new Set([1, 2, 3, 2, 1]);
const sequence: Seq<number, number> = Seq.fromIterator(oneTwoThree[Symbol.iterator]);
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
const sequence: Seq<number, number> = Seq.iterate((a) => a + 1, 0);
```
{% endtab %}

{% tab title="Type Definition" %}
```typescript
type iterate = <T>(fn: (current: T) => T, start: T): Seq<number, T> 
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

{% tabs %}
{% tab title="Usage" %}
```typescript
const sequence: Seq<number, number> = Seq.of(2);
```
{% endtab %}

{% tab title="Type Definition" %}
```typescript
type of = <T>(value: T) => Seq<number, T>;
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
type repeatedly = <T>(
  value: () => T,
  times = Infinity
) => Seq<number, T>;
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

