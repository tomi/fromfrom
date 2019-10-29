import { PredicateFn } from "../types";

export function* takeWhile<TItem>(
  iterable: Iterable<TItem>,
  predicate: PredicateFn<TItem>
) {
  for (const item of iterable) {
    if (!predicate(item)) {
      break;
    }

    yield item;
  }
}
