import { from } from "../src/fromfrom";

/**
 * Tests for the library
 */
describe("fromfrom", () => {
  describe("concat", () => {
    it("combines two arrays", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .toArray()
      ).toEqual([1, 2, 3, 4]);
    });

    it("can be iterated multiple times", () => {
      const enumerable = from([1, 2]).concat([3, 4]);

      expect(Array.from(enumerable)).toEqual([1, 2, 3, 4]);
      expect(Array.from(enumerable)).toEqual([1, 2, 3, 4]);
    });
  });

  describe("distinct", () => {
    it("returns unique values from the sequence", () => {
      expect(
        from([1, 1, 1, 1])
          .distinct()
          .toArray()
      ).toEqual([1]);
    });

    it("can be iterated multiple times", () => {
      const enumerable = from([1, 1, 1, 1]).distinct();

      expect(Array.from(enumerable)).toEqual([1]);
      expect(Array.from(enumerable)).toEqual([1]);
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

    it("can be iterated multiple times", () => {
      const enumerable = from([1, 2, 3, 4]).filter(x => x > 2);

      expect(Array.from(enumerable)).toEqual([3, 4]);
      expect(Array.from(enumerable)).toEqual([3, 4]);
    });
  });

  describe("from", () => {
    it("returns the same enumerable if called with enumerable", () => {
      const enumerable = from([]);

      expect(from(enumerable)).toBe(enumerable);
    });

    describe("object", () => {
      it("returns keys and values as pairs", () => {
        expect(
          from({
            a: 1,
            b: 2,
          }).toArray()
        ).toEqual([["a", 1], ["b", 2]]);
      });

      it("skips symbol properties", () => {
        expect(
          from({
            a: 1,
            b: 2,
            [Symbol()]: 3,
          }).toArray()
        ).toEqual([["a", 1], ["b", 2]]);
      });

      it("skips non-enumerable properties", () => {
        const obj = {
          a: 1,
          b: 2,
        };

        Object.defineProperty(obj, "c", {
          value: 3,
          enumerable: false,
        });

        expect(from(obj).toArray()).toEqual([["a", 1], ["b", 2]]);
      });
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

  describe("first", () => {
    it("returns the first element", () => {
      expect(from([1, 2, 3]).first()).toEqual(1);
    });

    it("returns undefined if sequence is empty", () => {
      expect(from([]).first()).toBeUndefined();
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

    it("can be iterated multiple times", () => {
      const enumerable = from([1, 3]).flatMap(x => [x, x + 1]);

      expect(Array.from(enumerable)).toEqual([1, 2, 3, 4]);
      expect(Array.from(enumerable)).toEqual([1, 2, 3, 4]);
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

  describe("groupBy", () => {
    const users = [
      { name: "John", gender: "M" },
      { name: "Mike", gender: "M" },
      { name: "Lisa", gender: "F" },
      { name: "Mary", gender: "F" },
    ];

    it("groups by the given key", () => {
      expect(
        from(users)
          .groupBy("gender")
          .toArray()
      ).toEqual([
        { key: "M", items: [users[0], users[1]] },
        { key: "F", items: [users[2], users[3]] },
      ]);
    });

    it("groups by the given key selector", () => {
      expect(
        from(users)
          .groupBy(u => u.gender)
          .toArray()
      ).toEqual([
        { key: "M", items: [users[0], users[1]] },
        { key: "F", items: [users[2], users[3]] },
      ]);
    });

    it("groups by the given key and element selector", () => {
      expect(
        from(users)
          .groupBy("gender", u => u.name)
          .toArray()
      ).toEqual([
        { key: "M", items: [users[0].name, users[1].name] },
        { key: "F", items: [users[2].name, users[3].name] },
      ]);
    });

    it("groups by the given key selector and element selector", () => {
      expect(
        from(users)
          .groupBy(u => u.gender, u => u.name)
          .toArray()
      ).toEqual([
        { key: "M", items: [users[0].name, users[1].name] },
        { key: "F", items: [users[2].name, users[3].name] },
      ]);
    });

    it("can be iterated multiple times", () => {
      const enumerable = from(users).groupBy(u => u.gender, u => u.name);

      expect(Array.from(enumerable)).toEqual([
        { key: "M", items: [users[0].name, users[1].name] },
        { key: "F", items: [users[2].name, users[3].name] },
      ]);
      expect(Array.from(enumerable)).toEqual([
        { key: "M", items: [users[0].name, users[1].name] },
        { key: "F", items: [users[2].name, users[3].name] },
      ]);
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

  describe("isEmpty", () => {
    it("returns true for empty sequence", () => {
      expect(from([]).isEmpty()).toEqual(true);
    });

    it("returns false for non-empty sequence", () => {
      expect(from([1]).isEmpty()).toEqual(false);
    });
  });

  describe("last", () => {
    it("returns the last element", () => {
      expect(from([1, 2, 3]).last()).toEqual(3);
    });

    it("returns undefined if sequence is empty", () => {
      expect(from([]).last()).toBeUndefined();
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

    it("can be iterated multiple times", () => {
      const enumerable = from([1, 2, 3, 4]).map(x => x * 2);

      expect(Array.from(enumerable)).toEqual([2, 4, 6, 8]);
      expect(Array.from(enumerable)).toEqual([2, 4, 6, 8]);
    });
  });

  describe("pick", () => {
    const user = Object.freeze({
      name: {
        first: "Bob",
        last: "Builder",
      },
      age: 20,
      email: "bob@thebuilder.com",
    });

    it("returns an empty object if no keys given", () => {
      expect(
        from([user])
          .pick()
          .first()
      ).toEqual({});
    });

    it("picks selected keys", () => {
      expect(
        from([user])
          .pick("age", "email")
          .first()
      ).toEqual({
        age: 20,
        email: "bob@thebuilder.com",
      });
    });

    it("ignores keys the item doesn't have", () => {
      expect(
        from([user])
          .pick("age", "email", "notexists" as any)
          .first()
      ).toEqual({
        age: 20,
        email: "bob@thebuilder.com",
      });
    });

    it("can be iterated multiple times", () => {
      const enumerable = from([user]).pick("age");

      expect(Array.from(enumerable)).toEqual([
        {
          age: 20,
        },
      ]);
      expect(Array.from(enumerable)).toEqual([
        {
          age: 20,
        },
      ]);
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

    it("can be iterated multiple times", () => {
      const enumerable = from([1, 2, 3]).reverse();

      expect(Array.from(enumerable)).toEqual([3, 2, 1]);
      expect(Array.from(enumerable)).toEqual([3, 2, 1]);
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

    it("can be iterated multiple times", () => {
      const enumerable = from([1, 2, 3, 4, 5]).skip(3);

      expect(Array.from(enumerable)).toEqual([4, 5]);
      expect(Array.from(enumerable)).toEqual([4, 5]);
    });
  });

  describe("some", () => {
    let predicate: jest.Mock;

    beforeEach(() => (predicate = jest.fn(() => true)));

    it("calls some for each item unless one returns true", () => {
      from([1, 2]).some(predicate);

      expect(predicate).toBeCalledTimes(1);
    });

    it("passes item as a parameter to some", () => {
      from([1]).some(predicate);

      expect(predicate).lastCalledWith(1);
    });

    it("returns true when one item passes the test", () => {
      expect(from([1, 2, 3, 4]).some(x => x > 0)).toEqual(true);
    });

    it("returns false if none don't pass the test", () => {
      expect(from([1, 2, 3, 4]).some(x => x > 4)).toEqual(false);
    });

    it("uses the item itself if predicate is not given", () => {
      expect(from([false, true]).some()).toEqual(true);
    });
  });

  describe("sortBy", () => {
    it("sorts the sequence without key selector or comparer", () => {
      expect(
        from([5, 2, 3, 1, 4, 1])
          .sortBy()
          .toArray()
      ).toEqual([1, 1, 2, 3, 4, 5]);
    });

    it("sorts the sequence with key selector", () => {
      const items = [
        { a: 5 },
        { a: 2 },
        { a: 1 },
        { a: 3 },
        { a: 1 },
        { a: 4 },
      ];

      expect(
        from(items)
          .sortBy(item => item.a)
          .toArray()
      ).toEqual([{ a: 1 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }]);
    });

    it("sorts the sequence with key selector and comparer", () => {
      const items = [
        { a: 5, b: 1 },
        { a: 2, b: 1 },
        { a: 3, b: 1 },
        { a: 1, b: 2 },
        { a: 4, b: 2 },
      ];

      expect(
        from(items)
          .sortBy(
            item => item,
            (first, second) =>
              // First by b desc, then by a desc
              first.b === second.b ? second.a - first.a : second.b - first.b
          )
          .toArray()
      ).toEqual([
        { a: 4, b: 2 },
        { a: 1, b: 2 },
        { a: 5, b: 1 },
        { a: 3, b: 1 },
        { a: 2, b: 1 },
      ]);
    });

    it("returns correct values when chained", () => {
      expect(
        from([4, 2, 1, 5, 6, 8])
          .sortBy()
          .take(4)
          .toArray()
      ).toEqual([1, 2, 4, 5]);
    });

    it("can be iterated multiple times", () => {
      const enumerable = from([5, 2, 3, 1, 4, 1]).sortBy();

      expect(Array.from(enumerable)).toEqual([1, 1, 2, 3, 4, 5]);
      expect(Array.from(enumerable)).toEqual([1, 1, 2, 3, 4, 5]);
    });
  });

  describe("sortByDescending", () => {
    it("sorts the sequence without key selector or comparer", () => {
      expect(
        from([5, 2, 3, 1, 4, 1])
          .sortByDescending()
          .toArray()
      ).toEqual([5, 4, 3, 2, 1, 1]);
    });

    it("sorts the sequence with key selector", () => {
      const items = [
        { a: 5 },
        { a: 2 },
        { a: 1 },
        { a: 3 },
        { a: 1 },
        { a: 4 },
      ];

      expect(
        from(items)
          .sortByDescending(item => item.a)
          .toArray()
      ).toEqual([{ a: 5 }, { a: 4 }, { a: 3 }, { a: 2 }, { a: 1 }, { a: 1 }]);
    });

    it("sorts the sequence with key selector and comparer", () => {
      const items = [
        { a: 5, b: 1 },
        { a: 2, b: 1 },
        { a: 3, b: 1 },
        { a: 1, b: 2 },
        { a: 4, b: 2 },
      ];

      expect(
        from(items)
          .sortByDescending(
            item => item,
            (first, second) =>
              // First by b desc, then by a desc
              first.b === second.b ? second.a - first.a : second.b - first.b
          )
          .toArray()
      ).toEqual([
        { a: 2, b: 1 },
        { a: 3, b: 1 },
        { a: 5, b: 1 },
        { a: 1, b: 2 },
        { a: 4, b: 2 },
      ]);
    });

    it("can be iterated multiple times", () => {
      const enumerable = from([5, 2, 3, 1, 4, 1]).sortByDescending();

      expect(Array.from(enumerable)).toEqual([5, 4, 3, 2, 1, 1]);
      expect(Array.from(enumerable)).toEqual([5, 4, 3, 2, 1, 1]);
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

    it("can be iterated multiple times", () => {
      const enumerable = from([1, 2, 3, 4, 5]).take(2);

      expect(Array.from(enumerable)).toEqual([1, 2]);
      expect(Array.from(enumerable)).toEqual([1, 2]);
    });

    it("pulls only taken amount of items", () => {
      let numTaken = 0;
      const source = function*() {
        numTaken++;
        yield 1;
        numTaken++;
        yield 2;
      };

      from(source())
        .take(1)
        .toArray();
      expect(numTaken).toEqual(1);
    });
  });

  describe("thenBy", () => {
    it("sorts equal items using the thenBy comparer", () => {
      const items = [
        { name: "John", age: 20 },
        { name: "Tony", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Jane", age: 20 },
        { name: "Lisa", age: 30 },
      ];

      expect(
        from(items)
          .sortBy(item => item.age)
          .thenBy(item => item.name)
          .toArray()
      ).toEqual([
        { name: "Jane", age: 20 },
        { name: "John", age: 20 },
        { name: "Lisa", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Tony", age: 30 },
      ]);
    });

    it("works with multiple thenBys", () => {
      const items = [
        { name: "John", age: 20, sex: "male" },
        { name: "Jane", age: 20, sex: "female" },
        { name: "Tony", age: 30, sex: "male" },
        { name: "Mark", age: 30, sex: "male" },
        { name: "Lisa", age: 30, sex: "female" },
      ];

      expect(
        from(items)
          .sortBy(item => item.sex)
          .thenBy(item => item.age)
          .thenBy(item => item.name)
          .toArray()
      ).toEqual([
        { name: "Jane", age: 20, sex: "female" },
        { name: "Lisa", age: 30, sex: "female" },
        { name: "John", age: 20, sex: "male" },
        { name: "Mark", age: 30, sex: "male" },
        { name: "Tony", age: 30, sex: "male" },
      ]);
    });

    it("can be iterated multiple times", () => {
      const items = [
        { name: "John", age: 20 },
        { name: "Tony", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Jane", age: 20 },
        { name: "Lisa", age: 30 },
      ];

      const enumerable = from(items)
        .sortBy(item => item.age)
        .thenBy(item => item.name);

      expect(Array.from(enumerable)).toEqual([
        { name: "Jane", age: 20 },
        { name: "John", age: 20 },
        { name: "Lisa", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Tony", age: 30 },
      ]);
      expect(Array.from(enumerable)).toEqual([
        { name: "Jane", age: 20 },
        { name: "John", age: 20 },
        { name: "Lisa", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Tony", age: 30 },
      ]);
    });
  });

  describe("thenByDescending", () => {
    it("sorts equal items using the thenByDescending comparer", () => {
      const items = [
        { name: "John", age: 20 },
        { name: "Tony", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Jane", age: 20 },
        { name: "Lisa", age: 30 },
      ];

      expect(
        from(items)
          .sortBy(item => item.age)
          .thenByDescending(item => item.name)
          .toArray()
      ).toEqual([
        { name: "John", age: 20 },
        { name: "Jane", age: 20 },
        { name: "Tony", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Lisa", age: 30 },
      ]);
    });

    it("works with multiple thenByDescending", () => {
      const items = [
        { name: "John", age: 20, sex: "male" },
        { name: "Jane", age: 20, sex: "female" },
        { name: "Tony", age: 30, sex: "male" },
        { name: "Mark", age: 30, sex: "male" },
        { name: "Lisa", age: 30, sex: "female" },
      ];

      expect(
        from(items)
          .sortBy(item => item.sex)
          .thenByDescending(item => item.age)
          .thenByDescending(item => item.name)
          .toArray()
      ).toEqual([
        { name: "Lisa", age: 30, sex: "female" },
        { name: "Jane", age: 20, sex: "female" },
        { name: "Tony", age: 30, sex: "male" },
        { name: "Mark", age: 30, sex: "male" },
        { name: "John", age: 20, sex: "male" },
      ]);
    });

    it("can be iterated multiple times", () => {
      const items = [
        { name: "John", age: 20 },
        { name: "Tony", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Jane", age: 20 },
        { name: "Lisa", age: 30 },
      ];

      const enumerable = from(items)
        .sortBy(item => item.age)
        .thenByDescending(item => item.name);

      expect(Array.from(enumerable)).toEqual([
        { name: "John", age: 20 },
        { name: "Jane", age: 20 },
        { name: "Tony", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Lisa", age: 30 },
      ]);
      expect(Array.from(enumerable)).toEqual([
        { name: "John", age: 20 },
        { name: "Jane", age: 20 },
        { name: "Tony", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Lisa", age: 30 },
      ]);
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

  describe("toObject", () => {
    it("returns an object", () => {
      expect(from([]).toObject(x => x)).toEqual({});
    });

    it("returns an object with keys mapped with key selector function", () => {
      expect(from([1, 2]).toObject(x => x * 2)).toEqual({ 2: 1, 4: 2 });
    });

    it("returns an object with values mapped with key selector function", () => {
      expect(from([1, 2]).toObject(x => x * 2, y => y * 3)).toEqual({
        2: 3,
        4: 6,
      });
    });
  });

  describe("toSet", () => {
    it("returns a Set", () => {
      expect(from([1, 2]).toSet()).toEqual(new Set([1, 2]));
    });
  });
});
