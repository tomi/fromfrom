import { KeySelectorFn, MapFn, Grouping } from "../types";

export function* groupBy<TItem, TKey, TElement>(
  iterable: Iterable<TItem>,
  keySelector: KeySelectorFn<TItem, TKey>,
  elementSelector?: MapFn<TItem, TElement>
): IterableIterator<Grouping<TKey, TElement>> {
  const groups = new Map<any, { isKeyHashed: boolean; items: TElement[] }>();

  for (const item of iterable) {
    let key: any = keySelector(item);
    // Check if we need to hash the key so that equality works correctly
    // with Map. This is to support object's (and array's) as the key.
    // We don't want to hash every single item, because it slows down
    // the algorithm a lot.
    const needToHash = typeof key === "object";
    if (needToHash) {
      key = JSON.stringify(key);
    }

    const value = elementSelector
      ? elementSelector(item)
      : ((item as unknown) as TElement);

    let group = groups.get(key);
    if (!group) {
      group = { isKeyHashed: needToHash, items: [] };
      groups.set(key, group);
    }

    group.items.push(value);
  }

  for (const keyItemsPair of groups.entries()) {
    yield {
      key: keyItemsPair[1].isKeyHashed
        ? JSON.parse(keyItemsPair[0])
        : keyItemsPair[0],
      items: keyItemsPair[1].items,
    };
  }
}
