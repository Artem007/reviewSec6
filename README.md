# TODO REST API #

It is a simple todo API that was writen in Node.js using next technologies:
* express
* mongodb
  * mongoose
* mocha
  * expect
  * supertest

## Routes

### POST /todos
Creates todo in a database with a specific properties. Should be used with with POSY http method and in the body of request must be JSON data with only one property specifed - ** text ** property.

### GET /todos

### GET /todos/id

### DELETE /todos/id

### PATCH /todos/id


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

