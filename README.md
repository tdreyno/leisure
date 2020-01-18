# Leisure

Leisure is a TypeScript library provides lazy Sequences.

Documentation of this project is a work in progress. For now, take a look at the example below and lean heavily on TypeScript's information around the public API.

## Installation

### Yarn

```sh
yarn add @tdreyno/leisure
```

### NPM

```sh
npm install --save @tdreyno/leisure
```

## Examples

```typescript
Seq.infinite()
  .take(4)
  .sum();
```

## License

Leisure is licensed under the the Hippocratic License. It is an [Ethical Source license](https://ethicalsource.dev) derived from the MIT License, amended to limit the impact of the unethical use of open source software.
