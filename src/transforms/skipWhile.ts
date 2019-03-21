import { IterableCreatorIterable } from "../IterableCreatorIterable";
import { PredicateFn } from "../types";

export const createSkipWhileIterable = <TItem>(
  iterable: Iterable<TItem>,
  predicate: PredicateFn<TItem>
): Iterable<TItem> =>
  new IterableCreatorIterable(function* skip(): IterableIterator<TItem> {
    let startTaking = false;

    for (const item of iterable) {
      if (startTaking) {
        yield item;
      } else if (!predicate(item)) {
        yield item;
        startTaking = true;
      }
    }
  });
