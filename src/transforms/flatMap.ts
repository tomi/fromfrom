import { MapFn } from "../types";
import { IterableCreatorIterable } from "../IterableCreatorIterable";

export const createFlatMapIterable = <TItem, TOther>(
  iterable: Iterable<TItem>,
  mapperFn: MapFn<TItem, TOther[]>
): Iterable<TOther> =>
  new IterableCreatorIterable(function* flatMap(): IterableIterator<TOther> {
    for (const item of iterable) {
      const sequence = mapperFn(item);
      yield* sequence;
    }
  });
