export function* prepend<TItem, TOther>(
  source: Iterable<TItem>,
  ...others: Iterable<TOther>[]
) {
  for (const other of others) {
    yield* other;
  }
  yield* source;
}
