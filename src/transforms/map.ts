import { SelectorFn } from "../types";

export function* map<TItem, TResult>(
  iterable: Iterable<TItem>,
  mapFn: SelectorFn<TItem, TResult>
): IterableIterator<TResult> {
  for (const item of iterable) {
    yield mapFn(item);
  }
}
