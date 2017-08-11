# expect [![Travis][build-badge]][build] [![npm package][npm-badge]][npm]

[build-badge]: https://img.shields.io/travis/mjackson/expect/master.svg?style=flat-square
[build]: https://travis-ci.org/mjackson/expect

[npm-badge]: https://img.shields.io/npm/v/expect.svg?style=flat-square
[npm]: https://www.npmjs.org/package/expect

[expect](https://github.com/mjackson/expect) lets you write better assertions.

When you use `expect`, you write assertions similarly to how you would say them, e.g. "I expect this value to be equal to 3" or "I expect this array to contain 3". When you write assertions in this way, you don't need to remember the order of actual and expected arguments to functions like `assert.equal`, which helps you write better tests.

You can think of `expect` as a more compact alternative to [Chai](http://chaijs.com/) or [Sinon.JS](http://sinonjs.org/), just without the pretty website. ;)

## Installation

Using [npm](https://www.npmjs.org/):

    $ npm install --save expect

Then, use as you would anything else:

```js
// using ES6 modules
import expect, { createSpy, spyOn, isSpy } from 'expect'

// using CommonJS modules
var expect = require('expect')
var createSpy = expect.createSpy
var spyOn = expect.spyOn
var isSpy = expect.isSpy
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/expect/umd/expect.min.js"></script>
```

You can find the library on `window.expect`.

## Routes

### HTTP method:POST Route:/todos

> `expect(object).toExist([message])`

Asserts the given `object` is truthy.

```js
expect('something truthy').toExist()
```

Aliases:
  - `toBeTruthy`

### toNotExist

> `expect(object).toNotExist([message])`

Asserts the given `object` is falsy.

```js
expect(null).toNotExist()
```

Aliases:
  - `toBeFalsy`

### toBe

> `expect(object).toBe(value, [message])`

