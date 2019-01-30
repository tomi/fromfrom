import { NumberKeyedObject, StringKeyedObject } from "./types";

/**
 * Creates an iterable from object, that iterates the object
 * as key value pairs.
 */
export function createObjectIterable<T>(object: NumberKeyedObject<T>): Iterable<[number, T]>;
export function createObjectIterable<T>(object: StringKeyedObject<T>): Iterable<[string, T]>;
export function* createObjectIterable<T>(object: StringKeyedObject<T> | NumberKeyedObject<T>): any {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const value = (object as any)[key];

      yield [key, value] as any;
    }
  }
}
