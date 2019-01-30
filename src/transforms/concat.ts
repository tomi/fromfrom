import { IterableCreatorIterable } from "../IterableCreatorIterable";

export const createConcatIterable = <TItem, TOther>(
  source: Iterable<TItem>,
  other: Iterable<TOther>
): Iterable<TItem | TOther> =>
  new IterableCreatorIterable(function* concat(): IterableIterator<TItem | TOther> {
    for (const item of source) {
      yield item;
    }

    for (const item of other) {
      yield item;
    }
  });
