import { KeySelectorFn, MapFn, Grouping } from "../types";

export function* groupBy<TItem, TKey, TElement>(
  iterable: Iterable<TItem>,
  keySelector: KeySelectorFn<TItem, TKey>,
  elementSelector?: MapFn<TItem, TElement>
): IterableIterator<Grouping<TKey, TElement>> {
  const groups = new Map<TKey, TElement[]>();

  for (const item of iterable) {
    const key = keySelector(item);
    const value = elementSelector
      ? elementSelector(item)
      : ((item as unknown) as TElement);

    let group = groups.get(key);
    if (!group) {
      group = [];
      groups.set(key, group);
    }

    group.push(value);
  }

  for (const keyItemsPair of groups.entries()) {
    yield {
      key: keyItemsPair[0],
      items: keyItemsPair[1],
    };
  }
}
