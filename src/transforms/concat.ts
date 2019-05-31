import { IterableCreatorIterable } from "../IterableCreatorIterable";

export const createConcatIterable = <TItem, TOther>(
  source: Iterable<TItem>,
  ...others: Iterable<TOther>[]
): Iterable<TItem | TOther> =>
  new IterableCreatorIterable(function* concat(): IterableIterator<
    TItem | TOther
  > {
    yield* source;
    for (const other of others) {
      yield* other;
    }
  });
