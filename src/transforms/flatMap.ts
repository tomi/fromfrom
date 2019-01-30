import { SelectorFn } from "../types";

export function* flatMap<TItem, TOther>(
  iterable: Iterable<TItem>,
  mapperFn: SelectorFn<TItem, TOther[]>
): IterableIterator<TOther> {
  for (const item of iterable) {
    const sequence = mapperFn(item);

    for (const mappedItem of sequence) {
      yield mappedItem;
    }
  }
}
