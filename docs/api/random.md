# Random Number Generating Methods

These methods create reproducible sequences of random numbers given an initial seed value.

This methods rely on the [pure-rand](https://github.com/dubzzz/pure-rand) project.

## random

Generates random numbers using the Mersenne Twister generator whose values are within the range 0 to 0xffffffff.

{% tabs %}
{% tab title="Usage" %}

```typescript
const SEED = 5
const sequence: Seq<number> = random(SEED)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type random = (seed = DEFAULT_SEED) => Seq<number>
```

{% endtab %}
{% endtabs %}

## mersenne

Generates random numbers using the Mersenne Twister generator whose values are within the range 0 to 0xffffffff.

{% tabs %}
{% tab title="Usage" %}

```typescript
const SEED = 5
const sequence: Seq<number> = mersenne(SEED)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type mersenne = (seed = DEFAULT_SEED) => Seq<number>
```

{% endtab %}
{% endtabs %}

## xorshift128plus

Generates random numbers using the xorshift128+ generator whose values are within the range -0x80000000 to 0x7fffffff.

{% tabs %}
{% tab title="Usage" %}

```typescript
const SEED = 5
const sequence: Seq<number> = xorshift128plus(SEED)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type xorshift128plus = (seed = DEFAULT_SEED) => Seq<number>
```

{% endtab %}
{% endtabs %}

## xoroshiro128plus

Generates random numbers using the xoroshiro128+ generator whose values are within the range -0x80000000 to 0x7fffffff.

{% tabs %}
{% tab title="Usage" %}

```typescript
const SEED = 5
const sequence: Seq<number> = xoroshiro128plus(SEED)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type xoroshiro128plus = (seed = DEFAULT_SEED) => Seq<number>
```

{% endtab %}
{% endtabs %}

## congruential

Generates random numbers using a Linear Congruential generator whose values are within the range 0 to 0x7fff.

{% tabs %}
{% tab title="Usage" %}

```typescript
const SEED = 5
const sequence: Seq<number> = congruential(SEED)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type congruential = (seed = DEFAULT_SEED) => Seq<number>
```

{% endtab %}
{% endtabs %}

## congruential32

Generates random numbers using a Linear Congruential generator whose values are within the range 0 to 0xffffffff.

{% tabs %}
{% tab title="Usage" %}

```typescript
const SEED = 5
const sequence: Seq<number> = congruential32(SEED)
```

{% endtab %}

{% tab title="Type Definition" %}

```typescript
type congruential32 = (seed = DEFAULT_SEED) => Seq<number>
```

{% endtab %}
{% endtabs %}
