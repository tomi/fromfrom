import { IterableCreatorIterable } from "../IterableCreatorIterable";
import { PredicateFn } from "../types";

export const createTakeWhileIterable = <TItem>(
  iterable: Iterable<TItem>,
  predicate: PredicateFn<TItem>
): Iterable<TItem> =>
  new IterableCreatorIterable(function* take(): IterableIterator<TItem> {
    for (const item of iterable) {
      if (!predicate(item)) {
        break;
      }

      yield item;
    }
  });
