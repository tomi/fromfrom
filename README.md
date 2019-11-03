# fromfrom

[![Greenkeeper badge](https://badges.greenkeeper.io/tomi/fromfrom.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.com/tomi/fromfrom.svg?branch=master)](https://travis-ci.com/tomi/fromfrom)
[![Coveralls](https://img.shields.io/coveralls/tomi/fromfrom.svg)](https://coveralls.io/github/tomi/fromfrom)
[![Dev Dependencies](https://david-dm.org/tomi/fromfrom/dev-status.svg)](https://david-dm.org/tomi/fromfrom?type=dev)
[![Sponsored](https://img.shields.io/badge/chilicorn-sponsored-brightgreen.svg?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAMAAADjyg5GAAABqlBMVEUAAAAzmTM3pEn%2FSTGhVSY4ZD43STdOXk5lSGAyhz41iz8xkz2HUCWFFhTFFRUzZDvbIB00Zzoyfj9zlHY0ZzmMfY0ydT0zjj92l3qjeR3dNSkoZp4ykEAzjT8ylUBlgj0yiT0ymECkwKjWqAyjuqcghpUykD%2BUQCKoQyAHb%2BgylkAyl0EynkEzmkA0mUA3mj86oUg7oUo8n0k%2FS%2Bw%2Fo0xBnE5BpU9Br0ZKo1ZLmFZOjEhesGljuzllqW50tH14aS14qm17mX9%2Bx4GAgUCEx02JySqOvpSXvI%2BYvp2orqmpzeGrQh%2Bsr6yssa2ttK6v0bKxMBy01bm4zLu5yry7yb29x77BzMPCxsLEzMXFxsXGx8fI3PLJ08vKysrKy8rL2s3MzczOH8LR0dHW19bX19fZ2dna2trc3Nzd3d3d3t3f39%2FgtZTg4ODi4uLj4%2BPlGxLl5eXm5ubnRzPn5%2Bfo6Ojp6enqfmzq6urr6%2Bvt7e3t7u3uDwvugwbu7u7v6Obv8fDz8%2FP09PT2igP29vb4%2BPj6y376%2Bu%2F7%2Bfv9%2Ff39%2Fv3%2BkAH%2FAwf%2FtwD%2F9wCyh1KfAAAAKXRSTlMABQ4VGykqLjVCTVNgdXuHj5Kaq62vt77ExNPX2%2Bju8vX6%2Bvr7%2FP7%2B%2FiiUMfUAAADTSURBVAjXBcFRTsIwHAfgX%2FtvOyjdYDUsRkFjTIwkPvjiOTyX9%2FAIJt7BF570BopEdHOOstHS%2BX0s439RGwnfuB5gSFOZAgDqjQOBivtGkCc7j%2B2e8XNzefWSu%2BsZUD1QfoTq0y6mZsUSvIkRoGYnHu6Yc63pDCjiSNE2kYLdCUAWVmK4zsxzO%2BQQFxNs5b479NHXopkbWX9U3PAwWAVSY%2FpZf1udQ7rfUpQ1CzurDPpwo16Ff2cMWjuFHX9qCV0Y0Ok4Jvh63IABUNnktl%2B6sgP%2BARIxSrT%2FMhLlAAAAAElFTkSuQmCC)](http://spiceprogram.org/oss-sponsorship)
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors)

fromfrom is a [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query) inspired library to transform sequences of data.

## Installation

```bash
npm install --save fromfrom
```

## Documentation

Find it [here](https://tomi.github.io/fromfrom/).

## Usage

The library exports only a single function, [`from`](https://tomi.github.io/fromfrom/api/index.html#from). [`from`](https://tomi.github.io/fromfrom/api/index.html#from) wraps the given source data into a [`Sequence`](https://tomi.github.io/fromfrom/api/classes/sequence.html). [`Sequence`](https://tomi.github.io/fromfrom/api/classes/sequence.html) has a wide range of chainable methods to operate and transform the sequence. The sequence can then be converted into a JS type.

For example

```ts
import { from } from "fromfrom";

// Transform an array of users
const users = [
  { id: 1, name: "John", age: 31, active: true },
  { id: 2, name: "Jane", age: 32, active: false },
  { id: 3, name: "Luke", age: 33, active: false },
  { id: 4, name: "Mary", age: 34, active: true },
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

See "how does it work" section from the initial [release blog post](https://github.com/tomi/fromfrom/wiki/Announcing-fromfrom#how-does-it-work).

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

This project is a grateful recipient of the [Futurice Open Source sponsorship program](https://spiceprogram.org). :heart:

Forked from [TypeScript library starter](https://github.com/alexjoverm/typescript-library-starter)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/tomi"><img src="https://avatars2.githubusercontent.com/u/10324676?v=4" width="100px;" alt="Tomi Turtiainen"/><br /><sub><b>Tomi Turtiainen</b></sub></a><br /><a href="https://github.com/tomi/fromfrom/commits?author=tomi" title="Code">💻</a> <a href="https://github.com/tomi/fromfrom/commits?author=tomi" title="Documentation">📖</a> <a href="#infra-tomi" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/tomi/fromfrom/commits?author=tomi" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/jtenner"><img src="https://avatars1.githubusercontent.com/u/3761339?v=4" width="100px;" alt="jtenner"/><br /><sub><b>jtenner</b></sub></a><br /><a href="https://github.com/tomi/fromfrom/commits?author=jtenner" title="Code">💻</a> <a href="https://github.com/tomi/fromfrom/commits?author=jtenner" title="Tests">⚠️</a> <a href="https://github.com/tomi/fromfrom/commits?author=jtenner" title="Documentation">📖</a></td>
    <td align="center"><a href="https://vaaralav.com"><img src="https://avatars0.githubusercontent.com/u/8571541?v=4" width="100px;" alt="Ville Vaarala"/><br /><sub><b>Ville Vaarala</b></sub></a><br /><a href="#maintenance-vaaralav" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/dogoku"><img src="https://avatars0.githubusercontent.com/u/761999?v=4" width="100px;" alt="Theo"/><br /><sub><b>Theo</b></sub></a><br /><a href="https://github.com/tomi/fromfrom/commits?author=dogoku" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/hollannikas"><img src="https://avatars0.githubusercontent.com/u/9109662?v=4" width="100px;" alt="Rudolf Poels"/><br /><sub><b>Rudolf Poels</b></sub></a><br /><a href="https://github.com/tomi/fromfrom/commits?author=hollannikas" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!