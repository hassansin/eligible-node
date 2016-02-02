var errors = require('../lib/errors'),
    expect = require('chai').expect,
    playback = require('./record'),
    payer = require('../lib/models/payer'),
    Config = require('../lib/http/config');

var config, Payer;

describe('Payer', function() {

  before(function() {
    config = new Config({
      apiKey: 'n5Cddnj2KST6YV9J2l2ztQQ2VrdPfzA4JPbn',
      isTest: true,
    });
    Payer = payer(config);
    process.env.NODE_ENV = 'testing';
  });

  describe('#all', function() {

    playback('payer/all');

    it('exists as public method on Payer', function() {
      expect(Payer).to.have.property('all');
    });

    it('should get a list of payers', function(done) {
      Payer.all({
        endpoint: 'precertification create',
      })
      .then(function(payers) {
        expect(payers[0]).to.be.an.instanceOf(Payer);
        expect(payers[0]).to.have.property('payer_id');
        done();
      })
      .catch(done);
    });
  });

  describe('#retrieve', function() {

    playback('payer/retrieve');

    it('exists as public method on Payer', function() {
      expect(Payer).to.have.property('retrieve');
    });

    it('should throw InvalidRequestError when no payer_id is passed',
      function(done) {
        Payer.retrieve()
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

    it('should throw InvalidRequestError when invalid payer_id is passed',
      function(done) {
        Payer.retrieve('foo')
          .then(function() {
            // Success, where we were expecting an error - test should fail
            done(new Error('Expecting InvalidRequestError, got 200'));
          })
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
            expect(e.code).to.eql(404);
            done();
          })
          .catch(done);
      });

    it('should retrieve a payer',
      function(done) {
        Payer.retrieve('62308')
          .then(function(payer) {
            expect(payer).to.be.an.instanceOf(Payer);
            expect(payer).to.have.property('payer_id');
            done();
          })
          .catch(done);
      });

  });

  describe('#searchOptions', function() {

    playback('payer/searchOptions');

    it('exists as public method on Payer', function() {
      expect(Payer).to.have.property('searchOptions');
    });

    it('should get seach options for a payer', function(done) {
      Payer.searchOptions('62308')
      .then(function(data) {
        expect(data).to.have.property('search_options');
        expect(data).to.have.property('payer_id');
        done();
      })
      .catch(done);
    });
  });

  describe('#payerInstance', function() {
    playback('payer/payerInstance');

    it('should have an searchOptions method', function() {
      // jshint camelcase: false
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

      var payer = new Payer({payer_id: '62308'});
      expect(payer).to.have.property('searchOptions');
    });

    it('should retrieve search options for this instance',
      function(done) {
        // jshint camelcase: false
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

        var payer = new Payer({payer_id: '62308'});
        payer.searchOptions()
          .then(function(data) {
            expect(data).to.have.property('search_options');
            expect(data).to.have.property('payer_id');
            done();
          })
          .catch(done);
      });
  });
});
