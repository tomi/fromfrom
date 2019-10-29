import { ComparePredicate } from "../types";

export function* without<TItem>(
  iterator: Iterable<TItem>,
  withoutItems: Iterable<TItem>,
  comparePredicate: ComparePredicate<TItem>
) {
  // cache already found results
  const cache = new Set();

  outer: for (const item of iterator) {
    // fast path, this item was already found, don't loop
    if (cache.has(item)) continue;
    // slow path, loop over each item in the set, determine if it matches the ComparePredicate
    for (const withoutItem of withoutItems) {
      // if the item is found, add it to the cache and skip the item
      if (comparePredicate(item, withoutItem)) {
        cache.add(item);
        continue outer;
      }
    }

    // we can safely yield the item
    yield item;
  }
}
