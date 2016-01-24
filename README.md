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
    * [Example](#example)
    * [Coverage](#coverage)
      * [Retrieve Coverage](#retrieve-coverage)
      * [Retrieve Medicare](#retrieve-medicare)
      * [Retrieve Cost Estimates](#retrieve-cost-estimates)
    * [Payment](#payment)
      * [Payment Status](#payment-status)
    * [Claim](#claim)
      * [Create a Claim](#create-a-claim)
      * [Retrieve Single Claim Acknowledgements](#retrieve-single-claim-acknowledgements)
      * [Retrieve Multiple Claims Acknowledgements](#retrieve-multiple-claims-acknowledgements)
      * [Retrieve Single Claim Payment Report](#retrieve-single-claim-payment-report)
      * [Retrieve Specific Claim Payment Report](#retrieve-specific-claim-payment-report)
      * [Retrieve Multiple Claim Payment Report](#retrieve-multiple-claim-payment-report)
    * [Payer](#payer)
      * [List All Payers](#list-all-payers)
      * [View a Payer](#view-a-payer)
      * [Search Options](#search-options)
      * [Search Options of a Payer](#search-options-of-a-payer)
    * [Customer](#customer)
      * [Create a Customer](#create-a-customer)
      * [Update a Customer](#update-a-customer)
      * [View a Customer](#view-a-customer)
      * [List Customers](#list-customers)
    * [Referral](#referral)
      * [Referral Inquiry](#referral-inquiry)
      * [Create A Referral](#create-a-referral)
  * [Errors](#errors)
  * [Testing](#testing)
  * [Developing](#developing)


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

First create an `Eligible` object by passing your api key. You can pass the api key directly or as an object. You may also load your api key from environment variables.

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

### Example

Complete example on how to use the library:

```js

var Eligible = require('eligible-node');
var eligible = Eligible({
    apiKey: 'n5Cddnj2KST6YV9J2l2ztQQ2VrdPfzA4JPbn',
    isTest: true
});

// Retrieve a payer and it's search options

eligible.Payer.retrieve('62308')
  .then(function(payer){
    console.log(payer.payer_id);
    return payer.searchOptions(); //retrieve search options
  })
  .then(function(searchOptions){
    console.log(searchOptions)
  })
  .catch(Eligible.APIConnectionError, function(e){
    console.log('Connection Error');
  })
  .catch(Eligible.AuthenticationError, function(e){
      console.log('Authentication Error', e.message, e.code, e.response);
  })
  .catch(Eligible.InvalidRequestError, function(e){
      console.log('InvalidRequestError', e.message, e.code, e.response);
  })
  .catch(function(e){
    console.log(e);
  });
```
See [Errors](#errors) for a list of Error types.

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

### Payment

#### Payment Status

```js
eligible.Payment.status({
  payer_id: '00001',
  provider_last_name: 'Doe',
  provider_first_name: 'John',
  provider_npi: '0123456789',
  member_id: 'ZZZ445554301',
  member_first_name: 'IDA',
  member_last_name: 'FRANKLIN',
  member_dob: '1701-12-12',
  payer_control_number: 123123123,
  charge_amount: 125.00,
  start_date: '2010-06-15',
  end_date: '2010-06-15',
  trace_number: 'BHUYTOK98IK',
})
.then(function(payment) {
  console.log(payment)
})
.catch(function(e) {

});
```

### Claim

#### Create a Claim

```js
eligible.Claim.create(params)
  .then(function(claim) { // returns a claim instance
    console.log(claim);
    return claim.acknowledgements(); // get acknowledgements for this claim
  })
  .then(function(acknowledgements){
    console.log(acknowledgements);
  })
  .catch(function(e){
    //
  });
```

#### Retrieve Single Claim Acknowledgements

```js
eligible.Claim.getAcknowledgements('12121212')
  .then(function(data) {
    console.log(data);
  })
```

or, using `claim` instance either created manually or returned by `Claim.create()` method

```js
var claim = new eligible.Claim({'reference_id': '12121212'});
claim.acknowledgements()
  .then(function(data) {
    console.log(data);
  })
```

#### Retrieve Multiple Claims Acknowledgements

```js
eligible.Claim.queryAcknowledgements(query)
  .then(function(data) {
  })
```

#### Retrieve Single Claim Payment Report

```js
eligible.Claim.getPaymentReport('BDA85HY09IJ')
	.then(function(payment) {
	})
```

or, using `claim` instance either created manually or returned by `Claim.create()` method

```js
var claim = new eligible.Claim({'reference_id': 'BDA85HY09IJ'});
claim.paymentReports()
  .then(function(payment_report) {
    console.log(payment_report);
  })
```

#### Retrieve Specific Claim Payment Report

```js
eligible.Claim.getPaymentReport('BDA85HY09IJ', 'ABX45DGER44')
	.then(function(payment) {
	})
```
or, using `claim` instance either created manually or returned by `Claim.create()` method

```js
var claim = new eligible.Claim({'reference_id': 'BDA85HY09IJ'});
claim.paymentReports('ABX45DGER44')
  .then(function(payment_report) {
    console.log(payment_report);
  })
```

#### Retrieve Multiple Claim Payment Report

```js
eligible.Claim.queryPaymentReports(query)
	.then(function(data) {
	})
```



### Payer

#### List All Payers

```js
eligible.Payer.all({
    endpoint: 'coverage',
  })
  .then(function(payers) {
    console.log(payers);
  })
```

#### View a Payer

```js
eligible.Payer.retrieve('62308')
	.then(function(payer) {
	  return payer.searchOptions()
	})
	//retrieve search options for this payer
	.then(function(searchOptions){
	   console.log(searchOptions)
	})
	.catch()
```

#### Search Options

```js
eligible.Payer.searchOptions()
	.then(function(searchOptions) {
	  console.log(searchOptions)
	})
```

#### Search Options of a Payer

```js
eligible.Payer.searchOptions('62308')
	.then(function(searchOptions) {
	})
```
or, using `payer` instance either:

```js
var payer = new eligible.Payer({payer_id: '62308'});
payer.searchOptions()
  .then(function(searchOptions) {
    console.log(searchOptions);
  })
```

### Customer

#### Create a Customer

```js
eligible.Customer.create({
    customer: {
      name: 'ABC company',
    },
  })
  .then(function(customer) {
    console.log(customer.id);
  })
  .catch();
```

#### Update a Customer

```js
eligible.Customer.update('TN344YY67HH09KK', {
    customer: {
      name: 'XYZ company',
    },
  })
  .then(function(customer) {
    console.log(customer.id);
  })
  .catch(done);
```

#### View a Customer

```js
eligible.Customer.get('TN344YY67HH09KK')
  .then(function(customer) {
    console.log(customer.id);
  })
  .catch();
```

#### List Customers

```js
eligible.Customer.all({
    page: 1,
  })
  .then(function(data) {
    console.log(data.customers);
  })
  .catch();
```


### Referral

#### Referral Inquiry

```js
eligible.Referral.inquiry({
  payer_id: '60054',
  payer_name: 'Aetna',
  provider_type: 'attending',
  provider_last_name: 'Doe',
  provider_first_name: 'John',
  provider_npi: '0123456789',
  provider_phone_number: '1234567890',
  provider_taxonomy_code: '291U00000X',
  member_id: 'ZZZ445554301',
  member_first_name: 'IDA',
  member_last_name: 'FRANKLIN',
  member_dob: '1701-12-12',
  from_date: '2014-01-01',
  to_date: '2015-01-01',
})
.then(function(referral) {
})
.catch(done);
```

#### Create A Referral

```js
eligible.Referral.create(params)
  .then(function(referral) {
  })
  .catch(done);
```

## Errors

The library throws following error objects.

- Eligible.APIConnectionError
- Eligible.APIResponseError
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

## Developing

To work on the library:

1. Clone the repo.
2. Install dependencies: `npm install`
3. Fix bugs or add features. Make sure the changes pass the coding guidelines by runing: `npm run lint` or `npm run watch`
4. Write tests. For HTTP mocking [`nock`](https://github.com/pgte/nock) library is used. Nock definitions are saved in `test/fixtures` directory
5. Run test by `npm test` or `npm run test-coverage`
