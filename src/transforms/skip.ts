import { IterableCreatorIterable } from "../IterableCreatorIterable";

export const createSkipIterable = <TItem>(
  iterable: Iterable<TItem>,
  howMany: number
): Iterable<TItem> =>
  new IterableCreatorIterable(function* skip(): IterableIterator<TItem> {
    let numSkipped = 0;

    for (const item of iterable) {
      if (numSkipped < howMany) {
        numSkipped++;
        continue;
      }

      yield item;
    }
  });
