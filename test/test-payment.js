var errors = require('../lib/errors'),
    expect = require('chai').expect,
    playback = require('./record'),
    payment = require('../lib/models/payment'),
    Config = require('../lib/http/config');

var config, Payment;

describe('Payment', function() {

  before(function() {
    config = new Config({
      apiKey: process.env.ELIGIBLE_API_KEY,
      isTest: true,
    });
    Payment = payment(config);
    process.env.NODE_ENV = 'testing';
  });

  describe('#status', function() {

    playback('payment/status');

    it('exists as public method on Payment', function() {
      expect(Payment).to.have.property('status');
    });

    it('should throw InvalidRequestError when no param is passed',
      function(done) {
        Payment.status()
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

    it('should fetch payment status', function(done) {
      // jshint camelcase: false
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      Payment.status({
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
        expect(payment).to.be.an.instanceOf(Payment);
        expect(payment).to.have.deep.property('payer.id');
        expect(payment).to.have.deep.property('claims[0].statuses[0].paid');
        done();
      })
      .catch(done);
    });
  });
});
