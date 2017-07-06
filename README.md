# just-router
Clean, fast and simple node js router with no dependencies

```js
const http = require('http');
const router = require('just-router');

http.createServer(router({
  '/': (req, res) => res.end('hello world!')
})).listen(80);
```

## Installation

```bash
🍄 npm i just-router
```

## Examples

Create routelist and add it to router like this

```js
http.createServer(router({
  '/api/user/:id': {get: getUser, delete: deleteUser},
  '/api/user':     {post: createUser},
  '/src/::file':   {get: getStatic},
  '/':             {get: getIndex, other: elseIndex},
  '':              handle404
})).listen(80);
```

or like this

```js
router({
  '/api/user/:id': {get: getUser, delete: deleteUser},
  '/api/user':     {post: createUser},
  '/src/::file':   {get: getStatic},
  '/':             {get: getIndex, other: elseIndex},
  '':              handle404
});

http.createServer(router).listen(80);
```

and then just handle the routes

```js
function getUser(req, res) {     // GET '/api/user/1?key=2&edit'
  console.log(req.params);       // {id: '2'}
  console.log(req.query);        // {key: '3', edit: ''}
}

function deleteUser(req, res) {  // DELETE '/api/user/5'
  console.log(req.params);       // {id: '5'}
}

function createUser(req, res) {} // POST '/api/message'

function getStatic(req, res) {   // GET '/src/js/app.js'
  console.log(req.params);       // {file: '/js/app.js'}
}

function getIndex(req, res) {}   // GET '/'

function elseIndex(req, res) {}  // "any other method" '/'

function handle404(req, res) {}  // "all methods" all other requests
```

You can call `router(newRouteList)` whenever you want to change the routes to new ones

## Documentation

### Initialisation

```js
const router = require('just-router');
```

### router

`router` can be called with 1 or 2 arguments:
- `router(routeList)`
  - accepts `routeList`
  - returns `router` which is waiting for 2 arguments
- `router(req, res)`
  - accepts `req` and `res` from server's request

### routeList

`routeList` is a simple object with routes

```js
let routeList = {
	'/route': routeHandleFunction,
	'/route/2': routeHandleObject
}
```

### route

`route` is a path template, which can **include** `:variables` or **ends** by `::pathEnding`

`/user/:userId/messages/:messageId` will match
- `/user/1/messages/2` and `req.params` will be `{userId: '1', messageId: '2'}`
- `/user/Morty/messages/lol?token=777&debugMode`
- but **NOT** `/user/1/messages` and `/user/1/2/messages/3`

`/src/::filePath` will match
- `/src/img/logo.png` and `req.params` will be `{filePath: '/img/logo.png'}`
- `/src/templates/widget/header.pug`

#### Special routes

- `'/'` is the "root route"
- `''` is the "others route" that catches all requests that did not match before

`:variables`/`::pathEndings` and `?search=string&values` can be found in `req.params` and `req.query` objects respectively

`::pathEndings` values​start with the '/' character, and the `:variables` values​are not

### routeHandleFunction and routeHandleObject

- `route: routeHandleFunction` handles ALL request methods
- `route: routeHandleObject` is an object whose keys are the names of the request methods or universal key 'other'. Its values are `routeHandleFunctions`
```js
let routeHandleObject = {
	get: routeHandleFunction,
	post: routeHandleFunction2,
	other: routeHandleFunction3  // aliases: all || any || else || _
}

function routeHandleFunction(req, res) {}
```
If the methods did not match, then the `other` `routeHandleFunction` is called. `other` keyword has aliases: `all`, `any`, `else` and `_`

## Match examples

### `/user/:id/message/:mId`

|OK 👍|BAD IDEA 👎|
|---|---|
|**`/user/1/message/2`**|`/user/1/message/`|
|**`/user/1/message/2/`**|`/user/1//message/2`|
|**`/user//message//`**|`/user/message/1`|
|**`/user/_/message/2?lol`**|`/user/1/message/2/3`|
|**`/user/:id/message//?c=5&x`**|`/user/:id/message/?c=5&x`|

### `/api/::id`

|OK 👍|BAD IDEA 👎|
|---|---|
|**`/api/1`**|`/api/`|
|**`/api/////1//2`**|`/api`|
|**`/api/a/b/c?lol=1&x=`**|`/api?1`|
|**`/api//?1`**|`/api/?1`|
|**`/api/1?1`**||

### `/id`

|OK 👍|BAD IDEA 👎|
|---|---|
|**`/id`**|`/id/id`|
|**`/id/`**|`/?id`|
|**`/id?id`**|`/id//`|
|**`/id/?ea`**||

## Philosophy

`just-router`
- is tiny and probably quickest
- is NOT overloaded with additional functionality
- has simple one-method syntax
- has simple and beautiful `routeList`
- takes care of your `node_modules` size
- has no dependencies
- 🍄