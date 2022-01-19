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
  Sequence,
  OrderedSequence,
} from "./types";
import { concat } from "./transforms/concat";
import { distinct } from "./transforms/distinct";
import { filter } from "./transforms/filter";
import { flatMap } from "./transforms/flatMap";
import { groupBy } from "./transforms/groupBy";
import { map } from "./transforms/map";
import { prepend } from "./transforms/prepend";
import { reverse } from "./transforms/reverse";
import { skip } from "./transforms/skip";
import { skipWhile } from "./transforms/skipWhile";
import { sortBy } from "./transforms/sortBy";
import { take } from "./transforms/take";
import { takeWhile } from "./transforms/takeWhile";
import { without } from "./transforms/without";
import { copyIntoAnArray, iterableFromGenerator } from "./utils";

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

/**
 * A sequence of items
 */
export class SequenceImpl<TItem> implements Iterable<TItem>, Sequence<TItem> {
  constructor(protected _iterable: Iterable<TItem>) {}

  [Symbol.iterator] = (): Iterator<TItem> => this._iterable[Symbol.iterator]();

  concat<TOther>(...others: Iterable<TOther>[]): Sequence<TItem | TOther> {
    return this._sequenceFromGenerator<TItem | TOther>(concat, others);
  }

  distinct(): Sequence<TItem> {
    return this._sequenceFromGenerator<TItem>(distinct);
  }

  every(predicate: PredicateFn<TItem> = identityPredicateFn): boolean {
    for (const item of this._iterable) {
      if (!predicate(item)) {
        return false;
      }
    }

    return true;
  }

  filter(predicate: PredicateFn<TItem>): Sequence<TItem> {
    return this._sequenceFromGenerator<TItem>(filter, [predicate]);
  }

  find(predicate: PredicateFn<TItem>): TItem | undefined {
    for (const item of this._iterable) {
      if (predicate(item)) {
        return item;
      }
    }

    return undefined;
  }

  first(): TItem | undefined {
    for (const item of this._iterable) {
      return item;
    }

    return undefined;
  }

  flatMap<TResultItem>(
    mapperFn: MapFn<TItem, TResultItem[]>
  ): Sequence<TResultItem> {
    return this._sequenceFromGenerator<TResultItem>(flatMap, [mapperFn]);
  }

  forEach(callback: CallbackFn<TItem>): void {
    for (const item of this._iterable) {
      callback(item);
    }
  }

  groupBy<TKey extends keyof TItem>(
    key: TKey
  ): Sequence<Grouping<TItem[TKey], TItem>>;
  groupBy<TKey>(
    keySelector: KeySelectorFn<TItem, TKey>
  ): Sequence<Grouping<TKey, TItem>>;
  groupBy<TKey extends keyof TItem, TElement>(
    key: TKey,
    elementSelector: MapFn<TItem, TElement>
  ): Sequence<Grouping<TItem[TKey], TItem>>;
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

    return this._sequenceFromGenerator<Grouping<TKey, TElement>>(groupBy, [
      keySelector,
      elementSelector,
    ]);
  }

  includes(searchItem: TItem): boolean {
    for (const item of this._iterable) {
      if (item === searchItem) {
        return true;
      }
    }

    return false;
  }

  isEmpty(): boolean {
    return !this.some(() => true);
  }

  last(): TItem | undefined {
    const items = this.toArray();

    return items.length === 0 ? undefined : items[items.length - 1];
  }

  max<TItem>(): TItem | undefined {
    let result: any | undefined = undefined;

    for (const item of this._iterable) {
      if (result === undefined) {
        result = item as any;
      } else if (item > result) {
        result = item;
      }
    }

    return result;
  }

  map<TResultItem>(mapFn: MapFn<TItem, TResultItem>): Sequence<TResultItem> {
    return this._sequenceFromGenerator<TResultItem>(map, [mapFn]);
  }

  min<TItem>(): TItem | undefined {
    let result: any | undefined = undefined;

    for (const item of this._iterable) {
      if (result === undefined) {
        result = item as any;
      } else if (item < result) {
        result = item;
      }
    }

    return result;
  }

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

  prepend(...items: Iterable<TItem>[]): Sequence<TItem> {
    return this._sequenceFromGenerator<TItem>(prepend, items);
  }

  reduce<TResult>(
    callback: ReduceCallbackFn<TResult, TItem>,
    accumulator: TResult
  ): TResult {
    for (const item of this._iterable) {
      accumulator = callback(accumulator, item);
    }

    return accumulator;
  }

  reverse(): Sequence<TItem> {
    return this._sequenceFromGenerator<TItem>(reverse);
  }

  skip(howMany: number): Sequence<TItem> {
    return this._sequenceFromGenerator<TItem>(skip, [howMany]);
  }

  skipWhile(predicate: PredicateFn<TItem>): Sequence<TItem> {
    return this._sequenceFromGenerator<TItem>(skipWhile, [predicate]);
  }

  some(predicate: PredicateFn<TItem> = identityPredicateFn): boolean {
    for (const item of this._iterable) {
      if (predicate(item)) {
        return true;
      }
    }
    return false;
  }

  sortBy(): OrderedSequence<TItem>;
  sortBy<TKey>(
    keySelector: KeySelectorFn<TItem, TKey>,
    comparer?: ComparerFn<TKey>
  ): OrderedSequence<TItem>;
  sortBy<TKey>(
    keySelector?: KeySelectorFn<TItem, TKey>,
    comparer?: ComparerFn<TKey>
  ): OrderedSequence<TItem> {
    const compareFn = createCompareFn(false, keySelector, comparer);

    return new OrderedSequenceImpl(this._iterable, compareFn);
  }

  sortByDescending<TKey = TItem>(
    keySelector?: KeySelectorFn<TItem, TKey>,
    comparer?: ComparerFn<TKey>
  ): OrderedSequence<TItem> {
    const compareFn = createCompareFn(true, keySelector, comparer);

    return new OrderedSequenceImpl(this._iterable, compareFn);
  }

  sum<TItem extends number>(): number;
  sum<TItem extends string>(): string;
  sum<TResult extends number>(valueSelector: MapFn<TItem, TResult>): number;
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

  take(howMany: number): Sequence<TItem> {
    return this._sequenceFromGenerator<TItem>(take, [howMany]);
  }

  takeWhile(predicate: PredicateFn<TItem>) {
    return this._sequenceFromGenerator<TItem>(takeWhile, [predicate]);
  }

  without(
    items: Iterable<TItem>,
    predicate?: ComparePredicate<TItem>
  ): Sequence<TItem> {
    if (!predicate) {
      const withoutSet = new Set(items);
      return this.filter((item: TItem) => !withoutSet.has(item));
    } else {
      return this._sequenceFromGenerator<TItem>(without, [items, predicate]);
    }
  }

  toArray(): TItem[] {
    return copyIntoAnArray(this._iterable);
  }

  toMap<TKey, TElement = TItem>(
    keySelectorFn: MapFn<TItem, TKey>,
    elementSelectorFn?: MapFn<TItem, TElement>
  ): Map<TKey, TElement> {
    const map = new Map<TKey, TElement>();

    for (const item of this._iterable) {
      const key = keySelectorFn(item);
      const value = elementSelectorFn ? elementSelectorFn(item) : item;

      map.set(key, value as TElement);
    }

    return map;
  }

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
  toObject<TElement>(
    keySelectorFn: MapFn<TItem, string> | MapFn<TItem, number>,
    elementSelectorFn?: MapFn<TItem, TElement>
  ):
    | StringKeyedObject<TItem>
    | NumberKeyedObject<TItem>
    | StringKeyedObject<TElement>
    | NumberKeyedObject<TElement> {
    const object: any = {};

    for (const item of this._iterable) {
      const key = keySelectorFn(item);
      const value = elementSelectorFn ? elementSelectorFn(item) : item;

      object[key] = value;
    }

    return object;
  }

  toSet(): Set<TItem> {
    return new Set(this._iterable);
  }

  toString(separator: string = ","): string {
    return Array.isArray(this._iterable)
      ? this._iterable.join(separator)
      : copyIntoAnArray(this._iterable).join(separator);
  }

  private _sequenceFromGenerator<TResult = TItem>(
    factoryFn: Function,
    restArgs?: any[]
  ) {
    const iterableArg = [this._iterable];

    return new SequenceImpl<TResult>(
      iterableFromGenerator<TResult>(
        factoryFn,
        restArgs ? iterableArg.concat(restArgs) : iterableArg
      )
    );
  }
}

/**
 * Ordered sequence of elements
 */
export class OrderedSequenceImpl<TItem> extends SequenceImpl<TItem>
  implements OrderedSequence<TItem> {
  private _comparer: ComparerFn<TItem>;

  constructor(
    private _iterableToSort: Iterable<TItem>,
    comparer: ComparerFn<TItem>
  ) {
    super(iterableFromGenerator(sortBy, [_iterableToSort, comparer]));

    this._comparer = comparer;
  }

  thenBy<TOtherKey>(
    keySelector: KeySelectorFn<TItem, TOtherKey>,
    comparer?: ComparerFn<TOtherKey>
  ): OrderedSequence<TItem> {
    const thenComparer = createCompareFn(false, keySelector, comparer);
    const compareFn = createChainedCompareFn(this._comparer, thenComparer);

    return new OrderedSequenceImpl(this._iterableToSort, compareFn);
  }

  thenByDescending<TOtherKey>(
    keySelector: KeySelectorFn<TItem, TOtherKey>,
    comparer?: ComparerFn<TOtherKey>
  ): OrderedSequence<TItem> {
    const thenComparer = createCompareFn(true, keySelector, comparer);
    const compareFn = createChainedCompareFn(this._comparer, thenComparer);

    return new OrderedSequenceImpl(this._iterableToSort, compareFn);
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
) => {
  const compareFn = comparer || defaultComparer;

  return keySelector
    ? (a: TItem, b: TItem) =>
        descending
          ? compareFn(keySelector(b), keySelector(a))
          : compareFn(keySelector(a), keySelector(b))
    : (a: TItem, b: TItem) =>
        descending ? defaultComparer(b, a) : defaultComparer(a, b);
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
