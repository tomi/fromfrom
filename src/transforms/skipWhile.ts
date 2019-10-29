import { PredicateFn } from "../types";

export function* skipWhile<TItem>(
  iterable: Iterable<TItem>,
  predicate: PredicateFn<TItem>
) {
  let startTaking = false;

  for (const item of iterable) {
    if (startTaking) {
      yield item;
    } else if (!predicate(item)) {
      yield item;
      startTaking = true;
    }
  }
}
