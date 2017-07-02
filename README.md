# just-router
Clean, fast and simple node js router with no dependencies

```js
const http = require('http');
const router = require('just-router');

http.createServer(router({
  '/': (req, res) => res.send('hello world!')
})).listen(80);
```

## Installation

```bash
$ npm install just-router
```

## Examples

```js
http.createServer(router({
  '/api/user/:id': {get: getUser, delete: deleteUser},
  '/api/user':     {post: createUser},
  '/src/:file':    {get: getStatic},
  '/':             {get: getIndex, other: elseIndex},
  '':              handle404
})).listen(80);

function getUser(req, res) {     // GET '/api/user/1?key=2&edit'
  console.log(req.params);          // {id: '2'}
  console.log(req.query);           // {key: '3', edit: ''}
}

function deleteUser(req, res) {  // DELETE '/api/user/5'
  console.log(req.params);       // {id: '5'}
}

function createUser(req, res) {} // POST '/api/message'

function getStatic(req, res) {   // GET '/src/logo.png'
  console.log(req.params);       // {file: 'logo.png'}
}

function getIndex(req, res) {}   // GET '/'

function elseIndex(req, res) {}  // "any other method" '/'

function handle404(req, res) {}  // "all metohds" all other requests
```

Documentation will be soon. To be continued... :)