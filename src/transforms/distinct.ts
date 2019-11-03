export function* distinct<TItem>(iterable: Iterable<TItem>) {
  const unique = new Set();

  for (const item of iterable) {
    if (!unique.has(item)) {
      unique.add(item);
      yield item;
    }
  }
}
