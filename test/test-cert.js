var tls = require('tls');
var getPeerCertificateOld = tls.TLSSocket.prototype.getPeerCertificate;

var request = require('request');
var onRequestResponseOld = request.Request.prototype.onRequestResponse;

var expect = require('chai').expect,
    Config = require('../lib/http/config'),
    errors = require('../lib/errors'),
    client = require('../lib/http/client');

var config;

describe('Client#Cert', function() {
  before(function() {
    config = new Config({
      apiKey: 'n5Cddnj2KST6YV9J2l2ztQQ2VrdPfzA4JPbn',
      isTest: true,
    });
  });

  describe('fingerprint', function() {
    before(function() {
      // Override getPeerCertificate to supply false fingerprint
      tls.TLSSocket.prototype.getPeerCertificate = function(detailed) {
        var cert = getPeerCertificateOld.apply(this, detailed);
        cert.fingerprint = 'foobar';
        return cert;
      };
    });
    it('should throw APIConnectionError when fingerprint does not match',
      function(done) {
        client('get', 'foo', null, config)
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.APIConnectionError);
            expect(e.message).to.eql('SSL fingerprint mismatch.');
            done();
          })
          .catch(done);
      });
    after(function() {
      tls.TLSSocket.prototype.getPeerCertificate = getPeerCertificateOld;
    });
  });

  describe('certificate', function() {
    before(function() {
      // Fake SSL error
      request.Request.prototype.onRequestResponse  = function(response) {
        response.socket.authorized = false;
        response.socket.authorizationError = 'fake error message';
        return onRequestResponseOld.call(this, response);
      };
    });

    it('should throw APIConnectionError when certificate is invalid',
      function(done) {
        client('get', 'foo', null, config)
          .catch(function(e) {
            expect(e).to.be.an.instanceOf(errors.APIConnectionError);
            expect(e.message).to.eql('SSL Error: fake error message');
            done();
          })
          .catch(done);
      });
    after(function() {
      request.Request.prototype.onRequestResponse = onRequestResponseOld;
    });
  });
});

