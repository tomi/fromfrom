import { MapFn } from "../types";
import { IterableCreatorIterable } from "../IterableCreatorIterable";

export const createMapIterable = <TItem, TResult>(
  source: Iterable<TItem>,
  mapFn: MapFn<TItem, TResult>
): Iterable<TResult> =>
  new IterableCreatorIterable(function* map(): IterableIterator<TResult> {
    for (const item of source) {
      yield mapFn(item);
    }
  });
