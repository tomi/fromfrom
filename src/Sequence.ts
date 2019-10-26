import {
  KeySelectorFn,
  ComparerFn,
  PredicateFn,
  MapFn,
  CallbackFn,
  Grouping,
  ReduceCallbackFn,
  NumberKeyedObject,
  StringKeyedObject,
  ComparePredicate,
} from "./types";
import { createConcatIterable } from "./transforms/concat";
import { createDistinctIterable } from "./transforms/distinct";
import { createFilterIterable } from "./transforms/filter";
import { createFlatMapIterable } from "./transforms/flatMap";
import { createGroupByIterable } from "./transforms/groupBy";
import { createMapIterable } from "./transforms/map";
import { createReverseIterable } from "./transforms/reverse";
import { createSkipIterable } from "./transforms/skip";
import { createTakeIterable } from "./transforms/take";
import { createSortByIterable } from "./transforms/sortBy";
import { createTakeWhileIterable } from "./transforms/takeWhile";
import { createSkipWhileIterable } from "./transforms/skipWhile";
import { createWithoutIterable } from "./transforms/without";
import { createPrependIterable } from "./transforms/prepend";

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

const getKeySelectorOrDefault = <TItem, TKey>(
  keySelector?: KeySelectorFn<TItem, TKey>
) =>
  keySelector
    ? keySelector
    : ((identityKeySelector as unknown) as KeySelectorFn<TItem, TKey>);

const getComparerOrDefault = <TKey>(
  comparer?: ComparerFn<TKey>
): ComparerFn<TKey> => (comparer ? comparer : defaultComparer);

/**
 * A sequence of items
 */
export class Sequence<TItem> implements Iterable<TItem> {
  constructor(protected _iterable: Iterable<TItem>) {}

  [Symbol.iterator](): Iterator<TItem> {
    return this._iterable[Symbol.iterator]();
  }

  /**
   * Returns a new sequence that contains the items in the current sequence
   * and items from the given iterable.
   *
   * @example
   * ```typescript
   * // Returns sequence with values 1, 2, 3, 4
   * from([1, 2]).concat([3, 4]);
   * ```
   */
  concat<TOther>(...others: Iterable<TOther>[]): Sequence<TItem | TOther> {
    return new Sequence(createConcatIterable(this._iterable, ...others));
  }

  /**
   * Returns unique values in the sequence. Uniqueness is checked using
   * the '===' operator.
   *
   * @example
   * ```typescript
   * // Returns a sequence with the values 4, 5
   * from([4, 4, 5, 4]).distinct();
   * ```
   */
  distinct(): Sequence<TItem> {
    return new Sequence(createDistinctIterable(this._iterable));
  }

  /**
   * Checks that all items in the sequence pass the test implemented by the
   * provided function.
   *
   * @example
   * ```typescript
   * // Returns false
   * from([-1, 4, 5, 6]).every(x => x >= 0);
   * ```
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
   *
   * @example
   * ```typescript
   * // Returns a squence with the value -1
   * from([-1, 4, 5, 6]).filter(x => x < 0);
   * ```
   */
  filter(predicate: PredicateFn<TItem>): Sequence<TItem> {
    return new Sequence(createFilterIterable(this._iterable, predicate));
  }

  /**
   * Returns the value of the first element in the sequence that satisfies the
   * provided testing function. Otherwise undefined is returned.
   *
   * @example
   * ```typescript
   * // Returns 4
   * from([2, 4, 6]).find(x => x === 4);
   * ```
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
   *
   * @example
   * ```typescript
   * // Returns 1
   * from([1, 3, 5]).first();
   * ```
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
   * ```typescript
   * // Returns [1, 2, 3, 4, 5, 6]
   * from([1, 3, 5]).flatMap(x => [x, x + 1]).toArray();
   * ```
   */
  flatMap<TResultItem>(
    mapperFn: MapFn<TItem, TResultItem[]>
  ): Sequence<TResultItem> {
    return new Sequence(createFlatMapIterable(this._iterable, mapperFn));
  }

  /**
   * Calls the given callback function with each item in the sequence.
   *
   * @example
   * ```typescript
   * // Logs 1, 2 and 3 to console
   * from([1, 2, 3]).forEach(i => console.log(i));
   * ```
   */
  forEach(callback: CallbackFn<TItem>): void {
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
   * ```typescript
   * from([
   *   { name: "John", gender: "M" },
   *   { name: "Mike", gender: "M" },
   *   { name: "Lisa", gender: "F" },
   *   { name: "Mary", gender: "F" }
   * ]).groupBy("gender");
   * // Returns a sequence with two groupings:
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
   * ```
   */
  groupBy<TKey extends keyof TItem>(
    key: TKey
  ): Sequence<Grouping<TItem[TKey], TItem>>;
  /**
   * Groups the items in the sequence by keys returned by the given
   * keySelector function.
   *
   * @param keySelector A function to extract the key for each element.
   *
   * @example
   * ```typescript
   * from([
   *   { name: "John", gender: "M" },
   *   { name: "Mike", gender: "M" },
   *   { name: "Lisa", gender: "F" },
   *   { name: "Mary", gender: "F" }
   * ]).groupBy(user => user.gender);
   * // Returns a sequence with two groupings:
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
   * ```
   */
  groupBy<TKey>(
    keySelector: KeySelectorFn<TItem, TKey>
  ): Sequence<Grouping<TKey, TItem>>;
  /**
   * Groups the items of a sequence according to a specified key and
   * projects the elements for each group by using a specified function.
   *
   * @param key Key to be used for the grouping
   * @param elementSelector A function to map each source element to an element in an Grouping<TKey,TElement>.
   *
   * @example
   * ```typescript
   * from([
   *   { name: "John", gender: "M" },
   *   { name: "Mike", gender: "M" },
   *   { name: "Lisa", gender: "F" },
   *   { name: "Mary", gender: "F" }
   * ]).groupBy("gender", user => user.name);
   * // Returns a sequence with two groupings:
   * // {
   * //   key: "M",
   * //   items: ["John", "Mike"]
   * // },
   * // {
   * //   key: "F",
   * //   items: ["Lisa", "Mary"]
   * // }
   * ```
   */
  groupBy<TKey extends keyof TItem, TElement>(
    key: TKey,
    elementSelector: MapFn<TItem, TElement>
  ): Sequence<Grouping<TItem[TKey], TItem>>;
  /**
   * Groups the elements of a sequence according to a specified key selector
   * function and projects the elements for each group by using a specified
   * function.
   *
   * @param keySelector A function to extract the key for each element.
   * @param elementSelector A function to map each source element to an element in an Grouping<TKey,TElement>.
   *
   * @example
   * ```typescript
   * from([
   *   { name: "John", gender: "M" },
   *   { name: "Mike", gender: "M" },
   *   { name: "Lisa", gender: "F" },
   *   { name: "Mary", gender: "F" }
   * ]).groupBy("gender", user => user.name);
   * // Returns a sequence with two groupings:
   * // {
   * //   key: "M",
   * //   items: ["John", "Mike"]
   * // },
   * // {
   * //   key: "F",
   * //   items: ["Lisa", "Mary"]
   * // }
   * ```
   */
  groupBy<TKey, TElement>(
    keySelector: KeySelectorFn<TItem, TKey>,
    elementSelector: MapFn<TItem, TElement>
  ): Sequence<Grouping<TKey, TElement>>;
  groupBy<TKey, TElement>(
    keySelector: KeySelectorFn<TItem, TKey> | string,
    elementSelector?: MapFn<TItem, TElement>
  ): Sequence<Grouping<TKey, TElement>> {
    if (typeof keySelector === "string") {
      keySelector = createSelectByKey<TItem>(keySelector);
    }

    return new Sequence(
      createGroupByIterable(this._iterable, keySelector, elementSelector)
    );
  }

  /**
   * Determines whether the sequence includes the given element,
   * returning true or false as appropriate. The check is done
   * using '==='.
   *
   * @example
   * ```typescript
   * // Returns true
   * from([1, 2, 3]).includes(3);
   * ```
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
   *
   * @example
   * ```typescript
   * // Returns true
   * from([]).isEmpty();
   * ```
   */
  isEmpty(): boolean {
    return !this.some(() => true);
  }

  /**
   * Returns the first element of the sequence or undefined if
   * the sequence is empty.
   *
   * @example
   * ```typescript
   * // Returns 5
   * from([1, 3, 5]).last();
   * ```
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
   * ```typescript
   * // Returns [2, 4, 6]
   * from([1, 2, 3]).map(x => x * 2);
   * ```
   */
  map<TResultItem>(mapFn: MapFn<TItem, TResultItem>): Sequence<TResultItem> {
    return new Sequence(createMapIterable(this._iterable, mapFn));
  }

  /**
   * Maps each item in the sequence to an object composed of the picked
   * object properties.
   *
   * @example
   * ```typescript
   * const users = [
   * { id: 1, name: "John", age: 31, active: true },
   * { id: 2, name: "Jane", age: 32, active: false },
   * { id: 3, name: "Luke", age: 33, active: false },
   * { id: 4, name: "Mary", age: 34, active: true },
   * ];
   *
   * // Returns a Sequence of { name: 'John' }, { name: 'Jane' }, { name: 'Luke' }, { name: 'Mary' }
   * from(users).pick("name");
   * ```
   */
  pick<TKeys extends keyof TItem>(
    ...keys: TKeys[]
  ): Sequence<{ [P in TKeys]: TItem[P] }> {
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
   *
   * @example
   * ```typescript
   * // Returns a 15
   * from([1, 2, 3, 4, 5]).reduce((x, acc) => acc+x, 0)
   * ```
   */
  reduce<TResult>(
    callback: ReduceCallbackFn<TResult, TItem>,
    accumulator: TResult
  ): TResult {
    for (const item of this._iterable) {
      accumulator = callback(accumulator, item);
    }

    return accumulator;
  }

  /**
   * Reverses the order of the items in the sequence
   *
   * @example
   * ```typescript
   * // Returns [3, 2, 1]
   * from([1, 2, 3]).reverse().toArray();
   * ```
   */
  reverse(): Sequence<TItem> {
    return new Sequence(createReverseIterable(this._iterable));
  }

  /**
   * Skips the first N items in the sequence
   *
   * @example
   * ```typescript
   * // Returns [3, 4]
   * from([1, 2, 3, 4]).skip(2);
   * ```
   */
  skip(howMany: number): Sequence<TItem> {
    return new Sequence(createSkipIterable(this._iterable, howMany));
  }

  /**
   * Bypasses elements in a sequence as long as a specified condition is true
   * and then returns the remaining elements.
   *
   * @param predicate  A function to test each element for a condition.
   *
   * @example
   * ```ts
   * // Returns [3, 4, 5]
   * from([1, 2, 3, 4, 5])
   *   .skipWhile(i => i < 3)
   *   .toArray();
   * ```
   */
  skipWhile(predicate: PredicateFn<TItem>): Sequence<TItem> {
    return new Sequence(createSkipWhileIterable(this._iterable, predicate));
  }

  /**
   * Returns true if sequence contains an element for which the given
   * predicate returns a truthy value.
   *
   * @example
   * ```typescript
   * // Returns true
   * from([1, 2, 3]).some(x => x === 1)
   * ```
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
  sortBy(): OrderedSequence<TItem, TItem>;
  sortBy<TKey>(
    keySelector: KeySelectorFn<TItem, TKey>,
    comparer?: ComparerFn<TKey>
  ): OrderedSequence<TItem, TKey>;
  sortBy<TKey>(
    keySelector?: KeySelectorFn<TItem, TKey>,
    comparer?: ComparerFn<TKey>
  ): OrderedSequence<TItem, TKey> {
    const compareFn = createCompareFn(false, keySelector, comparer);

    return new OrderedSequence(
      createSortByIterable(this._iterable, compareFn),
      compareFn
    );
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
  ): OrderedSequence<TItem, TKey> {
    const compareFn = createCompareFn(true, keySelector, comparer);

    return new OrderedSequence(
      createSortByIterable(this._iterable, compareFn),
      compareFn
    );
  }

  /**
   * Sums the elements in the sequence.
   * NOTE! If the sequence is empty, 0 is returned.
   *
   * @example
   * ```typescript
   * // Returns 6
   * from([1, 2, 3]).sum();
   * ```
   */
  sum<TItem extends number>(): number;
  /**
   * Sums the elements in the sequence
   * NOTE! If the sequence is empty, 0 is returned.
   *
   * @example
   * ```typescript
   * // Returns "abc"
   * from(["a", "b", "c"]).sum();
   * ```
   */
  sum<TItem extends string>(): string;
  /**
   * Maps the elements in the sequence using the valueSelector and sums them
   * together.
   * NOTE! If the sequence is empty, 0 is returned.
   *
   * @param valueSelector  A function to select a value from an element.
   *
   * @example
   * ```typescript
   * // Returns 2
   * from([true, false, true]).sum(x => x ? 1 : 0);
   * ```
   */
  sum<TResult extends number>(valueSelector: MapFn<TItem, TResult>): number;
  /**
   * Maps the elements in the sequence using the valueSelector and sums them
   * together.
   * NOTE! If the sequence is empty, 0 is returned.
   *
   * @param valueSelector  A function to select a value from an element.
   *
   * @example
   * ```typescript
   * // Returns "101"
   * from([true, false, true]).sum(x => x ? "1" : "0");
   * ```
   */
  sum<TResult extends string>(valueSelector: MapFn<TItem, TResult>): string;
  sum<TResult>(valueSelector?: MapFn<TItem, TResult>): number | string {
    let result: any | undefined = undefined;

    for (const item of this._iterable) {
      let itemToSum = valueSelector ? valueSelector(item) : item;

      if (result === undefined) {
        result = itemToSum as any;
      } else {
        result +=
          typeof (itemToSum as unknown) === "number"
            ? itemToSum
            : String(itemToSum);
      }
    }

    return result === undefined ? 0 : result;
  }

  /**
   * Takes the firt N items from the sequence
   *
   * @example
   * ```typescript
   * // Returns [1, 2]
   * from([1, 2, 3, 4]).take(2);
   * ```
   */
  take(howMany: number): Sequence<TItem> {
    return new Sequence(createTakeIterable(this._iterable, howMany));
  }

  /**
   * Returns elements from a sequence as long as a specified condition is true,
   * and then skips the remaining elements.
   *
   * @param predicate  A function to test each element for a condition.
   *
   * @example
   * ```ts
   * // Returns [1, 2]
   * from([1, 2, 3, 4, 5])
   *   .takeWhile(i => i < 3)
   *   .toArray();
   * ```
   */
  takeWhile(predicate: PredicateFn<TItem>) {
    return new Sequence(createTakeWhileIterable(this._iterable, predicate));
  }

  /**
   * Returns elements from a sequence as long as they don't exist in the specified iterable items.
   *
   * @param items     The provided set of items that should not be in the returned Sequence.
   * @param predicate The optional predicate that determines if two TItem items are equal.
   *
   * @example
   * ```ts
   * // returns [2, 4, 6]
   * from([1, 2, 3, 4, 5, 6])
   *   .without([1, 3, 5])
   *   .toArray();
   *
   * // returns [{ id: 1 }, { id: 3 }]
   * from([{ id: 1 }, { id: 2 }, { id: 3 }])
   *   .without([{ id: 2 }], (a, b) => a.id === b.id)
   *   .toArray();
   * ```
   */
  without(
    items: Iterable<TItem>,
    predicate?: ComparePredicate<TItem>
  ): Sequence<TItem> {
    return new Sequence(
      createWithoutIterable(this._iterable, items, predicate)
    );
  }

  /**
   * This method yields the elements from the provided items first, followed by the items in the
   * underlying sequence.
   *
   * @param items The provided set of items that should be in the prepended to the Sequence.
   *
   * @example
   * ```ts
   * // returns [4, 5, 6, 1, 2, 3]
   * from([1, 2, 3])
   *   .prepend([4, 5, 6])
   *   .toArray();
   * ```
   */
  prepend(...items: Iterable<TItem>[]): Sequence<TItem> {
    return new Sequence(createPrependIterable(this._iterable, ...items));
  }

  /**
   * Converts the sequence to an array
   *
   * @example
   * ```typescript
   * // Return [1, 2, 3]
   * from([1, 2, 3]).toArray();
   * ```
   */
  toArray(): TItem[] {
    return Array.from(this);
  }

  /**
   * Converts the sequence to a Map using the given keySelectorFn and
   * possible elementSelectorFn.
   *
   * @example
   * ```typescript
   * // Returns map with elements:
   * // 1 -> { id: 1, name: "John" }
   * // 2 -> { id: 2, name: "Jane"}
   * const users = [{ id: 1, name: "John" }, { id: 2, name: "Jane"}]
   * from(users).toMap(u => u.id);
   * ```
   *
   * @param keySelectorFn
   * @param elementSelectorFn
   */
  toMap<TKey, TElement = TItem>(
    keySelectorFn: MapFn<TItem, TKey>,
    elementSelectorFn?: MapFn<TItem, TElement>
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
   * ```typescript
   * // Returns an object:
   * // {
   * //   "John": { id: 1, name: "John" },
   * //   "Jane": { id: 2, name: "Jane"}
   * // }
   * const users = [{ id: 1, name: "John" }, { id: 2, name: "Jane"}]
   * from(users).toObject(u => u.name);
   * ```
   *
   * @param keySelectorFn
   * @param elementSelectorFn
   */
  toObject(keySelectorFn: MapFn<TItem, string>): StringKeyedObject<TItem>;
  toObject(keySelectorFn: MapFn<TItem, number>): NumberKeyedObject<TItem>;
  toObject<TElement>(
    keySelectorFn: MapFn<TItem, string>,
    elementSelectorFn: MapFn<TItem, TElement>
  ): StringKeyedObject<TItem>;
  toObject<TElement>(
    keySelectorFn: MapFn<TItem, number>,
    elementSelectorFn: MapFn<TItem, TElement>
  ): NumberKeyedObject<TItem>;
  toObject<TElement>(
    keySelectorFn: MapFn<TItem, string> | MapFn<TItem, number>,
    elementSelectorFn?: MapFn<TItem, TElement>
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
   * ```typescript
   * // Return a Set with elements 1, 2, 3
   * from([1, 1, 2, 3]).toSet();
   * ```
   */
  toSet(): Set<TItem> {
    return new Set(this);
  }
}

/**
 * Ordered sequence of elements
 */
export class OrderedSequence<TItem, TKey> extends Sequence<TItem> {
  private _comparer: ComparerFn<TItem>;

  constructor(iterable: Iterable<TItem>, comparer: ComparerFn<TItem>) {
    super(iterable);

    this._comparer = comparer;
  }

  thenBy<TOtherKey>(
    keySelector: KeySelectorFn<TItem, TOtherKey>,
    comparer?: ComparerFn<TOtherKey>
  ): OrderedSequence<TItem, TOtherKey> {
    const thenComparer = createCompareFn(false, keySelector, comparer);
    const compareFn = createChainedCompareFn(this._comparer, thenComparer);

    return new OrderedSequence(
      createSortByIterable(this._iterable, compareFn),
      compareFn
    );
  }

  thenByDescending<TOtherKey>(
    keySelector: KeySelectorFn<TItem, TOtherKey>,
    comparer?: ComparerFn<TOtherKey>
  ): OrderedSequence<TItem, TOtherKey> {
    const thenComparer = createCompareFn(true, keySelector, comparer);
    const compareFn = createChainedCompareFn(this._comparer, thenComparer);

    return new OrderedSequence(
      createSortByIterable(this._iterable, compareFn),
      compareFn
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
