# Instance Methods

## map

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type map = <U>(fn: (value: T, key: K) => U) => Seq<K, U>;
```

{% endtab %}
{% endtabs %}

## window

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type window = (size: number, allowPartialWindow = true) => Seq<number, T[]>;
```

{% endtab %}
{% endtabs %}

## pairwise

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type pairwise = () => Seq<number, [T, T]>;
```

{% endtab %}
{% endtabs %}

## isEmpty

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type isEmpty = () => boolean;
```

{% endtab %}
{% endtabs %}

## tap

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type tap = (fn: (value: T, key: K) => void) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## log

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type log = () => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## flatMap

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type flatMap = <U>(fn: (value: T, key: K) => U[]) => Seq<number, U>;
```

{% endtab %}
{% endtabs %}

## filter

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type filter = (fn: (value: T, key: K) => unknown) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## concat

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type concat = (...tail: Array<Seq<K, T>>) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## interleave

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type interleave = (...tail: Array<Seq<K, T>>) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## interpose

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type interpose = (separator: T) => Seq<number, T>;
```

{% endtab %}
{% endtabs %}

## distinctBy

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type distinctBy = <U>(fn: (value: T) => U) => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## distinct

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type distinct = () => Seq<K, T>;
```

{% endtab %}
{% endtabs %}

## partition

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type partition = (fn: (value: T, key: K) => unknown) => [Seq<K, T>, Seq<K, T>];
```

{% endtab %}
{% endtabs %}

## includes

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type includes = (value: T) => boolean;
```

{% endtab %}
{% endtabs %}

## find

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type find = (fn: (value: T, key: K) => unknown) => T | undefined;
```

{% endtab %}
{% endtabs %}

## reduce

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type reduce = <A>(fn: (sum: A, value: T, key: K) => A, initial: A) => A;
```

{% endtab %}
{% endtabs %}

## chain

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type chain = <U>(fn: (value: Seq<K, T>) => U) => U;
```

{% endtab %}
{% endtabs %}

## some

{% tabs %}
{% tab title="Usage" %}

```typescript
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type some = (fn: (value: T, key: K) => unknown) => boolean;
```

{% endtab %}
{% endtabs %}

## every

{% tabs %}
{% tab title="Usage" %}

```typescript
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
