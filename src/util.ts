export function constant<T>(value: T): () => T {
  return (): T => value;
}

export function identity<T>(x: T): T {
  return x;
}
