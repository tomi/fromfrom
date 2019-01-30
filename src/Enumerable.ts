import {
  KeySelectorFn,
  ComparerFn,
  PredicateFn,
  SelectorFn,
  Callback,
  Grouping,
  ReduceCallback,
  NumberKeyedObject,
  StringKeyedObject
} from "./types";
import { concat } from "./transforms/concat";
import { distinct } from "./transforms/distinct";
import { filter } from "./transforms/filter";
import { flatMap } from "./transforms/flatMap";
import { groupBy } from "./transforms/groupBy";
import { map } from "./transforms/map";
import { reverse } from "./transforms/reverse";
import { skip } from "./transforms/skip";
import { take } from "./transforms/take";

const identityPredicateFn = (x: any): boolean => x;

const defaultComparer = <TKey>(a: TKey, b: TKey) => {
  if (a === b) {
    return 0;
  }

  if (a < b) {
    return -1;
  }

  return 1;
};

const identityKeySelector = <TItem>(item: TItem) => item;

const getKeySelectorOrDefault = <TItem, TKey>(keySelector?: KeySelectorFn<TItem, TKey>) =>
  keySelector ? keySelector : ((identityKeySelector as unknown) as KeySelectorFn<TItem, TKey>);

const getComparerOrDefault = <TKey>(comparer?: ComparerFn<TKey>): ComparerFn<TKey> =>
  comparer ? comparer : defaultComparer;

/**
 * Enumerable sequence
 */
export class Enumerable<TItem> implements Iterable<TItem> {
  constructor(protected _iterable: Iterable<TItem>) {}

  [Symbol.iterator](): Iterator<TItem> {
    return this._iterable[Symbol.iterator]();
  }

  /**
   * Returns a new sequence that contains the items in the current sequence
   * and items from the given iterable.
   *
   * @example
   * // Returns sequence with values 1, 2, 3, 4
   * from([1, 2]).concat([3, 4]);
   */
  concat<TOther>(other: Iterable<TOther>): Enumerable<TItem | TOther> {
    return new Enumerable(concat(this._iterable, other));
  }

  /**
   * Returns unique values in the sequence. Uniqueness is checked using
   * the '===' operator.
   */
  distinct(): Enumerable<TItem> {
    return new Enumerable(distinct(this._iterable));
  }

  /**
   * Checks that all items in the sequence pass the test implemented by the
   * provided function.
   */
  every(predicate: PredicateFn<TItem> = identityPredicateFn): boolean {
    for (const item of this._iterable) {
      if (!predicate(item)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Returns a new sequence where items are filtered out for which the
   * predicate function returns a falsy value.
   */
  filter(predicate: PredicateFn<TItem>): Enumerable<TItem> {
    return new Enumerable(filter(this._iterable, predicate));
  }

  /**
   * Returns the value of the first element in the sequence that satisfies the
   * provided testing function. Otherwise undefined is returned.
   *
   * @example
   * // Returns 4
   * from([2, 4, 6]).find(x => x === 4);
   */
  find(predicate: PredicateFn<TItem>): TItem | undefined {
    for (const item of this._iterable) {
      if (predicate(item)) {
        return item;
      }
    }

    return undefined;
  }

  /**
   * Returns the first element of the sequence or undefined if
   * the sequence is empty.
   */
  first(): TItem | undefined {
    for (const item of this._iterable) {
      return item;
    }

    return undefined;
  }

  /**
   * First maps each element of the sequence using the given mapping function,
   * then flattens the result into a new sequence.
   *
   * @example
   * // Returns [1, 2, 3, 4, 5, 6]
   * from([1, 3, 5]).flatMap(x => [x, x + 1]).toArray();
   */
  flatMap<U>(mapperFn: SelectorFn<TItem, U[]>): Enumerable<U> {
    return new Enumerable(flatMap(this._iterable, mapperFn));
  }

  /**
   * Calls the given callback function with each item in the sequence.
   *
   * @example
   * // Logs 1, 2 and 3 to console
   * from([1, 2, 3]).forEach(i => console.log(i));
   */
  forEach(callback: Callback<TItem>): void {
    for (const item of this._iterable) {
      callback(item);
    }
  }

  /**
   * Groups the items in the sequence using the given item's key
   *
   * @param key Key to be used for the grouping
   *
   * @example
   * from([
   *   { name: "John", gender: "M" },
   *   { name: "Mike", gender: "M" },
   *   { name: "Lisa", gender: "F" },
   *   { name: "Mary", gender: "F" }
   * ]).groupBy("gender");
   * // Returns an enumerable with two groupings:
   * // {
   * //   key: "M",
   * //   items: [
   * //     { name: "John", gender: "M" },
   * //     { name: "Mike", gender: "M" }
   * //   ]
   * // },
   * // {
   * //   key: "F",
   * //   items: [
   * //     { name: "Lisa", gender: "F" },
   * //     { name: "Mary", gender: "F" }
   * //   ]
   * // }
   */
  groupBy<TKey extends keyof TItem>(key: TKey): Enumerable<Grouping<TItem[TKey], TItem>>;
  /**
   * Groups the items in the sequence by keys returned by the given
   * keySelector function.
   *
   * @param keySelector A function to extract the key for each element.
   *
   * @example
   * from([
   *   { name: "John", gender: "M" },
   *   { name: "Mike", gender: "M" },
   *   { name: "Lisa", gender: "F" },
   *   { name: "Mary", gender: "F" }
   * ]).groupBy(user => user.gender);
   * // Returns an enumerable with two groupings:
   * // {
   * //   key: "M",
   * //   items: [
   * //     { name: "John", gender: "M" },
   * //     { name: "Mike", gender: "M" }
   * //   ]
   * // },
   * // {
   * //   key: "F",
   * //   items: [
   * //     { name: "Lisa", gender: "F" },
   * //     { name: "Mary", gender: "F" }
   * //   ]
   * // }
   */
  groupBy<TKey>(keySelector: KeySelectorFn<TItem, TKey>): Enumerable<Grouping<TKey, TItem>>;
  /**
   * Groups the items of a sequence according to a specified key and
   * projects the elements for each group by using a specified function.
   *
   * @param key Key to be used for the grouping
   * @param elementSelector A function to map each source element to an element in an Grouping<TKey,TElement>.
   *
   * @example
   * from([
   *   { name: "John", gender: "M" },
   *   { name: "Mike", gender: "M" },
   *   { name: "Lisa", gender: "F" },
   *   { name: "Mary", gender: "F" }
   * ]).groupBy("gender", user => user.name);
   * // Returns an enumerable with two groupings:
   * // {
   * //   key: "M",
   * //   items: ["John", "Mike"]
   * // },
   * // {
   * //   key: "F",
   * //   items: ["Lisa", "Mary"]
   * // }
   */
  groupBy<TKey extends keyof TItem, TElement>(
    key: TKey,
    elementSelector: SelectorFn<TItem, TElement>
  ): Enumerable<Grouping<TItem[TKey], TItem>>;
  /**
   * Groups the elements of a sequence according to a specified key selector
   * function and projects the elements for each group by using a specified
   * function.
   *
   * @param keySelector A function to extract the key for each element.
   * @param elementSelector A function to map each source element to an element in an Grouping<TKey,TElement>.
   *
   * @example
   * from([
   *   { name: "John", gender: "M" },
   *   { name: "Mike", gender: "M" },
   *   { name: "Lisa", gender: "F" },
   *   { name: "Mary", gender: "F" }
   * ]).groupBy("gender", user => user.name);
   * // Returns an enumerable with two groupings:
   * // {
   * //   key: "M",
   * //   items: ["John", "Mike"]
   * // },
   * // {
   * //   key: "F",
   * //   items: ["Lisa", "Mary"]
   * // }
   */
  groupBy<TKey, TElement>(
    keySelector: KeySelectorFn<TItem, TKey>,
    elementSelector: SelectorFn<TItem, TElement>
  ): Enumerable<Grouping<TKey, TElement>>;
  groupBy<TKey, TElement>(
    keySelector: KeySelectorFn<TItem, TKey> | string,
    elementSelector?: SelectorFn<TItem, TElement>
  ): Enumerable<Grouping<TKey, TElement>> {
    if (typeof keySelector === "string") {
      keySelector = createSelectByKey<TItem>(keySelector);
    }

    return new Enumerable(groupBy(this._iterable, keySelector, elementSelector));
  }

  /**
   * Determines whether the sequence includes the given element,
   * returning true or false as appropriate. The check is done
   * using '==='.
   *
   * @example
   * // Returns true
   * from([1, 2, 3]).includes(3);
   */
  includes(searchItem: TItem): boolean {
    for (const item of this._iterable) {
      if (item === searchItem) {
        return true;
      }
    }

    return false;
  }

  /**
   * Returns true if the sequence is empty, false otherwise.
   */
  isEmpty(): boolean {
    return !this.some(() => true);
  }

  /**
   * Returns the first element of the sequence or undefined if
   * the sequence is empty.
   */
  last(): TItem | undefined {
    const items = Array.from(this._iterable);

    return items.length === 0 ? undefined : items[items.length - 1];
  }

  /**
   * Maps the sequence to a new sequence where each item is converted
   * to a new value using the given mapper function.
   *
   * @example
   * // Returns [2, 4, 6]
   * from([1, 2, 3]).map(x => x * 2);
   */
  map<TResult>(mapFn: SelectorFn<TItem, TResult>): Enumerable<TResult> {
    return new Enumerable(map(this._iterable, mapFn));
  }

  /**
   * Maps each item in the sequence to an object composed of the picked
   * object properties.
   */
  pick<TKeys extends keyof TItem>(...keys: TKeys[]): Enumerable<{ [P in TKeys]: TItem[P] }> {
    return this.map((item: TItem) => {
      const result: any = {};

      for (const key of keys) {
        if (key in item) {
          result[key] = item[key];
        }
      }

      return result;
    });
  }

  /**
   * Executes a reducer function on each item in the sequence resulting
   * in a single output value.
   */
  reduce<U>(callback: ReduceCallback<U, TItem>, accumulator: U): U {
    for (const item of this._iterable) {
      accumulator = callback(accumulator, item);
    }

    return accumulator;
  }

  /**
   * Reverses the order of the items in the sequence
   *
   * @example
   * // Returns [3, 2, 1]
   * from([1, 2, 3]).reverse().toArray();
   */
  reverse(): Enumerable<TItem> {
    return new Enumerable(reverse(this._iterable));
  }

  /**
   * Skips the first N items in the sequence
   *
   * @example
   * // Returns [3, 4]
   * from([1, 2, 3, 4]).skip(2);
   */
  skip(howMany: number): Enumerable<TItem> {
    return new Enumerable(skip(this._iterable, howMany));
  }

  /**
   * Returns true if sequence contains an element for which the given
   * predicate returns a truthy value.
   */
  some(predicate: PredicateFn<TItem> = identityPredicateFn): boolean {
    for (const item of this._iterable) {
      if (predicate(item)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Sorts the elements of a sequence in ascending order according to a key
   * by using a specified comparer.
   *
   * @param keySelector  A function to extract a key from an element.
   * @param comparer     A function to compare the keys
   */
  sortBy(): OrderedEnumerable<TItem, TItem>;
  sortBy<TKey>(
    keySelector: KeySelectorFn<TItem, TKey>,
    comparer?: ComparerFn<TKey>
  ): OrderedEnumerable<TItem, TKey>;
  sortBy<TKey>(
    keySelector?: KeySelectorFn<TItem, TKey>,
    comparer?: ComparerFn<TKey>
  ): OrderedEnumerable<TItem, TKey> {
    return new OrderedEnumerable(this._iterable, createCompareFn(false, keySelector, comparer));
  }

  /**
   * Sorts the elements of a sequence in descending order according to a key
   * by using a specified comparer.
   *
   * @param keySelector  A function to extract a key from an element.
   * @param comparer     A function to compare the keys
   */
  sortByDescending<TKey = TItem>(
    keySelector?: KeySelectorFn<TItem, TKey>,
    comparer?: ComparerFn<TKey>
  ): OrderedEnumerable<TItem, TKey> {
    return new OrderedEnumerable(this._iterable, createCompareFn(true, keySelector, comparer));
  }

  /**
   * Takes the firt N items from the sequence
   *
   * @example
   * // Returns [1, 2]
   * from([1, 2, 3, 4]).take(2);
   */
  take(howMany: number): Enumerable<TItem> {
    return new Enumerable(take(this._iterable, howMany));
  }

  /**
   * Converts the sequence to an array
   *
   * @example
   * // Return [1, 2, 3]
   * from([1, 2, 3]).toArray();
   */
  toArray(): TItem[] {
    return Array.from(this);
  }

  /**
   * Converts the sequence to a Map using the given keySelectorFn and
   * possible elementSelectorFn.
   *
   * @example
   * // Returns map with elements:
   * // 1 -> { id: 1, name: "John" }
   * // 2 -> { id: 2, name: "Jane"}
   * const users = [{ id: 1, name: "John" }, { id: 2, name: "Jane"}]
   * from(users).toMap(u => u.id);
   *
   * @param keySelectorFn
   * @param elementSelectorFn
   */
  toMap<TKey, TElement = TItem>(
    keySelectorFn: SelectorFn<TItem, TKey>,
    elementSelectorFn?: SelectorFn<TItem, TElement>
  ): Map<TKey, TElement> {
    const map = new Map<TKey, TElement>();

    for (const item of this) {
      const key = keySelectorFn(item);
      const value = elementSelectorFn ? elementSelectorFn(item) : item;

      map.set(key, value as TElement);
    }

    return map;
  }

  /**
   * Converts the sequence to an object using the given keySelectorFn and
   * possible elementSelectorFn.
   *
   * @example
   * // Returns an object:
   * // {
   * //   "John": { id: 1, name: "John" },
   * //   "Jane": { id: 2, name: "Jane"}
   * // }
   * const users = [{ id: 1, name: "John" }, { id: 2, name: "Jane"}]
   * from(users).toObject(u => u.name);
   *
   * @param keySelectorFn
   * @param elementSelectorFn
   */
  toObject(keySelectorFn: SelectorFn<TItem, string>): StringKeyedObject<TItem>;
  toObject(keySelectorFn: SelectorFn<TItem, number>): NumberKeyedObject<TItem>;
  toObject<TElement>(
    keySelectorFn: SelectorFn<TItem, string>,
    elementSelectorFn: SelectorFn<TItem, TElement>
  ): StringKeyedObject<TItem>;
  toObject<TElement>(
    keySelectorFn: SelectorFn<TItem, number>,
    elementSelectorFn: SelectorFn<TItem, TElement>
  ): NumberKeyedObject<TItem>;
  toObject<TElement>(
    keySelectorFn: SelectorFn<TItem, string> | SelectorFn<TItem, number>,
    elementSelectorFn?: SelectorFn<TItem, TElement>
  ):
    | StringKeyedObject<TItem>
    | NumberKeyedObject<TItem>
    | StringKeyedObject<TElement>
    | NumberKeyedObject<TElement> {
    const object: any = {};

    for (const item of this) {
      const key = keySelectorFn(item);
      const value = elementSelectorFn ? elementSelectorFn(item) : item;

      object[key] = value;
    }

    return object;
  }

  /**
   * Converts the sequence to a Set
   *
   * @example
   * // Return a Set with elements 1, 2, 3
   * from([1, 1, 2, 3]).toSet();
   */
  toSet(): Set<TItem> {
    return new Set(this);
  }
}

/**
 * Ordered sequence of elements
 */
export class OrderedEnumerable<TItem, TKey> extends Enumerable<TItem> {
  private _comparer: ComparerFn<TItem>;

  constructor(iterable: Iterable<TItem>, comparer: ComparerFn<TItem>) {
    function* _sort(): IterableIterator<TItem> {
      const items = Array.from(iterable).sort(comparer);

      for (const item of items) {
        yield item;
      }
    }

    super(_sort());

    this._comparer = comparer;
  }

  thenBy<TOtherKey>(
    keySelector: KeySelectorFn<TItem, TOtherKey>,
    comparer?: ComparerFn<TOtherKey>
  ): OrderedEnumerable<TItem, TOtherKey> {
    const thenComparer = createCompareFn(false, keySelector, comparer);

    return new OrderedEnumerable(
      this._iterable,
      createChainedCompareFn(this._comparer, thenComparer)
    );
  }

  thenByDescending<TOtherKey>(
    keySelector: KeySelectorFn<TItem, TOtherKey>,
    comparer?: ComparerFn<TOtherKey>
  ): OrderedEnumerable<TItem, TOtherKey> {
    const thenComparer = createCompareFn(true, keySelector, comparer);

    return new OrderedEnumerable(
      this._iterable,
      createChainedCompareFn(this._comparer, thenComparer)
    );
  }
}

/**
 * Creates a compare function that sorts TItems either ascending or descending
 * using the given key selector and comparer.
 *
 * @param descending  Sort descending or ascending
 * @param keySelector Optional function to select the key that is used for sorting
 * @param comparer    Optional comparer function to compare the keys
 */
const createCompareFn = <TItem, TKey>(
  descending: boolean,
  keySelector?: KeySelectorFn<TItem, TKey>,
  comparer?: ComparerFn<TKey>
) => (a: TItem, b: TItem) => {
  keySelector = getKeySelectorOrDefault(keySelector);
  comparer = getComparerOrDefault(comparer);

  const aKey = keySelector(a);
  const bKey = keySelector(b);

  return descending ? comparer(bKey, aKey) : comparer(aKey, bKey);
};

/**
 * Chains two compare functions. First sort by firstCompare. If items
 * are equal, then sorts by secondCompare.
 *
 * @param firstCompare
 * @param secondCompare
 */
const createChainedCompareFn = <TItem>(
  firstCompare: ComparerFn<TItem>,
  secondCompare: ComparerFn<TItem>
) => (a: TItem, b: TItem) => {
  const firstResult = firstCompare(a, b);

  return firstResult === 0 ? secondCompare(a, b) : firstResult;
};

const createSelectByKey = <TItem>(key: string) => (item: TItem) =>
  key in item ? (item as any)[key] : undefined;
