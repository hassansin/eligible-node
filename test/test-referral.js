var errors = require('../lib/errors'),
    expect = require('chai').expect,
    playback = require('./record'),
    referral = require('../lib/models/referral'),
    Config = require('../lib/http/config');

var config, Referral;

describe('Referral', function() {

  before(function() {
    config = new Config({
      apiKey: process.env.ELIGIBLE_API_KEY,
      isTest: true,
    });
    Referral = referral(config);
    process.env.NODE_ENV = 'testing';
  });

  describe('#inquiry', function() {

    playback('referral/inquiry');

    it('exists as public method on Referral', function() {
      expect(Referral).to.have.property('inquiry');
    });

    it('should throw InvalidRequestError when no param is passed',
      function(done) {
        Referral.inquiry()
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


    it('should get certifications and authorizations.', function(done) {
      // jshint camelcase: false
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      Referral.inquiry({
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
        expect(referral).to.be.an.instanceOf(Referral);
        expect(referral).to.have.property('x12');
        done();
      })
      .catch(done);
    });
  });

  describe('#create', function() {

    playback('referral/create');

    it('exists as public method on Referral', function() {
      expect(Referral).to.have.property('create');
    });

    it('should throw InvalidRequestError when no param is passed',
      function(done) {
        Referral.create()
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(400);
            done();
          })
          .catch(done);
      });

    // Sandbox implementation pending
    it.skip('should create new referral', function(done) {
      Referral.create(require('./fixtures/referral/referral.json'))
      .then(function(referral) {
        expect(referral).to.be.an.instanceOf(Referral);
        done();
      })
      .catch(done);
    });

  });

});
