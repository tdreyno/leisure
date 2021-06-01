# Instance Methods

## map

It's `map`, the most important method in programming! Exactly the same as ES6 `map`, but lazy.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<string> = Seq.infinite().map(num => num.toString())
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type map = <U>(fn: (value: T, index: number) => U) => Seq<U>
```

{% endtab %}
{% endtabs %}

## window

`window` takes a sequence and groups it into "windows" of a certain length. This works well with infinite sequences where you want to process some number of values at a time.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Grab numbers in groups of 10.
const sequence: Seq<number[]> = Seq.infinite().window(10)
```

By default, only triggers chained responses when the window fills, guaranteeing the window is the exact size expect. Set `allowPartialWindow` to `false` to allow the trailing edge of a sequence to not be divisible by the window size.

```typescript
// Gives: [0, 1, 2] -> [3, 4, 5] -> [6, 7, 8] -> [9, 10]
const sequence: Seq<number> = Seq.range(0, 10).window(3)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type window = (size: number, allowPartialWindow = true) => Seq<T[]>
```

{% endtab %}
{% endtabs %}

## pairwise

Works like `window`, makes the window size 2. Groups a sequence as alternating pairs. Useful for processing data which alternates Map keys and values.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<[string, number]> = Seq.fromArray(["a", 1, "b", 2])
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type pairwise = () => Seq<[T, T]>
```

{% endtab %}
{% endtabs %}

## isEmpty

Ask whether a sequence is empty.

{% tabs %}
{% tab title="Usage" %}

```typescript
const anythingInThere: boolean = Seq.empty().isEmpty()
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type isEmpty = () => boolean
```

{% endtab %}
{% endtabs %}

## tap

`tap` lets you run side-effect generating functions on a sequence. Allows you to "tap in to" a data flow. Very useful for logging and debugging what values are flowing through the chain at a given location.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number> = Seq.infinite().tap(num => console.log(num))
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type tap = (fn: (value: T, index: number) => void) => Seq<T>
```

{% endtab %}
{% endtabs %}

## log

`log` provides the most common use-case for `tap. Add this to a sequence chain to log each value that passes through it.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number> = Seq.infinite().log()
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type log = () => Seq<T>
```

{% endtab %}
{% endtabs %}

## flat

Given a sequence where each item in an array of items, flatten all those arrays into a single flat sequence of values.

Works just like `Array.prototype.flat`. [See more here.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)

{% tabs %}
{% tab title="Usage" %}

```typescript
type Person = { name: string; friends: Person[] }

const sequence: Seq<Friend> = Seq.fromArray([person1, person2])
  .map(person => person.friends)
  .flat()
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type flat = <U>(this: Seq<U[]>) => Seq<U>
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
type Person = { name: string; friends: Person[] }

const sequence: Seq<Friend> = Seq.fromArray([person1, person2]).flatMap(
  person => person.friends,
)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type flatMap = <U>(fn: (value: T, index: number) => U[]) => Seq<U>
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
const sequence: Seq<number> = Seq.infinite().filter(num => num % 2 === 0)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type filter = (fn: (value: T, index: number) => unknown) => Seq<T>
```

{% endtab %}
{% endtabs %}

## concat

Combines the current sequence with 1 or more additional sequences.

Exactly the same as `Array.prototype.concat`, but lazy. [See more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat).

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<number> = Seq.fromArray([0, 1]).concat(
  Seq.fromArray([2, 3]),
  Seq.fromArray([4, 5]),
)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type concat = (...tail: Array<Seq<T>>) => Seq<T>
```

{% endtab %}
{% endtabs %}

## interleave

Takes 1 or more sequences and creates a new sequence built by pulling the next value from each of the sequences in order.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Builds: a -> 1 -> b -> 2 -> c -> 3
const sequence: Seq<string | number> = Seq.fromArray([
  "a",
  "b",
  "c",
]).interleave(Seq.range(1, 3))
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type interleave = (...tail: Array<Seq<T>>) => Seq<T>
```

{% endtab %}
{% endtabs %}

## interpose

Given a sequence, place a value between each value of the original sequence. Useful for adding punctuation between strings.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Builds: Apples -> , -> Oranges -> , -> Bananas
const sequence: Seq<string> = Seq.fromArray([
  "Apples",
  "Oranges",
  "Bananas",
]).interpose(", ")

console.log(sequence.toArray().join(""))
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type interpose = (separator: T) => Seq<T>
```

{% endtab %}
{% endtabs %}

## distinct

Given a sequence, only forwards the values which have no already been seen. Very similar to lodash's `uniq` method.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Builds: 1 -> 2 -> 3 -> 4
const sequence: Seq<number> = Seq.fromArray([1, 2, 3, 2, 1, 4]).distinct()
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type distinct = () => Seq<T>
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
type Person = { firstName: string; lastName: string }
const sequence: Seq<Person> = Seq.fromArray([
  { firstName: "A", lastName: "Z" },
  { firstName: "B", lastName: "Y" },
  { firstName: "A", lastName: "X" },
  { firstName: "C", lastName: "W" },
]).distinctBy(person => person.firstName)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type distinctBy = <U>(fn: (value: T) => U) => Seq<T>
```

{% endtab %}
{% endtabs %}

## partitionBy

Given a sequence, splits the values into two separate sequences. One represents the values where the partition function is `true` and the other for `false`.

{% tabs %}
{% tab title="Usage" %}

```typescript
const [isEven, isOdd] = Seq.infinite().partitionBy(num => num % 2 === 0)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type partition = (fn: (value: T, index: number) => unknown) => [Seq<T>, Seq<T>]
```

{% endtab %}
{% endtabs %}

## includes

Lazily checks if the sequence includes a value.

Exactly the same as `Array.prototype.includes`, but lazy. [See more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes).

{% tabs %}
{% tab title="Usage" %}

```typescript
const doesItInclude = Seq.infinite().includes(10)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type includes = (value: T) => boolean
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
const gtTen = Seq.infinite().find(num => num > 10)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type find = (fn: (value: T, index: number) => unknown) => T | undefined
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
  .reduce((sum, num) => sum + num)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type reduce = <A>(fn: (sum: A, value: T, index: number) => A, initial: A) => A
```

{% endtab %}
{% endtabs %}

## chain

This method is helpful for chaining. Shocking, I know. Let's you "map" the entire sequence in a chain, rather than per-each-item. Allows adding arbitrary sequence helpers and methods to chain, even if they are written in user-land and not on the `Seq` prototype.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Same as `Seq.interpose(Seq.infinite(), Seq.infinite())`
const sequence = Seq.infinite().chain(seq => seq.interpose(Seq.infinite()))
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type chain = <U>(fn: (value: Seq<T>) => U) => U
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
  .some(num => num % 2 === 0)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type some = (fn: (value: T, index: number) => unknown) => boolean
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
  .every(num => num > 0)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type every = (fn: (value: T, index: number) => unknown) => boolean
```

{% endtab %}
{% endtabs %}

## take

Given a sequence of unknown length, create a sub sequence of just the first X number of items.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Grabs 0 -> 1 -> 2 -> 3 -> 4
const firstFive = Seq.infinite().take(5)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type take = (num: number) => Seq<T>
```

{% endtab %}
{% endtabs %}

## takeWhile

Given a sequence of unknown length, create a sub sequence of as many items in a row that satisfy the predicate.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Gives 0 -> 1 -> 2 -> 3 -> 4
const lessThanFive = Seq.infinite().takeWhile(num => num < 5)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type takeWhile = (fn: (value: T, index: number) => unknown) => Seq<T>
```

{% endtab %}
{% endtabs %}

## skip

Given a sequence of unknown length, skips the first X number of items.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Gives 5 -> 6 -> 7 -> 8 -> 9
const secondFive = Seq.infinite().skip(5).take(5)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type skip = (num: number) => Seq<T>
```

{% endtab %}
{% endtabs %}

## skipWhile

Given a sequence of unknown length, skip as many items in a row that satisfy the predicate.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Gives 5 -> 6 -> 7 -> 8 -> 9
const greaterThanFive = Seq.infinite()
  .skipWhile(num => num < 5)
  .take(5)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type skipWhile = (fn: (value: T, index: number) => unknown) => Seq<T>
```

{% endtab %}
{% endtabs %}

## nth

Returns the `nth` item. Items are 1-indexed.

{% tabs %}
{% tab title="Usage" %}

```typescript
const thirdItem = Seq.infinite().nth(3)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type nth = (i: number) => T | undefined
```

{% endtab %}
{% endtabs %}

## index

Returns the `index` item. Items are 0-indexed.

{% tabs %}
{% tab title="Usage" %}

```typescript
const fourthItem = Seq.infinite().index(3)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type nth = (i: number) => T | undefined
```

{% endtab %}
{% endtabs %}

## first

Gets the first value in the sequence.

{% tabs %}
{% tab title="Usage" %}

```typescript
const fifth = Seq.infinite().skip(4).first()
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type first = () => T | undefined
```

{% endtab %}
{% endtabs %}

## zip

Lazily combines a second sequence with this current one to produce a tuple with the current step in each of the two positions. Useful for zipping a sequence of keys with a sequence of values, before converting to a Map of key to value.

{% tabs %}
{% tab title="Usage" %}

```typescript
const seq2 = Seq.range(0, 3)

// Gives: ["zero", 0] -> ["one", 1] -> ["two", 2] -> ["three", 3]
const sequence: Seq<[string, number]> = Seq.fromArray([
  "zero",
  "one",
  "two",
  "three",
]).zip(seq2)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zip<T2> = (seq2: Seq<T2>) => Seq<[T | undefined, T2 | undefined]>
```

{% endtab %}
{% endtabs %}

## zipWith

Takes a second sequence and lazily combines it to produce an arbitrary value by mapping the current value of the two positions through a user-supplied function. Useful for table \(row/col\) math.

{% tabs %}
{% tab title="Usage" %}

```typescript
const seq2 = Seq.repeat(2)

// Gives: 0 -> 2 -> 4 -> 6
const sequence: Seq<number> = Seq.range(0, 3).zipWith(
  ([num, multiplier]) => num * multiplier,
  seq2,
)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zip2With = <T2, T3, T4>(
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
) => Seq<T4>
```

{% endtab %}
{% endtabs %}

## zip2

Takes two sequences and lazily combines them with this one to produce a 3-tuple with the current step in each of the three positions.

{% tabs %}
{% tab title="Usage" %}

```typescript
const seq2 = Seq.range(0, 3)
const seq3 = Seq.range(3, 0)

// Gives: ["zero", 0, 3] -> ["one", 1, 2] -> ["two", 2, 1] -> ["three", 3, 0]
const sequence: Seq<[string, number]> = Seq.fromArray([
  "zero",
  "one",
  "two",
  "three",
]).zip2(seq2, seq3)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zip2 = <T2, T3>(
  seq2: Seq<T2>,
  seq3: Seq<T3>,
) => Seq<[T | undefined, T2 | undefined, T3 | undefined]>
```

{% endtab %}
{% endtabs %}

## zip2With

Takes two sequences and lazily combine them with this sequence to produce an arbitrary value by mapping the current value of the three positions through a user-supplied function.

{% tabs %}
{% tab title="Usage" %}

```typescript
const seq2 = Seq.repeat(2)
const seq3 = Seq.repeat(1)

// Gives: 0 -> 2 -> 4 -> 6
const sequence: Seq<number> = Seq.range(0, 3).zip2With(
  ([num, multiplier, divisor]) => (num * multiplier) / divisor,
  seq2,
  seq3,
)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type zip2With = <T2, T3, T4>(
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
) => Seq<T4>
```

{% endtab %}
{% endtabs %}

## toArray

Converts the sequence to a real JavaScript array. Realizes the entire sequence.

{% tabs %}
{% tab title="Usage" %}

```typescript
const lessThanTen = Seq.infinite().take(10).toArray()
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type toArray = () => T[]
```

{% endtab %}
{% endtabs %}

## forEach

Works just like `Array.prototype.forEach`. [See more here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Realizes the full sequence.

{% tabs %}
{% tab title="Usage" %}

```typescript

```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type forEach = (fn: (value: T, index: number) => void) => void
```

{% endtab %}
{% endtabs %}

## sum

Given a sequence of numbers, adds them all together. This realizes the entire sequence.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Returns 0 + 1 + 2 + 3 + 4 = 10
const sum = Seq.infinite().take(5).sum()
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type sum = (this: Seq<number>) => number
```

{% endtab %}
{% endtabs %}

## sumBy

Given a sequence of arbitrary data, adds together the result of the mapping function. This realizes the entire sequence.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Returns 0 + 1 + 2 + 3 + 4 = 10
const sum = Seq.fromArray([
  { balance: 0 },
  { balance: 1 },
  { balance: 2 },
  { balance: 3 },
  { balance: 4 },
]).sumBy(user => user.balance)
```

````

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type sumBy = (fn: (value: T) => number) => number;
````

{% endtab %}
{% endtabs %}

## average

Given a sequence of numbers, averages them all together. Tise realizes the entire sequence.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Returns (0 + 1 + 2 + 3 + 4) / 5 = 2
const sum = Seq.infinite().take(5).average()
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type average = (this: Seq<number>) => number
```

{% endtab %}
{% endtabs %}

## averageBy

Given a sequence of arbitrary data, averages together the result of the mapping function. This realizes the entire sequence.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Returns (0 + 1 + 2 + 3 + 4) / 5 = 2
const sum = Seq.fromArray([
  { balance: 0 },
  { balance: 1 },
  { balance: 2 },
  { balance: 3 },
  { balance: 4 },
]).averageBy(user => user.balance)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type averageBy = (fn: (value: T) => number) => number
```

{% endtab %}
{% endtabs %}

## frequencies

Given a non-infinite sequence, return a `Map` which counts the occurances of each unique value. This realizes the entire sequence.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Returns a Map of numbers from 0->100 and how many times they randomly occured in this set of 500.
const freq = Seq.random()
  .map(num => Math.round(num * 100))
  .take(500)
  .frequencies()
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type frequencies = () => Map<T, number>
```

{% endtab %}
{% endtabs %}

## groupBy

Group a sequence by the return of a mapping function. This realizes the entire sequence.

{% tabs %}
{% tab title="Usage" %}

```typescript
// Random generates 1000 years between 0-2000 and
// groups them by decade.
const groupedByDecade = Seq.random()
  .map(num => Math.round(num * 2000))
  .take(100)
  .groupBy(year => Math.round(year / 10))
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type groupBy = <U>(fn: (item: T) => U) => Map<U, T[]>
```

{% endtab %}
{% endtabs %}
