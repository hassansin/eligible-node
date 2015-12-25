# eligible-node

[![Circle CI](https://circleci.com/gh/eligible/eligible-node.svg?style=svg)](https://circleci.com/gh/eligible/eligible-node)

Node.js bindings for Eligible APIs (https://eligible.com).

You can request an account at https://eligible.com/request-access


Documentation
=============

Refer to https://eligible.com/rest for full documentation on Eligible APIs, their request parameters
and expected response formats.



Requirements
============

Node.js 0.8.0 and above


Installation
============


```sh
npm install eligible-node --save
```

Usage
=====

#### Create instance
```js

var Eligible = require('eligible-node');

// Get values from environment variable if nothing passed in arguments
// available env variables: ELIGIBLE_API_KEY, ELIGIBLE_IS_TEST
var eligible = Eligible(); 

//or, pass them as object:
var eligible = Eligible({
    apiKey: 'foobar',
    isTest: false
});

//or, pass Config object
var config = new Eligible.Config;
config->setApiKey('foobar')
config->setTest(true);
var eligible = Eligible(config); 

```

#### Payer
```
eligible.Payer.retrieve(62308)
.then(function(payer){
    console.log(payer)
})
.catch(Eligible.APIConnectionError, function(e){
    console.log('Connection Error');
})
.catch(Eligible.AuthenticationError, function(e){
    console.log('Authentication Error', e.message, e.code);
})
.catch(function(e){
    console.log(e);
});

```


Errors
=====
The library throws following errors.

- APIConnectionError
- APIErrorResponseError
- APIError
- AuthenticationError
- InvalidRequestError

Testing
======

```js

npm test
npm run test-coverage

```