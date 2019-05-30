import { IterableCreatorIterable } from "../IterableCreatorIterable";

export const createPrependIterable = <TItem, TOther>(
  source: Iterable<TItem>,
  ...others: Iterable<TOther>[]
): Iterable<TItem | TOther> =>
  new IterableCreatorIterable(function* prepend(): IterableIterator<
    TItem | TOther
  > {
    for (const other of others) {
      for (const item of other) {
        yield item;
      }
    }

    for (const item of source) {
      yield item;
    }
  });
