# Seqenum

<!-- [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/tomi/seqenum.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/tomi/seqenum.svg)](https://travis-ci.org/tomi/seqenum)
[![Coveralls](https://img.shields.io/coveralls/tomi/seqenum.svg)](https://coveralls.io/github/tomi/seqenum)
[![Dev Dependencies](https://david-dm.org/tomi/seqenum/dev-status.svg)](https://david-dm.org/tomi/seqenum?type=dev) -->

Seqenum is a [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query) inspired library to transform sequences of data.

## Usage

The library exports only a single function, `from`. `from` wraps the given source data into an `Enumerable`. `Enumerable` has a wide range of chainable methods to operate and transform the sequence. The sequence can then be converted into a JS type.

For example

```ts
// Transform an array of users
const users = [
  { id: 1, name: "John", age: 31, active: true },
  { id: 2, name: "Jane", age: 32, active: false },
  { id: 3, name: "Luke", age: 33, active: false },
  { id: 4, name: "Mary", age: 34, active: true }
];

from(users)
  .filter(user => user.active)
  .sortByDescending(user => user.age)
  .toArray();
// Returns
// [
//   { id: 4, name: "Mary", age: 34, active: true },
//   { id: 1, name: "John", age: 31, active: true }
// ]
```

## Features

- **Familiar method names** - Even though it's LINQ inspired, uses familiar method names from JS.
- **Supports all main JS types** - Works with arrays, objects, maps, sets, and objects that implement the [iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).
- **No dependencies** - Guarantees small size.
- **Type safe** - Written in TypeScript. Type definitions included.
- **Deferred execution** - The execution of the sequence is deferred until you begin consuming the sequence.
- **Fully tested** - 100% test coverage.

## How does it work

## Importing library

TODO

## Development

### NPM scripts

- `npm t`: Run test suite
- `npm start`: Run `npm run build` in watch mode
- `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
- `npm run test:prod`: Run linting and generate coverage
- `npm run build`: Generate bundles and typings, create docs
- `npm run lint`: Lints code
- `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

## Acknowledgement

Made with :heart: by [@TomiTurtiainen](https://twitter.com/TomiTurtiainen).

This project is a grateful recipient of the [Futurice Open Source sponsorship program](https://spiceprogram.org). ♥

Forked from [TypeScript library starter](https://github.com/alexjoverm/typescript-library-starter)
