# Introduction

`leisure` is a TypeScript library for creating and manipulating lazy sequences of data. The API surface resembles the ES6 `map`/`filter`/`reduce` API, but also adds many useful helpers often seen in [Lodash](https://lodash.com/) or [Ramda](https://ramdajs.com/).

The difference between `leisure` and those non-lazy libraries is the guarantee that no computations will happen unless the result is actually used. Here's an example:

{% code %}

```typescript
type User = { name: string; address: string };
type Address = { city: string; streetNumber: number; owner: User };

const parseAddress = (address: string): Address => { /* Does parsing */ }

// Assume we have a list of 100 users from the database.
const users: User[] = [ user1, user2, user3, ..., user99, user100 ];

// Parse the data and find the users who live in my hometown.
const neighbor = users
  .map(user => parseAddress(user.address))
  .filter(address => address.city === "My Hometown")
  .map(address => address.owner)[0];
```

{% endcode %}

The above example will run `map` across the entire list of users. The code will parse 100 addresses. In this trivial example, that computation is likely very fast, but imagine if it were more intensive \(say, using computer vision in the browser to detect a landmark\). The `filter` will then also run 100 times to find the subset of addresses we are looking for. Then the second `map` will run 100 more times \(admittedly convoluted\). The total time of the computation is `O(3N)`.

At the end of the computation we discover that we only need the first matching result. If we were to operate on this data in a lazy fashion, the best case scenario is that the user we are looking for is first in this list. Utilizing lazy execution the first `map` would one once on the first user, that resulting address would run once through the `filter` and pass, then that address would run once more through the second `map`. The total computation would be `O(3)`. The worst case computation, where there is only 1 match and it is at the very end would be as slow as the original, but every single other permutation would be faster using the lazy approach.

Here is that same example using `leisure`:

{% code %}

```typescript
import Seq from "@tdreyno/leisure";

// Assume the types and data are the same.
const neighbor = Seq.fromArray(users)
  .map(user => parseAddress(user.address))
  .filter(address => address.city === "My Hometown")
  .map(address => address.owner)
  .first();
```

{% endcode %}

As you can see, the API is nearly identical, with the exception of the `first` helper method.

## Infinite sequences

One of the very interesting side-effects of being lazy is the ability to interact with infinite sequences and perform the smallest number of possible computations to search over all the possibilities. For a very contrived example, find me the first number in the Fibonacci sequence that contains my birthday \(let's say I was born at the beginning of the millennium: `2000_01_01`\).

{% code %}

```typescript
import Seq from "@tdreyno/leisure";

const myBirthDay: number = 2000_01_01;

const myBirthDayFib: number = Seq
  // Generate an infinite sequence that adds one Fib value each step.
  .iterate([0, 1], ([a, b]) => [b, a + b])

  // Find the one which has my birthday as a substring.
  .find(([fib]) => fib.toString().includes(myBirthDay.toString()))

  // Get just the number, not the pair.
  .map(([fib]) => fib);
```

{% endcode %}

Maybe it will run forever? Maybe it will find one very fast :\)

## Realization

Most methods in the library ask for one value from the previous computation at a time. However, some require the entire sequence of values. The process of converting a lazy sequence into a non-lazy version is called "realization." The `.first` and `.find` methods we've been using are examples. They take a Sequence and return a normal JavaScript value.

Here's an example which discards the first 10 numbers of an infinite sequence, then grabs the next five and uses them.

{% code %}

```typescript
import Seq from "@tdreyno/leisure";

const tenThroughFourteen: number[] = Seq.infinite()
  // Ignore 0-9
  .skip(10)
  // Grab 10-14
  .take(5)
  // Realize the sequence into a real array
  .toArray();
```

{% endcode %}

There are a handful of methods which require the entire sequence, which means they will run infinitely if given an infinite sequence. They are: `toArray`, `toSet`, `toMap`, `forEach`, `sum`, `sumBy`, `average`, `averageBy`, `frequencies` and `groupBy`.

To avoid infinite loops, `leisure` caps the maximum number of infinite values to `1_000_000`. This number is configurable by setting `Seq.MAX_YIELDS` to whatever you want your max loop size to be.

## Integration with non-lazy JavaScript

`leisure` implements the Iterator protocol which means you can use it to lazily pull values using a normal `for` loop.

{% code %}

```typescript
import Seq from "@tdreyno/leisure";

for (let i of Seq.infinite()) {
  if (i > 10) {
    console.log("counted to ten");
    break;
  }
}
```

{% endcode %}

## Common usage

`leisure` can be used as a drop-in replacement for the ES6 `map`/`filter`/`reduce` API. If that's all you need, you can still benefit from the reduction in operations in the non-worst-case scenarios.

However, if you dig into `leisure`'s helper methods, you'll be able to write more expressive data computations. With the ES6 API, developers often drop into `reduce` for more complex data transformations. These reducer bodies can be difficult to read and understand how they are actually transforming the data. `leisure` provides methods which do these common transformations and names them so your code is more readable. Dropping all the way down into a reducer is quite rare in `leisure` code.

[Take a look at the full `leisure` API.](docs/api/instance.md)

## Prior Art

This library takes inspiration from Lazy Sequences in [Clojure](https://clojure.org/reference/sequences) and [F\#](https://docs.microsoft.com/en-us/dotnet/fsharp/language-reference/sequences).

[Lazy.js](https://github.com/dtao/lazy.js) is a popular lazy sequence library for JavaScript, but it was not written in TypeScript and I prefer to use libraries that think about types and transformations from the beginning.

There is some overlap between Lazy Sequences and the Functional Reactive Programming libraries. In my opinion, FRP is more concerned about event systems and Lazy Sequences are more useful for data processing.
