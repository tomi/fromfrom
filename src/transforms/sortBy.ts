import { IterableCreatorIterable } from "../IterableCreatorIterable";
import { ComparerFn } from "../types";

export const createSortByIterable = <TItem>(
  iterable: Iterable<TItem>,
  comparer: ComparerFn<TItem>
): Iterable<TItem> =>
  new IterableCreatorIterable(function* sort(): IterableIterator<TItem> {
    const items = Array.from(iterable).sort(comparer);
    yield* items;
  });
