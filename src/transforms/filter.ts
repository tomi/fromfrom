import { PredicateFn } from "../types";

export function* filter<TItem>(
  iterable: Iterable<TItem>,
  predicate: PredicateFn<TItem>
) {
  for (const item of iterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}
