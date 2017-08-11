# TODO REST API 

It is a simple todo API that was writen in Node.js using such technologies :
*express
*mongodb
  *mongoose
*mocha
  *expect
  *supertest

## Routes

### POST /todos

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

