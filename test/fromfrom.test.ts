import { from } from "../src/fromfrom";
import { copyIntoAnArray } from "../src/utils";

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
      const sequence = from([1, 2]).concat([3, 4]);

      expect(copyIntoAnArray(sequence)).toEqual([1, 2, 3, 4]);
      expect(copyIntoAnArray(sequence)).toEqual([1, 2, 3, 4]);
    });

    it("can be at the end of chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .concat([5, 6])
          .toArray()
      ).toEqual([1, 2, 3, 4, 5, 6]);
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
      const sequence = from([1, 1, 1, 1]).distinct();

      expect(copyIntoAnArray(sequence)).toEqual([1]);
      expect(copyIntoAnArray(sequence)).toEqual([1]);
    });

    it("can be at the end of chain", () => {
      expect(
        from([1, 1, 1])
          .concat([2])
          .distinct()
          .toArray()
      ).toEqual([1, 2]);
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

    it("can be at the end of chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .every(x => x < 3)
      ).toBe(false);
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
      const sequence = from([1, 2, 3, 4]).filter(x => x > 2);

      expect(copyIntoAnArray(sequence)).toEqual([3, 4]);
      expect(copyIntoAnArray(sequence)).toEqual([3, 4]);
    });

    it("can be at the end of the chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .filter(x => x % 2 === 0)
          .toArray()
      ).toEqual([2, 4]);
    });
  });

  describe("from", () => {
    it("returns the same sequence if called with sequence", () => {
      const sequence = from([]);

      expect(from(sequence)).toBe(sequence);
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

      it("skips non-sequence properties", () => {
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

      it("can be iterated multiple times", () => {
        const sequence = from({ a: 1, b: 2 });

        expect(sequence.toArray()).toEqual([["a", 1], ["b", 2]]);
        expect(sequence.toArray()).toEqual([["a", 1], ["b", 2]]);
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
      const sequence = from([1, 3]).flatMap(x => [x, x + 1]);

      expect(copyIntoAnArray(sequence)).toEqual([1, 2, 3, 4]);
      expect(copyIntoAnArray(sequence)).toEqual([1, 2, 3, 4]);
    });

    it("can be at the end of a chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .flatMap(x => [x, x + 10])
          .toArray()
      ).toEqual([1, 11, 2, 12, 3, 13, 4, 14]);
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

    it("groups all as undefined when given non-existing key selector", () => {
      expect(
        from(users)
          // @ts-ignore
          .groupBy("non-existing")
          .toArray()
      ).toEqual([{ key: undefined, items: users }]);
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
      const sequence = from(users).groupBy(u => u.gender, u => u.name);

      expect(copyIntoAnArray(sequence)).toEqual([
        { key: "M", items: [users[0].name, users[1].name] },
        { key: "F", items: [users[2].name, users[3].name] },
      ]);
      expect(copyIntoAnArray(sequence)).toEqual([
        { key: "M", items: [users[0].name, users[1].name] },
        { key: "F", items: [users[2].name, users[3].name] },
      ]);
    });

    it("can be at the end of chain", () => {
      expect(
        from([users[0], users[2]])
          .concat([users[1], users[3]])
          .groupBy(x => x.gender)
          .toArray()
      ).toEqual([
        { key: "M", items: [users[0], users[1]] },
        { key: "F", items: [users[2], users[3]] },
      ]);
    });

    it("groups by an object when an object is given as key", () => {
      const people = [
        { name: "John", gender: "M", country: "fi" },
        { name: "Mike", gender: "M", country: "fi" },
        { name: "Lisa", gender: "F", country: "fi" },
        { name: "Mary", gender: "F", country: "se" },
      ];

      const result = from(people)
        .groupBy(p => ({ g: p.gender, c: p.country }))
        .toArray();

      expect(result).toEqual([
        {
          key: { g: "M", c: "fi" },
          items: [
            { name: "John", gender: "M", country: "fi" },
            { name: "Mike", gender: "M", country: "fi" },
          ],
        },
        {
          key: { g: "F", c: "fi" },
          items: [{ name: "Lisa", gender: "F", country: "fi" }],
        },
        {
          key: { g: "F", c: "se" },
          items: [{ name: "Mary", gender: "F", country: "se" }],
        },
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

    it("can be at the end of a sequence", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .includes(3)
      ).toBe(true);
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
      const sequence = from([1, 2, 3, 4]).map(x => x * 2);

      expect(copyIntoAnArray(sequence)).toEqual([2, 4, 6, 8]);
      expect(copyIntoAnArray(sequence)).toEqual([2, 4, 6, 8]);
    });

    it("can be at the end of a sequence", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .map(x => x * 2)
          .toArray()
      ).toEqual([2, 4, 6, 8]);
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
      const sequence = from([user]).pick("age");

      expect(copyIntoAnArray(sequence)).toEqual([
        {
          age: 20,
        },
      ]);
      expect(copyIntoAnArray(sequence)).toEqual([
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

    it("can be at the end of chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .reduce((x, y) => x + y, 0)
      ).toBe(10);
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
      const sequence = from([1, 2, 3]).reverse();

      expect(copyIntoAnArray(sequence)).toEqual([3, 2, 1]);
      expect(copyIntoAnArray(sequence)).toEqual([3, 2, 1]);
    });

    it("can be at the end of a chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .reverse()
          .toArray()
      ).toEqual([4, 3, 2, 1]);
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
      const sequence = from([1, 2, 3, 4, 5]).skip(3);

      expect(copyIntoAnArray(sequence)).toEqual([4, 5]);
      expect(copyIntoAnArray(sequence)).toEqual([4, 5]);
    });

    it("can be at the end of a chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .skip(2)
          .toArray()
      ).toEqual([3, 4]);
    });
  });

  describe("skipWhile", () => {
    it("skips items for which predicate returns true", () => {
      expect(
        from([1, 2, 3, 4, 5])
          .skipWhile(i => i < 3)
          .toArray()
      ).toEqual([3, 4, 5]);
    });

    it("calls predicate only as long as it returns true", () => {
      let predicate = jest.fn(i => i < 3);

      from([1, 2, 3, 4, 5])
        .skipWhile(predicate)
        .toArray();

      expect(predicate).toBeCalledTimes(3);
    });

    it("skips all when we return true", () => {
      expect(
        from([1, 2, 3])
          .skipWhile(() => true)
          .toArray()
      ).toEqual([]);
    });

    it("skips none when we return false", () => {
      expect(
        from([1, 2, 3])
          .skipWhile(() => false)
          .toArray()
      ).toEqual([1, 2, 3]);
    });

    it("can be at the end of a chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .skipWhile(x => x < 3)
          .toArray()
      ).toEqual([3, 4]);
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

    it("can be at the end of a chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .some(x => x === 3)
      ).toBe(true);
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
      const sequence = from([5, 2, 3, 1, 4, 1]).sortBy();

      expect(copyIntoAnArray(sequence)).toEqual([1, 1, 2, 3, 4, 5]);
      expect(copyIntoAnArray(sequence)).toEqual([1, 1, 2, 3, 4, 5]);
    });

    it("can be at the end of a chain", () => {
      expect(
        from([1, 4])
          .concat([3, 2])
          .sortBy()
          .toArray()
      ).toEqual([1, 2, 3, 4]);
    });

    it("works with objects", () => {
      expect(
        from({ john: 20, mary: 30, abraham: 10 })
          .map(([a, b]) => [a, b + 1])
          .sortBy(x => x[0])
          .toArray()
      ).toEqual([["abraham", 11], ["john", 21], ["mary", 31]]);
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
      const sequence = from([5, 2, 3, 1, 4, 1]).sortByDescending();

      expect(copyIntoAnArray(sequence)).toEqual([5, 4, 3, 2, 1, 1]);
      expect(copyIntoAnArray(sequence)).toEqual([5, 4, 3, 2, 1, 1]);
    });

    it("can be at the end of a chain", () => {
      expect(
        from([1, 4])
          .concat([3, 2])
          .sortByDescending()
          .toArray()
      ).toEqual([4, 3, 2, 1]);
    });
  });

  describe("sum", () => {
    it("returns 0 for empty sequences", () => {
      expect(from<number>([]).sum()).toEqual(0);
    });

    it("sums numbers correctly", () => {
      expect(from([1, 2, 3]).sum()).toEqual(6);
    });

    it("sums strings correctly", () => {
      expect(from(["1", "2", "3"]).sum()).toEqual("123");
    });

    it("sums other than numbers as strings", () => {
      expect(from([true, false]).sum()).toEqual("truefalse");
    });

    it("sums numbers from key selector", () => {
      expect(from([true, false, true, false]).sum(x => (x ? 1 : 0))).toEqual(2);
    });

    it("sums strings from key selector correctly", () => {
      expect(
        from([true, false, true, false]).sum(x => (x ? "1" : "0"))
      ).toEqual("1010");
    });

    it("can be at the end of a chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .sum()
      ).toBe(10);
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
      const sequence = from([1, 2, 3, 4, 5]).take(2);

      expect(copyIntoAnArray(sequence)).toEqual([1, 2]);
      expect(copyIntoAnArray(sequence)).toEqual([1, 2]);
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

    it("can be at the end of a chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .take(4)
          .toArray()
      ).toEqual([1, 2, 3, 4]);
    });
  });

  describe("takeWhile", () => {
    it("takes items until the predicate returns false", () => {
      expect(
        from([1, 2, 3, 4, 5])
          .takeWhile(i => i < 3)
          .toArray()
      ).toEqual([1, 2]);
    });

    it("calls predicate only as long as it returns true", () => {
      let predicate = jest.fn(i => i < 3);

      from([1, 2, 3, 4, 5])
        .takeWhile(predicate)
        .toArray();

      expect(predicate).toBeCalledTimes(3);
    });

    it("takes all when we return true", () => {
      expect(
        from([1, 2])
          .takeWhile(() => true)
          .toArray()
      ).toEqual([1, 2]);
    });

    it("takes none when we return false", () => {
      expect(
        from([1, 2, 3, 4, 5])
          .takeWhile(() => false)
          .toArray()
      ).toEqual([]);
    });

    it("pulls only items until false is returned", () => {
      let numTaken = 0;

      const source = function*() {
        numTaken++;
        yield 1;
        numTaken++;
        yield 2;
        numTaken++;
        yield 3;
      };

      from(source())
        .takeWhile(i => i !== 2)
        .toArray();
      expect(numTaken).toEqual(2);
    });

    it("can be at the end of a chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .takeWhile(x => true)
          .toArray()
      ).toEqual([1, 2, 3, 4]);
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

      const sequence = from(items)
        .sortBy(item => item.age)
        .thenBy(item => item.name);

      expect(copyIntoAnArray(sequence)).toEqual([
        { name: "Jane", age: 20 },
        { name: "John", age: 20 },
        { name: "Lisa", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Tony", age: 30 },
      ]);
      expect(copyIntoAnArray(sequence)).toEqual([
        { name: "Jane", age: 20 },
        { name: "John", age: 20 },
        { name: "Lisa", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Tony", age: 30 },
      ]);
    });

    it("works with iterables", () => {
      const items = [
        { name: "John", age: 20 },
        { name: "Tony", age: 30 },
        { name: "Lisa", age: 30 },
        { name: "Jane", age: 20 },
        { name: "Mark", age: 30 },
      ];

      expect(
        from(new Set(items))
          .sortBy(x => x.age)
          .thenBy(x => x.name)
          .toArray()
      ).toEqual([
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

      const sequence = from(items)
        .sortBy(item => item.age)
        .thenByDescending(item => item.name);

      expect(copyIntoAnArray(sequence)).toEqual([
        { name: "John", age: 20 },
        { name: "Jane", age: 20 },
        { name: "Tony", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Lisa", age: 30 },
      ]);
      expect(copyIntoAnArray(sequence)).toEqual([
        { name: "John", age: 20 },
        { name: "Jane", age: 20 },
        { name: "Tony", age: 30 },
        { name: "Mark", age: 30 },
        { name: "Lisa", age: 30 },
      ]);
    });
  });

  describe("without", () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    it("should return a sequence without values", () => {
      const sequence = from(numbers).without([1, 3, 5]);

      expect(copyIntoAnArray(sequence)).toStrictEqual([2, 4, 6]);
    });

    it("should use a predicate function", () => {
      const items = [
        { id: 0, name: "John", age: 20 },
        { id: 1, name: "Tony", age: 30 },
        { id: 2, name: "Mark", age: 30 },
        { id: 3, name: "Jane", age: 20 },
        { id: 4, name: "Lisa", age: 30 },
      ];
      const without = [
        { id: 0, name: "", age: 0 },
        { id: 1, name: "", age: 0 },
        { id: 2, name: "", age: 0 },
      ];

      const sequence = from(items).without(without, (a, b) => a.id === b.id);

      expect(copyIntoAnArray(sequence)).toStrictEqual([
        { id: 3, name: "Jane", age: 20 },
        { id: 4, name: "Lisa", age: 30 },
      ]);
    });

    it("can be at the end of a chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .without([2, 3])
          .toArray()
      ).toEqual([1, 4]);
    });
  });

  describe("prepend", () => {
    it("should prepend values to a sequence", () => {
      const sequence = from([1, 2, 3]).prepend([4, 5, 6]);

      expect(copyIntoAnArray(sequence)).toStrictEqual([4, 5, 6, 1, 2, 3]);
    });

    it("can be at the end of a chain", () => {
      expect(
        from([1, 2])
          .concat([3, 4])
          .prepend([0])
          .toArray()
      ).toEqual([0, 1, 2, 3, 4]);
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
      const sequence = from([1, 2]);

      expect(sequence.toArray()).toEqual([1, 2]);
      expect(sequence.toArray()).toEqual([1, 2]);
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

    it("#87 types return value correctly when element selector is not given", () => {
      type Result = {
        key: number;
        val: string;
      };

      const result: { [key: number]: Result } = from([
        { key: 1, val: "a" },
        { key: 2, val: "b" },
      ]).toObject(x => x.key);

      expect(result).toEqual({
        1: { key: 1, val: "a" },
        2: { key: 2, val: "b" },
      });
    });

    it("#87 types return value correctly for number keyd object when element selector is given", () => {
      const result: { [key: number]: string } = from([
        { key: 1, val: "a" },
        { key: 2, val: "b" },
      ]).toObject(x => x.key, x => x.val);

      expect(result).toEqual({
        1: "a",
        2: "b",
      });
    });

    it("#87 types return value correctly for string keyd object when element selector is given", () => {
      const result: { [key: string]: number } = from({
        "1": { key: 1, val: "a" },
        "2": { key: 2, val: "b" },
      }).toObject(x => x[0], x => x[1].key);

      expect(result).toEqual({
        "1": 1,
        "2": 2,
      });
    });
  });

  describe("toSet", () => {
    it("returns a Set", () => {
      expect(from([1, 2]).toSet()).toEqual(new Set([1, 2]));
    });
  });
});
