# fromfrom

[![Greenkeeper badge](https://badges.greenkeeper.io/tomi/fromfrom.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.com/tomi/fromfrom.svg?branch=master)](https://travis-ci.com/tomi/fromfrom)
[![Coveralls](https://img.shields.io/coveralls/tomi/fromfrom.svg)](https://coveralls.io/github/tomi/fromfrom)
[![Dev Dependencies](https://david-dm.org/tomi/fromfrom/dev-status.svg)](https://david-dm.org/tomi/fromfrom?type=dev)

fromfrom is a [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query) inspired library to transform sequences of data.

## Installation

```bash
npm install --save fromfrom
```

## Usage

The library exports only a single function, `from`. `from` wraps the given source data into an `Enumerable`. `Enumerable` has a wide range of chainable methods to operate and transform the sequence. The sequence can then be converted into a JS type.

For example

```ts
import { from } from "fromfrom";

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
