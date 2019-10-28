import { IterableCreatorIterable } from "../IterableCreatorIterable";
import { ComparerFn } from "../types";
import { copyIntoAnArray } from "../utils";

export const createSortByIterable = <TItem>(
  iterable: Iterable<TItem>,
  comparer: ComparerFn<TItem>
): Iterable<TItem> =>
  new IterableCreatorIterable(function* sort(): IterableIterator<TItem> {
    yield* copyIntoAnArray(iterable).sort(comparer);
  });
