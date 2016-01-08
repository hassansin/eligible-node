var errors = require('../lib/errors'),
    expect = require('chai').expect,
    playback = require('./record'),
    claim = require('../lib/models/claim'),
    Config = require('../lib/http/config');

var config, Claim;

describe('Claim', function() {

  before(function() {
    config = new Config({
      apiKey: 'n5Cddnj2KST6YV9J2l2ztQQ2VrdPfzA4JPbn',
      isTest: true,
    });
    Claim = claim(config);
    process.env.NODE_ENV = 'testing';
  });

  describe('#create', function() {

    playback('claim/create', true);

    it('exists as public method on Claim', function() {
      expect(Claim).to.have.property('create');
    });

    it('should throw InvalidRequestError when no param is passed',
      function(done) {
        Claim.create()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            expect(e.response)
              .to.have
              .deep.property('errors[0].code', 'billing_provider_required');
            done();
          })
          .catch(done);
      });

    it('should create new claim', function(done) {
      Claim.create(require('./fixtures/claim/claim.json'))
        .then(function(claim) {
          expect(claim).to.be.an.instanceOf(Claim);
          expect(claim).to.have.property('reference_id');
          expect(claim).to.have.property('acknowledgements');
          done();
        })
        .catch(done);
    });

    it('should fetch acknowledgements for a claim', function(done) {
      // jshint camelcase: false
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

      var claim = new Claim({reference_id: '12121212'});
      claim.acknowledgements()
        .then(function(data) {
          console.log(data);
          done();
        })
        .catch(done);
    });

  });

});
