import { PredicateFn } from "../types";
import { IterableCreatorIterable } from "../IterableCreatorIterable";

export const createFilterIterable = <TItem>(
  iterable: Iterable<TItem>,
  predicate: PredicateFn<TItem>
): Iterable<TItem> =>
  new IterableCreatorIterable(function* filter(): IterableIterator<TItem> {
    for (const item of iterable) {
      if (predicate(item)) {
        yield item;
      }
    }
  });
