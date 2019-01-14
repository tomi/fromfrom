import { from } from "./from";

export interface PredicateFn<TItem> {
  (item: TItem): boolean;
}

export interface SelectorFn<TItem, TResult> {
  (item: TItem): TResult;
}

const identityFn = (x: any): boolean => x;

export class Enumerable<T> implements Iterable<T>, Iterator<T> {
  private _iterator: Iterator<T> | undefined;
  protected _current: IteratorResult<T> | undefined;

  constructor(private _iterable: Iterable<T>) {}

  [Symbol.iterator](): Iterator<T> {
    this._iterator = undefined;

    return this;
  }

  next(): IteratorResult<T> {
    if (!this._iterator) {
      this._iterator = this._iterable[Symbol.iterator]();
    }

    return this._iterator.next();
  }

  /**
   * Returns a new sequence that contains the items in the current sequence
   * and items from the given iterable.
   *
   * @example
   * // Returns sequence with values 1, 2, 3, 4
   * from([1, 2]).concat([3, 4]);
   */
  concat<U>(other: Iterable<U>): Enumerable<T | U> {
    return from(this._concat(other));
  }

  private *_concat<U>(other: Iterable<U>): IterableIterator<T | U> {
    for (const item of this._iterable) {
      yield item;
    }

    for (const item of from(other)) {
      yield item;
    }
  }

  /**
   * Checks that all items in the sequence pass the test implemented by the
   * provided function.
   */
  every(predicate: PredicateFn<T> = identityFn): boolean {
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
  filter(predicate: PredicateFn<T>): Enumerable<T> {
    return from(this._filter(predicate));
  }

  private *_filter(predicate: PredicateFn<T>): IterableIterator<T> {
    for (const item of this._iterable) {
      if (predicate(item)) {
        yield item;
      }
    }
  }

  /**
   * Returns the value of the first element in the sequence that satisfies the
   * provided testing function. Otherwise undefined is returned.
   *
   * @example
   * // Returns 4
   * from([2, 4, 6]).find(x => x === 4);
   */
  find(predicate: PredicateFn<T>): T | undefined {
    for (const item of this._iterable) {
      if (predicate(item)) {
        return item;
      }
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
  flatMap<U>(mapperFn: SelectorFn<T, U[]>): Enumerable<U> {
    return from(this._flatMap(mapperFn));
  }

  private *_flatMap<U>(mapperFn: SelectorFn<T, U[]>): IterableIterator<U> {
    for (const item of this._iterable) {
      const sequence = from(mapperFn(item));

      for (const mappedItem of sequence) {
        yield mappedItem;
      }
    }
  }

  /**
   * Maps the sequence to a new sequence where each item is converted
   * to a new value using the given mapper function.
   *
   * @example
   * // Returns [2, 4, 6]
   * from([1, 2, 3]).map(x => x * 2);
   */
  map<TResult>(mapFn: SelectorFn<T, TResult>): Enumerable<TResult> {
    return from(this._map(mapFn));
  }

  private *_map<TResult>(
    mapFn: SelectorFn<T, TResult>
  ): IterableIterator<TResult> {
    for (const item of this._iterable) {
      yield mapFn(item);
    }
  }

  /**
   * Converts the sequence to an array
   *
   * @example
   * // Return [1, 2, 3]
   * from([1, 2, 3]).toArray();
   */
  toArray(): T[] {
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
  toMap<TKey, TElement = T>(
    keySelectorFn: SelectorFn<T, TKey>,
    elementSelectorFn?: SelectorFn<T, TElement>
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
   * Converts the sequence to a Set
   *
   * @example
   * // Return a Set with elements 1, 2, 3
   * from([1, 1, 2, 3]).toSet();
   */
  toSet(): Set<T> {
    return new Set(this);
  }
}
