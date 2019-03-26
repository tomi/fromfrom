import { ComparePredicate } from "../types";
import { createFilterIterable } from "./filter";
import { IterableCreatorIterable } from "../IterableCreatorIterable";

export const createWithoutIterable = <TItem>(
  iterator: Iterable<TItem>,
  withoutItems: Iterable<TItem>,
  comparePredicate?: ComparePredicate<TItem>
): Iterable<TItem> => {
  const withoutSet = new Set(withoutItems);
  if (!comparePredicate) {
    // fast path, create a filter iterable with the `Set.prototype.has` function call
    return createFilterIterable(iterator, item => !withoutSet.has(item));
  } else {
    // Must compare each item for equality for each item
    return new IterableCreatorIterable(function* filter(): IterableIterator<
      TItem
    > {
      // cache already found results
      const cache = new Set();

      outer: for (const item of iterator) {
        // fast path, this item was already found, don't loop
        if (cache.has(item)) continue;
        // slow path, loop over each item in the set, determine if it matches the ComparePredicate
        for (const withoutItem of withoutSet) {
          // if the item is found, add it to the cache and skip the item
          if (comparePredicate(item, withoutItem)) {
            cache.add(item);
            continue outer;
          }
        }

        // we can safely yield the item
        yield item;
      }
    });
  }
};
