var errors = require('../lib/errors'),
    expect = require('chai').expect,
    playback = require('./record'),
    coverage = require('../lib/models/coverage'),
    Config = require('../lib/http/config');

var config, Coverage;

describe('Coverage', function() {

  before(function() {
    config = new Config({
      apiKey: 'n5Cddnj2KST6YV9J2l2ztQQ2VrdPfzA4JPbn',
      isTest: true,
    });
    Coverage = coverage(config);
    process.env.NODE_ENV = 'testing';
  });

  describe('#all', function() {

    playback('coverage/all');

    it('exists as public method on Coverage', function() {
      expect(Coverage).to.have.property('all');
    });

    it('should throw InvalidRequestError when no param is passed',
      function(done) {
        Coverage.all()
          .then(function(coverage) {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            done();
          });
      });

    it('should fetch coverage', function(done) {
      // jshint camelcase: false
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      Coverage.all({
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
        expect(coverage).to.be.an.instanceOf(Coverage);
        done();
      })
      .catch(function(e) {
        done(e);
      });
    });

  });
});
