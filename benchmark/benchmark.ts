import * as Benchmark from "benchmark";
import * as faker from "faker";
import { from } from "../src/fromfrom";

type Country = "FI" | "SE" | "NO" | "DK" | "IS";

interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  country: Country;
  score: number;
}

const countries = ["FI", "SE", "NO", "DK", "IS"] as Country[];

const generateData = (howMany: number): IUser[] =>
  Array.from({ length: howMany }).map((_, id) => ({
    id,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    title: faker.name.title(),
    email: faker.internet.email(),
    country: faker.random.arrayElement(countries),
    score: faker.random.number({ min: 1000, max: 10000 }),
  }));

const HOW_MANY = 10000;

const data = generateData(HOW_MANY);

const suite = new Benchmark.Suite();

suite.add("concat", () => from(data).concat(data).toArray());
suite.add("distinct", () => from(data).map(x => x.country).distinct().toArray());
suite.add("every", () => from(data).every(x => x.id < 9000));
suite.add("filter", () => from(data).filter(x => x.country === "FI").toArray());
suite.add("find", () => from(data).find(x => x.id > 9000));
suite.add("first", () => from(data).first());
suite.add("flatMap", () => from(data).flatMap(x => [x.firstName, x.lastName]).toArray());
suite.add("forEach", () => from(data).forEach(x => x.firstName + x.lastName));
suite.add("groupBy - key selector", () => from(data).groupBy(x => x.country).toArray());
suite.add("groupBy - value selector", () => from(data).groupBy(x => x.country, x => x.score).toArray());
suite.add("includes", () => from(data).includes(data[9823]));
suite.add("isEmpty", () => from(data).isEmpty());
suite.add("last", () => from(data).last());
suite.add("map", () => from(data).map(x => ({ id: x.id, name: `${x.title} ${x.firstName} ${x.lastName}`})).toArray());
suite.add("pick", () => from(data).pick("id", "country", "score").toArray());
suite.add("prepend", () => from(data).prepend(data).toArray());
suite.add("reduce", () => from(data).reduce((acc, x) => Math.max(acc, x.score), Number.NEGATIVE_INFINITY));
suite.add("reverse", () => from(data).reverse().toArray());
suite.add("skip", () => from(data).skip(5000).toArray());
suite.add("skipWhile", () => from(data).skipWhile(x => x.id < 5000));
suite.add("some", () => from(data).some(x => x.id > 9000));
suite.add("sortBy - key selector", () => from(data).sortBy(x => x.firstName).toArray());
suite.add("sortBy - comparer selector", () => from(data).sortBy(x => x.firstName, (a, b) => {
  a = a.toLowerCase(), b = b.toLowerCase();
  return a < b ? -1 : a > b ? 1 : 0;
}).toArray());
suite.add("thenBy", () => from(data).sortBy(x => x.country).thenBy(x => x.score).toArray());
suite.add("sortByDescending", () => from(data).sortBy(x => x.score).toArray());
suite.add("sum", () => from(data).sum(x => x.score));
suite.add("take", () => from(data).take(5000).toArray());
suite.add("takeWhile", () => from(data).takeWhile(x => x.id < 5000).toArray());
suite.add("without", () => from(data).without([data[5], data[10], data[20]]).toArray());
suite.add("toMap", () => from(data).toMap(x => x.id));
suite.add("toObject", () => from(data).toObject(x => x.id));
suite.add("toSet", () => from(data).toSet());

suite
  .on("cycle", function(event: any) {
    console.log(String(event.target));
  })
  .run({ async: true });
