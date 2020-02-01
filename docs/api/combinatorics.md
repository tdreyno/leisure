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
