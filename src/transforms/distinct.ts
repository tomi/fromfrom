import { IterableCreatorIterable } from "../IterableCreatorIterable";

export const createDistinctIterable = <TItem>(iterable: Iterable<TItem>): Iterable<TItem> =>
  new IterableCreatorIterable(function* distinct(): IterableIterator<TItem> {
    const unique = new Set();

    for (const item of iterable) {
      if (!unique.has(item)) {
        unique.add(item);
        yield item;
      }
    }
  });
