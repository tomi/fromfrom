export interface Dictionary<T> {
  [index: string]: T;
}

/**
 * Creates an iterable from object, that iterates the object as key value
 * pairs.
 */
export class ObjectIterable<T> implements Iterable<[string, T]> {
  constructor(private _object: Dictionary<T>) {}

  [Symbol.iterator](): Iterator<[string, T]> {
    return this._getIterable();
  }

  private *_getIterable(): IterableIterator<[string, T]> {
    for (const key in this._object) {
      if (this._object.hasOwnProperty(key)) {
        const value = this._object[key];

        yield [key, value];
      }
    }
  }
}
