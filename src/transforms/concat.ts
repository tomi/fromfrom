export function* concat<TItem, TOther>(
  source: Iterable<TItem>,
  ...others: Iterable<TOther>[]
) {
  yield* source;
  for (const other of others) {
    yield* other;
  }
}
