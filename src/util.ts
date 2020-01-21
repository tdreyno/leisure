export function constant<T>(value: T): () => T {
  return () => value;
}

export function identity<T>(x: T): T {
  return x;
}
