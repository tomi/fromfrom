export type MapFn<TItem, TResult> = (item: TItem) => TResult;

export type PredicateFn<TItem> = (item: TItem) => boolean;

export type CallbackFn<TItem> = (item: TItem) => void;

export type KeySelectorFn<TItem, TKey> = (item: TItem) => TKey;

export type ReduceCallbackFn<TPrevious, TCurrent> = (
  previousValue: TPrevious,
  currentValue: TCurrent
) => TPrevious;

export type ComparerFn<TItem> = (a: TItem, b: TItem) => number;

export type IteratorCreatorFn<TResult> = () => Iterator<TResult>;

export type ComparePredicate<TItem> = (a: TItem, b: TItem) => boolean;

export interface Grouping<TKey, TElement> {
  key: TKey;
  items: TElement[];
}

export interface StringKeyedObject<T> {
  [index: string]: T;
}

export interface NumberKeyedObject<T> {
  [index: number]: T;
}

/**
 * A sequence of items
 */
export interface Sequence<TItem> extends Iterable<TItem> {
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
  concat<TOther>(...others: Iterable<TOther>[]): Sequence<TItem | TOther>;
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
  distinct(): Sequence<TItem>;
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
  every(predicate?: PredicateFn<TItem>): boolean;
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
  filter(predicate: PredicateFn<TItem>): Sequence<TItem>;
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
  find(predicate: PredicateFn<TItem>): TItem | undefined;
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
  first(): TItem | undefined;
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
  ): Sequence<TResultItem>;
  /**
   * Calls the given callback function with each item in the sequence.
   *
   * @example
   * ```typescript
   * // Logs 1, 2 and 3 to console
   * from([1, 2, 3]).forEach(i => console.log(i));
   * ```
   */
  forEach(callback: CallbackFn<TItem>): void;
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
  includes(searchItem: TItem): boolean;
  /**
   * Returns true if the sequence is empty, false otherwise.
   *
   * @example
   * ```typescript
   * // Returns true
   * from([]).isEmpty();
   * ```
   */
  isEmpty(): boolean;
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
  last(): TItem | undefined;
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
  map<TResultItem>(mapFn: MapFn<TItem, TResultItem>): Sequence<TResultItem>;
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
  ): Sequence<{ [P in TKeys]: TItem[P] }>;
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
  prepend(...items: Iterable<TItem>[]): Sequence<TItem>;
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
  ): TResult;
  /**
   * Reverses the order of the items in the sequence
   *
   * @example
   * ```typescript
   * // Returns [3, 2, 1]
   * from([1, 2, 3]).reverse().toArray();
   * ```
   */
  reverse(): Sequence<TItem>;
  /**
   * Skips the first N items in the sequence
   *
   * @example
   * ```typescript
   * // Returns [3, 4]
   * from([1, 2, 3, 4]).skip(2);
   * ```
   */
  skip(howMany: number): Sequence<TItem>;
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
  skipWhile(predicate: PredicateFn<TItem>): Sequence<TItem>;
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
  some(predicate?: PredicateFn<TItem>): boolean;
  /**
   * Sorts the elements of a sequence in ascending order according to a key
   * by using a specified comparer.
   *
   * @param keySelector  A function to extract a key from an element.
   * @param comparer     A function to compare the keys
   */
  /**
   * @example
   * ```typescript
   * // Returns a Sequence of 1, 2, 3
   * from([1, 3, 2]).sortBy()
   * ```
   */
  sortBy(): OrderedSequence<TItem>;
  /**
   * @example
   * ```typescript
   * const users = [
   * { id: 2, name: "Jane" },
   * { id: 4, name: "Mary" },
   * { id: 1, name: "John" },
   * { id: 3, name: "Luke" },
   * ];
   *
   * // Returns a Sequence of
   * //  { id: 1, name: 'John' },
   * //  { id: 2, name: 'Jane' },
   * //  { id: 3, name: 'Luke' },
   * //  { id: 4, name: 'Mary' }
   * from(users).sortBy(user => user.id)
   * ```
   */
  sortBy<TKey>(
    keySelector: KeySelectorFn<TItem, TKey>,
    comparer?: ComparerFn<TKey>
  ): OrderedSequence<TItem>;
  /**
   * Sorts the elements of a sequence in descending order according to a key
   * by using a specified comparer.
   *
   * @param keySelector  A function to extract a key from an element.
   * @param comparer     A function to compare the keys
   *
   * @example
   * ```typescript
   * // Returns a Sequence of 3, 2, 1
   * from([1, 3, 2]).sortByDescending()
   * ```
   */
  sortByDescending<TKey = TItem>(
    keySelector?: KeySelectorFn<TItem, TKey>,
    comparer?: ComparerFn<TKey>
  ): OrderedSequence<TItem>;
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
  /**
   * Takes the firt N items from the sequence
   *
   * @example
   * ```typescript
   * // Returns [1, 2]
   * from([1, 2, 3, 4]).take(2);
   * ```
   */
  take(howMany: number): Sequence<TItem>;
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
  takeWhile(predicate: PredicateFn<TItem>): Sequence<TItem>;
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
  ): Sequence<TItem>;
  /**
   * Converts the sequence to an array
   *
   * @example
   * ```typescript
   * // Return [1, 2, 3]
   * from([1, 2, 3]).toArray();
   * ```
   */
  toArray(): TItem[];
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
  ): Map<TKey, TElement>;
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
  ): StringKeyedObject<TElement>;
  toObject<TElement>(
    keySelectorFn: MapFn<TItem, number>,
    elementSelectorFn: MapFn<TItem, TElement>
  ): NumberKeyedObject<TElement>;
  /**
   * Converts the sequence to a Set
   *
   * @example
   * ```typescript
   * // Return a Set with elements 1, 2, 3
   * from([1, 1, 2, 3]).toSet();
   * ```
   */
  toSet(): Set<TItem>;
  /**
   * Converts the sequence to a string using the given separator
   *
   * @param separator A string used to separate one element of a sequence from the next in the resulting String. If omitted, the elements are separated with a comma.
   *
   * @example
   * ```typescript
   * // Returns a string "1,2,3"
   * from([1, 2, 3]).toString();
   *
   * // Returns a string "1 - 2 - 3"
   * from([1, 2, 3]).toString(" - ");
   * ```
   */
  toString(separator?: string): string;
}

/**
 * Ordered sequence of elements
 */
export interface OrderedSequence<TItem> extends Sequence<TItem> {
  thenBy<TOtherKey>(
    keySelector: KeySelectorFn<TItem, TOtherKey>,
    comparer?: ComparerFn<TOtherKey>
  ): OrderedSequence<TItem>;
  thenByDescending<TOtherKey>(
    keySelector: KeySelectorFn<TItem, TOtherKey>,
    comparer?: ComparerFn<TOtherKey>
  ): OrderedSequence<TItem>;
}
