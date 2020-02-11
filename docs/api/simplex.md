# Simplex Methods

These methods create sequences of simplex noise.

## simplex2D

Generates a 2d simplex noise.

{% tabs %}
{% tab title="Usage" %}

```typescript
const SEED = 5;
const sequence: Seq<number> = simplex2D((x, y) => x + y, SEED);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type simplex2D = (
  fn: () => [number, number],
  seed: number = Date.now()
) => Seq<number>;
```

{% endtab %}
{% endtabs %}

## simplex3D

Generates a 3d simplex noise.

{% tabs %}
{% tab title="Usage" %}

```typescript
const SEED = 5;
const sequence: Seq<number> = simplex3D((x, y, z) => x + y + z, SEED);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type simplex3D = (
  fn: () => [number, number, number],
  seed: number = Date.now()
) => Seq<number>;
```

{% endtab %}
{% endtabs %}

## simplex4D

Generates a 4d simplex noise.

{% tabs %}
{% tab title="Usage" %}

```typescript
const SEED = 5;
const sequence: Seq<number> = simplex4D((x, y, z, w) => x + y + z + w, SEED);
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type simplex4D = (
  fn: () => [number, number, number, number],
  seed: number = Date.now()
) => Seq<number>;
```

{% endtab %}
{% endtabs %}
