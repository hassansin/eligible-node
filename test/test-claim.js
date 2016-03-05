var errors = require('../lib/errors'),
    expect = require('chai').expect,
    playback = require('./record'),
    claim = require('../lib/models/claim'),
    Config = require('../lib/http/config');

var config, Claim;

describe('Claim', function() {

  before(function() {
    config = new Config({
      apiKey: process.env.ELIGIBLE_API_KEY,
      isTest: true,
    });
    Claim = claim(config);
    process.env.NODE_ENV = 'testing';
  });

  describe('#create', function() {

    playback('claim/create');

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

    it('should throw InvalidRequestError when invalid service_lines is passed',
      function(done) {
        Claim.create(
          require('./fixtures/claim/claim-invalid-service-lines.json')
        )
        .then(function() {
          // Success, where we were expecting an error - test should fail
          done(new Error('Expecting InvalidRequestError, got 200'));
        })
        .catch(function(e) {
          expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
          expect(e.code).to.eql(400);
          expect(e.response)
            .to.have
            .deep.property('errors[0].code', 'claim_service_lines');
          expect(e.response)
              .to.have
              .deep.property('errors[0].param', 'claim[service_lines]');
          done();
        })
        .catch(done);
      });

    it('should create new claim', function(done) {
      Claim.create(require('./fixtures/claim/claim.json'))
        .then(function(claim) {
          expect(claim).to.be.an.instanceOf(Claim);
          expect(claim).to.have.property('reference_id');
          done();
        })
        .catch(done);
    });

  });

  describe('#getAcknowledgements', function() {

    playback('claim/getAcknowledgements');

    it('exists as public method on Claim', function() {
      expect(Claim).to.have.property('getAcknowledgements');
    });

    it('should throw InvalidRequestError when no reference_id is passed',
      function(done) {
        Claim.getAcknowledgements()
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

    it('should retrieve acknowledgements for a claim',
      function(done) {
        Claim.getAcknowledgements('12121212')
          .then(function(data) {
            expect(data).to.have.property('acknowledgements');
            done();
          })
          .catch(done);
      });

  });

  describe('#queryAcknowledgements', function() {

    playback('claim/queryAcknowledgements');

    it('exists as public method on Claim', function() {
      expect(Claim).to.have.property('queryAcknowledgements');
    });

    it('should retrieve all acknowledgements',
      function(done) {
        Claim.queryAcknowledgements()
          .then(function(data) {
            expect(data).to.have.property('acknowledgements');
            done();
          })
          .catch(done);
      });

  });

  describe('#getPaymentReports', function() {

    playback('claim/getPaymentReports');

    it('exists as public method on Claim', function() {
      expect(Claim).to.have.property('getPaymentReports');
    });

    it('should throw InvalidRequestError when no reference_id is passed',
      function(done) {
        Claim.getPaymentReports()
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

    it('should retrieve payment report for a claim',
      function(done) {
        Claim.getPaymentReports('BDA85HY09IJ')
          .then(function(data) {
            expect(data).to.be.an.instanceOf(Claim.PaymentReport);
            done();
          })
          .catch(done);
      });

    it('should retrieve the specified payment report for a claim',
      function(done) {
        Claim.getPaymentReports('BDA85HY09IJ', 'ABX45DGER44')
          .then(function(data) {
            expect(data).to.be.an.instanceOf(Claim.PaymentReport);
            done();
          })
          .catch(done);
      });
  });

  describe('#queryPaymentReports', function() {

    playback('claim/queryPaymentReports');

    it('exists as public method on Claim', function() {
      expect(Claim).to.have.property('queryPaymentReports');
    });

    it('should retrieve all payment reports',
      function(done) {
        Claim.queryPaymentReports()
          .then(function(data) {
            expect(data).to.have.property('reports');
            done();
          })
          .catch(done);
      });

  });

  describe('#claimInstance', function() {
    playback('claim/claimInstance');

    it('should have an acknowledgements method', function() {
      // jshint camelcase: false
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

      var claim = new Claim({reference_id: '12121212'});
      expect(claim).to.have.property('acknowledgements');
    });

    it('should retrieve acknowledgements for this instance',
      function(done) {
        // jshint camelcase: false
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

        var claim = new Claim({reference_id: '12121212'});
        claim.acknowledgements()
          .then(function(data) {
            expect(data).to.have.property('acknowledgements');
            done();
          })
          .catch(done);
      });

    it('should have a paymentReports method', function() {
      // jshint camelcase: false
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

      var claim = new Claim({reference_id: 'BDA85HY09IJ'});
      expect(claim).to.have.property('paymentReports');
    });

    it('should retrieve payment_reports for this instance',
      function(done) {
        // jshint camelcase: false
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

        var claim = new Claim({reference_id: 'BDA85HY09IJ'});
        claim.paymentReports()
          .then(function(data) {
            expect(data).to.be.an.instanceOf(Claim.PaymentReport);
            done();
          })
          .catch(done);
      });

    it('should retrieve the specified payment_reports for this instance',
      function(done) {
        // jshint camelcase: false
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

        var claim = new Claim({reference_id: 'BDA85HY09IJ'});
        claim.paymentReports('ABX45DGER44')
          .then(function(data) {
            expect(data).to.be.an.instanceOf(Claim.PaymentReport);
            done();
          })
          .catch(done);
      });


  });

  describe('#realtime', function() {

    playback('claim/realtime');

    it('exists as public method on Claim', function() {
      expect(Claim).to.have.property('realtime');
    });

    it('should get realtime claim', function(done) {
      Claim.realtime(require('./fixtures/claim/claim.json'))
        .then(function(claim) {
          expect(claim).to.have.property('id');
          done();
        })
        .catch(done);
    });

  });

});
