# Combinatorial Methods

These methods create sequences of the very large combinations of values.

## cartesianProduct

Generates sequence of the [Cartesian product](https://en.wikipedia.org/wiki/Cartesian_product) of an arbitrary number of columns of data.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<[string, number]> = cartesianProduct(
  ["a", "b", "c"],
  [1, 2, 3]
);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type cartesianProduct = <T>(...inputs: T[][]) => Seq<T[]>;
```

{% endtab %}
{% endtabs %}

## powerSet

Generates sequence of Sets of a [Power set](https://en.wikipedia.org/wiki/Power_set).

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<Set<string>> = powerSet(["a", "b", "c"]);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type powerSet = <T>(...items: T[]) => Seq<Set<T>>;
```

{% endtab %}
{% endtabs %}

## combination

Generates sequence of Sets of a [Combination](https://en.wikipedia.org/wiki/Combination) of a given length.

{% tabs %}
{% tab title="Usage" %}

```typescript
const sequence: Seq<Set<string>> = combination(["a", "b", "c"], 2);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type combination = <T>(items: T[], size: number) => Seq<Set<T>>;
```

{% endtab %}
{% endtabs %}
