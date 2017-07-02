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

  '/user/:userId/message/:messageId': {
    get: getMessage,                // Matches 'GET' request '/user/1/message/2?key=11&editMode'
    post: updateMessage,            // Matches 'POST' request '/user/a007/message/911'
    other: handleMessage            // Matches other request methods
  },                                // You can use 'any', 'all', or '_' keywords instead of 'other'

  '/': handleIndex,

  '': handle404                     // "Empty string route" catches all other requests

})).listen(80);


function getMessage(req, res) {     // '/user/1/message/2?key=11&editMode'
  console.log(req.params);          // {userId: '1', messageId: '2'}
  console.log(req.query);           // {key: '11', editMode: ''}
}

function postMessage(req, res) {    // '/user/a007/message/911'
  console.log(req.params);          // {userId: 'a007', messageId: '911'}
}

function handleMessage(req, res) {} // Matches other request methods with '/user/a/message/b'

function handleIndex(req, res) {}   // Matches '/' request with any method used

function handle404(req, res) {}     // Matches all other requests
```

Documentation will be soon. To be continued... :)