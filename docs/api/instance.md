# Instance Methods

## map

It's `map`, the most important method in programming! Exactly the same as ES6 `map`, but lazy.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number, string> = Seq.infinite().map(num => num.toString());
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type map = <U>(fn: (value: T, key: K) => U) => Seq<K, U>;
```

{% endtab %}
{% endtabs %}

## window

`window` takes a sequence and groups it into "windows" of a certain length. This works well with infinite sequences where you want to process some number of values at a time.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Grab numbers in groups of 10.
const sequence: Seq<number, number[]> = Seq.infinite().window(10);
```

By default, only triggers chained responses when the window fills, guaranteeing the window is the exact size expect. Set `allowPartialWindow` to `false` to allow the trailing edge of a sequence to not be divisible by the window size.

```typescript
// Gives: [0, 1, 2] -> [3, 4, 5] -> [6, 7, 8] -> [9, 10]
const sequence: Seq<number, number> = Seq.range(0, 10).window(3);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type window = (size: number, allowPartialWindow = true) => Seq<number, T[]>;
```

{% endtab %}
{% endtabs %}

## pairwise

Works like `window`, makes the window size 2. Groups a sequence as alternating pairs. Useful for processing data which alternates Map keys and values.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number, [string, number]> = Seq.fromArray(["a", 1, "b", 2]);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type pairwise = () => Seq<number, [T, T]>;
```

{% endtab %}
{% endtabs %}

## isEmpty

Ask whether a sequence is empty.

{% tabs %}
{% tab title="Usage" %}

```typescript
const anythingInThere: boolean = Seq.empty().isEmpty();
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type isEmpty = () => boolean;
```

{% endtab %}
{% endtabs %}

## tap

`tap` lets you run side-effect generating functions on a sequence. Allows you to "tap in to" a data flow. Very useful for logging and debugging what values are flowing through the chain at a given location.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number, number> = Seq.infinite().tap(num =>
  console.log(num)
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type tap = (fn: (value: T, key: K) => void) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## log

`log` provides the most common use-case for `tap. Add this to a sequence chain to log each value that passes through it.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number, number> = Seq.infinite().log();
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type log = () => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## flat

Given a sequence where each item in an array of items, flatten all those arrays into a single flat sequence of values.

Works just like `Array.prototype.flat`. [See more here.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)

{% tabs %}
{% tab title="Usage" %}

```typescript
type Person = { name: string; friends: Person[] };

const sequence: Seq<number, Friend> = Seq.fromArray([person1, person2])
  .map(person => person.friends)
  .flat();
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type flat = <U>(this: Seq<K, U[]>) => Seq<number, U>;
```

{% endtab %}
{% endtabs %}

## flatMap

`flatMap` is used when mapping a list to each items related items. For example, if you wanted to map from a list of people to each persons list of friends. Despite each mapping function returning an array, the final output is a flatten array of all the results concattenated.

Works just like `Array.prototype.flatMap`. [See more here.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)

Similar to `[].map().flat()`, but in `leisure` the item mappings won't execute until enough of the resulting values have been realized to trigger each map.

{% tabs %}
{% tab title="Usage" %}

```typescript
type Person = { name: string; friends: Person[] };

const sequence: Seq<number, Friend> = Seq.fromArray([person1, person2]).flatMap(
  person => person.friends
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type flatMap = <U>(fn: (value: T, key: K) => U[]) => Seq<number, U>;
```

{% endtab %}
{% endtabs %}

## filter

Runs a predicate function on each item in a sequence to produce a new sequence where only the values which responded with `true` remain.

Exactly the same as `Array.prototype.filter`, but lazy. [See more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).

{% tabs %}
{% tab title="Usage" %}

```typescript
// Create a sequence of only even numbers.
const sequence: Seq<number, number> = Seq.infinite().filter(
  num => num % 2 === 0
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type filter = (fn: (value: T, key: K) => unknown) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## concat

Combines the current sequence with 1 or more additional sequences.

Exactly the same as `Array.prototype.concat`, but lazy. [See more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat).

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number, number> = Seq.fromArray([0, 1]).concat(
  Seq.fromArray([2, 3]),
  Seq.fromArray([4, 5])
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type concat = (...tail: Array<Seq<K, T>>) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## interleave

Takes 1 or more sequences and creates a new sequence built by pulling the next value from each of the sequences in order.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Builds: a -> 1 -> b -> 2 -> c -> 3
const sequence: Seq<number, string | number> = Seq.fromArray([
  "a",
  "b",
  "c"
]).interleave(Seq.range(1, 3));
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type interleave = (...tail: Array<Seq<K, T>>) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## interpose

Given a sequence, place a value between each value of the original sequence. Useful for adding punctuation between strings.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Builds: Apples -> , -> Oranges -> , -> Bananas
const sequence: Seq<number, string> = Seq.fromArray([
  "Apples",
  "Oranges",
  "Bananas"
]).interpose(", ");

console.log(sequence.toArray().join(""));
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type interpose = (separator: T) => Seq<number, T>;
```

{% endtab %}
{% endtabs %}

## distinct

Given a sequence, only forwards the values which have no already been seen. Very similar to lodash's `uniq` method.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Builds: 1 -> 2 -> 3 -> 4
const sequence: Seq<number, number> = Seq.fromArray([
  1,
  2,
  3,
  2,
  1,
  4
]).distinct();
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type distinct = () => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## distinctBy

Same as `distinct`, but allows a function to describe on what value the sequence should be unique.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Builds: { firstName: "A", lastName: "Z" } ->
//         { firstName: "B", lastName: "Y" } ->
//         { firstName: "C", lastName: "W" }
type Person = { firstName: string; lastName: string };
const sequence: Seq<number, Person> = Seq.fromArray([
  { firstName: "A", lastName: "Z" },
  { firstName: "B", lastName: "Y" },
  { firstName: "A", lastName: "X" },
  { firstName: "C", lastName: "W" }
]).distinctBy(person => person.firstName);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type distinctBy = <U>(fn: (value: T) => U) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## partitionBy

Given a sequence, splits the values into two separate sequences. One represents the values where the partition function is `true` and the other for `false`.

{% tabs %}
{% tab title="Usage" %}

```typescript
const [isEven, isOdd] = Seq.infinite().partitionBy(num => num % 2 === 0);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type partition = (fn: (value: T, key: K) => unknown) => [Seq<K, T>, Seq<K, T>];
```

{% endtab %}
{% endtabs %}

## includes

Lazily checks if the sequence includes a value.

Exactly the same as `Array.prototype.includes`, but lazy. [See more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes).

{% tabs %}
{% tab title="Usage" %}

```typescript
const doesItInclude = Seq.infinite().includes(10);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type includes = (value: T) => boolean;
```

{% endtab %}
{% endtabs %}

## find

Lazily searches for a value that matches the predicate.

Exactly the same as `Array.prototype.find`, but lazy. [See more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).

{% tabs %}
{% tab title="Usage" %}

```typescript
// Returns 11
const gtTen = Seq.infinite().find(num => num > 10);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type find = (fn: (value: T, key: K) => unknown) => T | undefined;
```

{% endtab %}
{% endtabs %}

## reduce

Exactly the same as `Array.prototype.reduce`. [See more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce). This causes a full realization of the data. Not lazy.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Returns 0 + 1 + 2 + 3 + 4 = 10
const sum = Seq.infinite()
  .take(5)
  .reduce((sum, num) => sum + num);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type reduce = <A>(fn: (sum: A, value: T, key: K) => A, initial: A) => A;
```

{% endtab %}
{% endtabs %}

## chain

This method is helpful for chaining. Shocking, I know. Let's you "map" the entire sequence in a chain, rather than per-each-item. Allows adding arbitrary sequence helpers and methods to chain, even if they are written in user-land and not on the `Seq` prototype.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Same as `Seq.interpose(Seq.infinite(), Seq.infinite())`
const sequence = Seq.infinite().chain(seq => seq.interpose(Seq.infinite()));
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type chain = <U>(fn: (value: Seq<K, T>) => U) => U;
```

{% endtab %}
{% endtabs %}

## some

Exactly the same as `Array.prototype.some`, but lazy. [See more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).

{% tabs %}
{% tab title="Usage" %}

```typescript
// Find the first even random number.
const areAnyEven = Seq.random()
  .map(num => Math.round(num * 1000))
  .some(num => num % 2 === 0);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type some = (fn: (value: T, key: K) => unknown) => boolean;
```

{% endtab %}
{% endtabs %}

## every

Exactly the same as `Array.prototype.every`, but lazy. [See more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).

{% tabs %}
{% tab title="Usage" %}

```typescript
// Fails fast if there are negative numbers
const areAllPositive = Seq.random()
  .map(num => Math.round(num * 1000) - 500)
  .every(num => num > 0);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type every = (fn: (value: T, key: K) => unknown) => boolean;
```

{% endtab %}
{% endtabs %}

## takeWhile

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type takeWhile = (fn: (value: T, key: K) => unknown) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## take

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type take = (num: number) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## skipWhile

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type skipWhile = (fn: (value: T, key: K) => unknown) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## skip

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type skip = (num: number) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## index

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type index = (i: number) => T | undefined;
```

{% endtab %}
{% endtabs %}

## first

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type first = () => T | undefined;
```

{% endtab %}
{% endtabs %}

## zipWith

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zipWith = <K2, T2, K3, T3>(
  fn: (
    [result1, result2]: [T, T2] | [T, undefined] | [undefined, T2],
    index: number
  ) => [K3, T3],
  seq2: Seq<K2, T2>
) => Seq<K3, T3>;
```

{% endtab %}
{% endtabs %}

## zip

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zip = <K2, T2>(
  seq2: Seq<K2, T2>
) => Seq<number, [T | undefined, T2 | undefined]>;
```

{% endtab %}
{% endtabs %}

## toEntries

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type toEntries = () => Array<[K, T]>;
```

{% endtab %}
{% endtabs %}

## toArray

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type toArray = () => T[];
```

{% endtab %}
{% endtabs %}

## toSet

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type toSet = () => Set<T>;
```

{% endtab %}
{% endtabs %}

## toMap

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type toMap = () => Map<K, T>;
```

{% endtab %}
{% endtabs %}

## forEach

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type forEach = (fn: (value: T, key: K) => void) => void;
```

{% endtab %}
{% endtabs %}

## sumBy

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type sumBy = (fn: (value: T) => number) => number;
```

{% endtab %}
{% endtabs %}

## sum

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type sum = (this: Seq<any, number>) => number;
```

{% endtab %}
{% endtabs %}

## averageBy

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type averageBy = (fn: (value: T) => number) => number;
```

{% endtab %}
{% endtabs %}

## average

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type average = (this: Seq<any, number>) => number;
```

{% endtab %}
{% endtabs %}

## frequencies

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type frequencies = () => Map<T, number>;
```

{% endtab %}
{% endtabs %}

## groupBy

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type groupBy = <U>(fn: (item: T) => U) => Map<U, T[]>;
```

{% endtab %}
{% endtabs %}
