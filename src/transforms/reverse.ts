export function* reverse<TItem>(iterable: Iterable<TItem>): IterableIterator<TItem> {
  const items = Array.from(iterable);

  for (let i = items.length - 1; i >= 0; i--) {
    yield items[i];
  }
}
