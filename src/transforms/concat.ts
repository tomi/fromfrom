import { IterableCreatorIterable } from "../IterableCreatorIterable";

export const createConcatIterable = <TItem, TOther>(
  source: Iterable<TItem>,
  ...others: Iterable<TOther>[]
): Iterable<TItem | TOther> =>
  new IterableCreatorIterable(function* concat(): IterableIterator<
    TItem | TOther
  > {
    for (const item of source) {
      yield item;
    }

    for (const other of others) {
      for (const item of other) {
        yield item;
      }
    }
  });
