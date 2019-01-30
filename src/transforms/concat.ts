export function* concat<TItem, TOther>(
  iterable: Iterable<TItem>,
  other: Iterable<TOther>
): IterableIterator<TItem | TOther> {
  for (const item of iterable) {
    yield item;
  }

  for (const item of other) {
    yield item;
  }
}
