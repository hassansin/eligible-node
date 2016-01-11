var request = require('../http/client');
var Resource = require('./resource');
var util = require('util');

module.exports = function(config) {

  function Coverage(attributes) {
    Resource.call(this, attributes);
  }

  Coverage.all = function(params, callback) {
    return request('get', 'coverage/all.json', params, config)
		.then(function(json) {
  return new Coverage(json);
		});
  };

  util.inherits(Coverage, Resource);

  return Coverage;
};
