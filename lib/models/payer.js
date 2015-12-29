var request = require('../http/client');
var Resource = require('./resource');
var util = require('util');

module.exports = function(config) {

  function Payer(attributes) {
    Resource.call(this, attributes);
  }

  Payer.retrieve = function(id) {
    return request('get', 'payers/' + id, null, config)
		.then(function(json) {
  return new Payer(json);
		});
  };

  util.inherits(Payer, Resource);

  return Payer;
};
