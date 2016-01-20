# eligible-node

[![Circle CI](https://circleci.com/gh/eligible/eligible-node.svg?style=svg)](https://circleci.com/gh/eligible/eligible-node)

Node.js bindings for Eligible APIs (https://eligible.com). Eligible is built for developers needing HIPAA compliant connectivity to health insurance companies.

You can request an account at https://eligible.com/request-access

  * [Documentation](#documentation)
  * [Requirements](#requirements)
  * [Installation](#installation)
  * [Usage](#usage)
    * [Create instance](#create-instance)
    * [Test Mode](#test-mode)
    * [Payer](#payer)
    * [Coverage](#coverage)
      * [Retrieve Coverage](#retrieve-coverage)
      * [Retrieve Medicare](#retrieve-medicare)
      * [Retrieve Cost Estimates](#retrieve-cost-estimates)
  * [Errors](#errors)
  * [Testing](#testing)


## Documentation

Refer to https://eligible.com/rest for full documentation on Eligible APIs, their request parameters
and expected response formats.



## Requirements

Node.js 0.8.0 and above


## Installation


```sh
npm install eligible-node --save
```

## Usage


### Create instance

First create an `Eligible` object by passing the your api key. You can pass the api key directly or as an object. You may also pass environment variables to load your api key.

```js

var Eligible = require('eligible-node');

// Get values from environment variables if nothing is passed in arguments
// available env variables: ELIGIBLE_API_KEY, ELIGIBLE_IS_TEST
var eligible = Eligible(); 

//or, pass them as object:
var eligible = Eligible({
    apiKey: 'foobar',
    isTest: true
});

//or, pass Config object
var config = new Eligible.Config;
config->setApiKey('foobar')
config->setTest(true);
var eligible = Eligible(config); 

```

### Test Mode

To make the Eligible as explorable as possible, accounts have test-mode as well as live-mode. See above example to enable test mode on any of your requests and hit the sandbox. 

### Payer

```
eligible.Payer.retrieve(62308)
.then(function(payer){
  console.log(payer)
})
.catch(Eligible.APIConnectionError, function(e){
  console.log('Connection Error');
})
.catch(Eligible.AuthenticationError, function(e){
    console.log('Authentication Error', e.message, e.code, e.response);
})
.catch(function(e){
  console.log(e);
});

```


### Coverage

#### Retrieve Coverage

```js
eligible.Coverage.all({
  payer_id: '00001',
  provider_last_name: 'Doe',
  provider_first_name: 'John',
  provider_npi: '0123456789',
  member_id: 'ZZZ445554301',
  member_first_name: 'IDA',
  member_last_name: 'FRANKLIN',
  member_dob: '1701-12-12',
  service_type: '30',
})
.then(function(coverage) {
  console.log(coverage)
})
.catch(function(e) {
  //
});
```

#### Retrieve Medicare

```js
eligible.Coverage.medicare({
  provider_npi: '0123456789',
  member_id: 'ZZZ445554301',
})
.then(function(medicare) {
  console.log(medicare);
})
.catch(function(e) {
  //
});
```

#### Retrieve Cost Estimates

```js
eligible.Coverage.costEstimates({
  provider_npi: '0123456789',
  provider_price: '1500.50',
  service_type: '1',
  network: 'IN',
})
.then(function(costEstimates) {
  console.log(costEstimates);
})
.catch(function(e) {
  //
});
```

## Errors

The library throws following error objects.

- Eligible.APIConnectionError
- Eligible.APIErrorResponseError
- Eligible.APIError
- Eligible.AuthenticationError
- Eligible.InvalidRequestError

The following table describes the properties of the error object.

|  Property  |       Type       |                             Description                             |
|:----------:|:----------------:|:-------------------------------------------------------------------:|
| `message`  | string           | The error message                                                   |
| `code`     | number           | When the error occurs during an HTTP request, the HTTP status code. |
| `response` | object or string | HTTP response as JSON, if JSON not available raw response is stored |


To catch individual errors, use [bluebird catch syntax](http://bluebirdjs.com/docs/api/catch.html).


## Testing

Use the following commands to run tests or test coverage:

```sh
npm test
npm run test-coverage
```

Note that, by default running above commands will mock HTTP requests using [nock](https://github.com/pgte/nock) library. To disable mocking and make actaul calls against eligible server, pass `NOCK_OFF=true` enviroment variable:

`NOCK_OFF=true npm test`

To filter tests, update `grep` field in `test/mocha.opts`.
