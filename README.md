# TODO REST API 

When you use `expect`, you write assertions similarly to how you would say them, e.g. "I expect this value to be equal to 3" or "I expect this array to contain 3". When you write assertions in this way, you don't need to remember the order of actual and expected arguments to functions like `assert.equal`, which helps you write better tests.

You can think of `expect` as a more compact alternative to [Chai](http://chaijs.com/) or [Sinon.JS](http://sinonjs.org/), just without the pretty website. ;)

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

