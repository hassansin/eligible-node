var request = require('../http/client');
var Resource = require('./resource');
var util = require('util');
var extend = require('extend');

module.exports = function(config) {

  function Claim(attributes) {
    Resource.call(this, attributes);
  }

  Claim.create = function(params) {
    return request('post', 'claims', params, config)
      .then(function(json) {
        json = extend(json, params); // Merge input json claim with response

        // jshint camelcase: false
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        delete json.success;
        delete json.api_key;
        delete json.test;

        return new Claim(json);
      });
  };

  util.inherits(Claim, Resource);

  Claim.prototype.acknowledgements = function() {
    // jshint camelcase: false
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

    return request(
      'get',
      'claims/' + this.reference_id + '/acknowledgements',
      {},
      config
    ).then(function(json) {
      return json;
    });
  };

  return Claim;
};
