import { from } from "../src/seqenum";
import { Enumerable } from "../src/Enumerable";

/**
 * Tests for the library
 */
describe("seqenum", () => {
  describe("from", () => {
    it("returns an enumerable", () => {
      expect(from([])).toBeInstanceOf(Enumerable);
    });

    it("returns the same enumerable if called with enumerable", () => {
      const enumerable = from([]);

      expect(from(enumerable)).toBe(enumerable);
    });

    describe("object", () => {
      it("returns keys and values as pairs", () => {
        expect(
          from({
            a: 1,
            b: 2
          }).toArray()
        ).toEqual([["a", 1], ["b", 2]]);
      });

      it("skips symbol properties", () => {
        expect(
          from({
            a: 1,
            b: 2,
            [Symbol()]: 3
          }).toArray()
        ).toEqual([["a", 1], ["b", 2]]);
      });

      it("skips non-enumerable properties", () => {
        const obj = {
          a: 1,
          b: 2
        };

        Object.defineProperty(obj, "c", {
          value: 3,
          enumerable: false
        });

        expect(from(obj).toArray()).toEqual([["a", 1], ["b", 2]]);
      });
    });
  });

  describe("toArray", () => {
    it("returns an array", () => {
      expect(from([1, 2]).toArray()).toEqual([1, 2]);
    });

    it("returns a copy of initial array", () => {
      const array = [1, 2];

      expect(from([array]).toArray()).not.toBe(array);
    });

    it("can be called multiple times", () => {
      const enumerable = from([1, 2]);

      expect(enumerable.toArray()).toEqual([1, 2]);
      expect(enumerable.toArray()).toEqual([1, 2]);
    });
  });

  describe("toSet", () => {
    it("returns a Set", () => {
      expect(from([1, 2]).toSet()).toEqual(new Set([1, 2]));
    });
  });

  describe("toMap", () => {
    it("returns a Map", () => {
      expect(from([]).toMap(x => x)).toEqual(new Map());
    });

    it("returns a Map with keys mapped with key selector function", () => {
      expect(from([1, 2]).toMap(x => x * 2)).toEqual(new Map([[2, 1], [4, 2]]));
    });

    it("returns a Map with values mapped with key selector function", () => {
      expect(from([1, 2]).toMap(x => x * 2, y => y * 3)).toEqual(
        new Map([[2, 3], [4, 6]])
      );
    });
  });

  describe("filter", () => {
    let predicate: jest.Mock;

    beforeEach(() => (predicate = jest.fn()));

    it("calls filter for each item", () => {
      from([1, 2])
        .filter(predicate)
        .toArray();

      expect(predicate).toBeCalledTimes(2);
    });

    it("passes item as a parameter to filter", () => {
      from([1])
        .filter(predicate)
        .toArray();

      expect(predicate).lastCalledWith(1);
    });

    it("filters out items for which filter returns false", () => {
      expect(
        from([1, 2, 3, 4])
          .filter(x => x > 2)
          .toArray()
      ).toEqual([3, 4]);
    });
  });

  describe("map", () => {
    let mapper: jest.Mock;

    beforeEach(() => (mapper = jest.fn()));

    it("calls map for each item", () => {
      from([1, 2])
        .map(mapper)
        .toArray();

      expect(mapper).toBeCalledTimes(2);
    });

    it("passes item as a parameter to map", () => {
      from([1])
        .map(mapper)
        .toArray();

      expect(mapper).lastCalledWith(1);
    });

    it("maps out items for which map returns false", () => {
      expect(
        from([1, 2, 3, 4])
          .map(x => x * 2)
          .toArray()
      ).toEqual([2, 4, 6, 8]);
    });
  });

  describe("every", () => {
    let predicate: jest.Mock;

    beforeEach(() => (predicate = jest.fn(() => true)));

    it("calls every for each item", () => {
      from([1, 2]).every(predicate);

      expect(predicate).toBeCalledTimes(2);
    });

    it("passes item as a parameter to every", () => {
      from([1]).every(predicate);

      expect(predicate).lastCalledWith(1);
    });

    it("returns true when all pass the test", () => {
      expect(from([1, 2, 3, 4]).every(x => x > 0)).toEqual(true);
    });

    it("returns false if some don't pass the test", () => {
      expect(from([1, 2, 3, 4]).every(x => x < 4)).toEqual(false);
    });

    it("uses the item itself if predicate is not given", () => {
      expect(from([true, true]).every()).toEqual(true);
    });
  });

  describe("concat", () => {
    it("combines two arrays", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .toArray()
      ).toEqual([1, 2, 3, 4]);
    });
  });

  describe("find", () => {
    it("returns the found item", () => {
      expect(from([1, 2, 3, 4]).find(x => x === 3)).toEqual(3);
    });

    it("returns undefined when not found", () => {
      expect(from([1, 2, 3]).find(x => x === 100)).toEqual(undefined);
    });
  });

  describe("flatMap", () => {
    let mapper: jest.Mock;

    beforeEach(() => (mapper = jest.fn(x => [x])));

    it("calls mapper for each item", () => {
      from([1, 2])
        .flatMap(mapper)
        .toArray();

      expect(mapper).toBeCalledTimes(2);
    });

    it("passes item as a parameter to mapper", () => {
      from([1])
        .flatMap(mapper)
        .toArray();

      expect(mapper).lastCalledWith(1);
    });

    it("returns mapped values", () => {
      expect(
        from([1, 3])
          .flatMap(x => [x, x + 1])
          .toArray()
      ).toEqual([1, 2, 3, 4]);
    });
  });

  describe("forEach", () => {
    let callback: jest.Mock;

    beforeEach(() => (callback = jest.fn()));

    it("calls callback for each item", () => {
      from([1, 2]).forEach(callback);

      expect(callback).toBeCalledTimes(2);
    });

    it("passes item as a parameter to callback", () => {
      from([1]).forEach(callback);

      expect(callback).lastCalledWith(1);
    });
  });

  describe("includes", () => {
    it("returns true when sequence contains the item", () => {
      expect(from([1, 2, 3]).includes(2)).toEqual(true);
    });

    it("returns false when sequence does not contain the item", () => {
      expect(from([1, 2, 3]).includes(6)).toEqual(false);
    });
  });

  describe("reduce", () => {
    let callback: jest.Mock;

    beforeEach(() => (callback = jest.fn((prev, curr) => [...prev, curr])));

    it("calls callback for each item", () => {
      from([1, 2]).reduce(callback, []);

      expect(callback).toBeCalledTimes(2);
    });

    it("passes item as a parameter to callback", () => {
      const initial: number[] = [];
      from([1]).reduce(callback, initial);

      expect(callback).lastCalledWith(initial, 1);
    });

    it("returns reduced value", () => {
      expect(from([1, 2, 3]).reduce((prev, curr) => prev + curr, 0)).toEqual(6);
    });
  });

  describe("reverse", () => {
    it("reverses the sequence", () => {
      expect(
        from([1, 2, 3])
          .reverse()
          .toArray()
      ).toEqual([3, 2, 1]);
    });
  });

  describe("skip", () => {
    it("skips the requested amount of items", () => {
      expect(
        from([1, 2, 3, 4, 5])
          .skip(2)
          .toArray()
      ).toEqual([3, 4, 5]);
    });

    it("skips all the items", () => {
      expect(
        from([1, 2, 3, 4, 5])
          .skip(10)
          .toArray()
      ).toEqual([]);
    });
  });

  describe("take", () => {
    it("takes the requested amount of items", () => {
      expect(
        from([1, 2, 3, 4, 5])
          .take(2)
          .toArray()
      ).toEqual([1, 2]);
    });

    it("takes all the items", () => {
      expect(
        from([1, 2, 3, 4, 5])
          .take(10)
          .toArray()
      ).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
