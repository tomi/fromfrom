import { IterableCreatorIterable } from "../IterableCreatorIterable";
import { copyIntoAnArray } from "../utils";

export const createReverseIterable = <TItem>(
  iterable: Iterable<TItem>
): Iterable<TItem> =>
  new IterableCreatorIterable(function* reverse(): IterableIterator<TItem> {
    const items = copyIntoAnArray(iterable);

    for (let i = items.length - 1; i >= 0; i--) {
      yield items[i];
    }
  });
