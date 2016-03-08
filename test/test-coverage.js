var errors = require('../lib/errors'),
    expect = require('chai').expect,
    playback = require('./record'),
    coverage = require('../lib/models/coverage'),
    Config = require('../lib/http/config');

var config, Coverage;

describe('Coverage', function() {

  before(function() {
    config = new Config({
      apiKey: process.env.ELIGIBLE_API_KEY,
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
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            expect(e.response)
              .to.have.deep.property('error.reject_reason_code', '41');
            done();
          })
          .catch(done);
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
      .catch(done);
    });
  });

  describe('#medicare', function() {
    playback('coverage/medicare');

    it('exists as public method on Medicare', function() {
      expect(Coverage).to.have.property('all');
    });

    it('should throw InvalidRequestError when no param is passed',
      function(done) {
        Coverage.medicare()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.response)
              .to.have.deep.property('error.reject_reason_code', '41');
            done();
          })
          .catch(done);
      });

    it('should fetch medicare', function(done) {
      // jshint camelcase: false
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      Coverage.medicare({
        provider_npi: '0123456789',
        member_id: 'ZZZ445554301',
      })
      .then(function(medicare) {
        expect(medicare).to.be.an.instanceOf(Coverage.Medicare);
        expect(medicare).to.have.deep.property('plan_types.MA');
        done();
      })
      .catch(done);
    });
  });

  describe('#costEstimates', function() {
    playback('coverage/costEstimates');

    it('exists as public method on costEstimates', function() {
      expect(Coverage).to.have.property('all');
    });

    it('should throw InvalidRequestError when no param is passed',
      function(done) {
        Coverage.costEstimates()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.response)
              .to.have.deep.property('error.reject_reason_code', '41');
            done();
          })
          .catch(done);
      });

    it('should fetch costEstimates', function(done) {
      // jshint camelcase: false
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      Coverage.costEstimates({
        provider_npi: '0123456789',
        provider_price: '1500.50',
        service_type: '1',
        network: 'IN',
      })
      .then(function(costEstimates) {
        expect(costEstimates).to.be.an.instanceOf(Coverage.CostEstimates);
        expect(costEstimates).to.have
          .deep.property('cost_estimates[0].cost_estimate');
        done();
      })
      .catch(done);
    });
  });
});
